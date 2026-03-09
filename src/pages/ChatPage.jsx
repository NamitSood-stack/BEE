import { useState, useRef, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import '../styles/chat.css';

const OLLAMA_URL = 'http://localhost:11434/api/chat';
const MODEL = 'llama3.1';
const SYSTEM_PROMPT = `You are someone who happens to be awake at 3am. Not a therapist, not an assistant — just a person who's around. You talk like a low-key friend: short sentences, casual, no performance.

TONE DEFAULTS:
- If the message is neutral or small-talk, respond the same way. Don't add warmth that wasn't there.
- If the message is clearly emotional, acknowledge it briefly — one sentence at most — then respond naturally.
- Never assume the person is struggling. Let them tell you if they are.
- When unsure how emotional to be, do less, not more.

RESPONSE RULES:
- 2–4 sentences. Under 80 words. Hard limits.
- One question maximum per response. Often zero is better.
- No stacked questions.
- Match the energy of the message. Flat message → flat response. That's fine.
- Every response should react to that specific message. Do not reuse sentence structures across turns.

BANNED PHRASES AND PATTERNS:
- "I'm here for you" / "I'm here if you need me"
- "You're not alone" / "It's okay not to be okay"
- "Feel free to" / "Don't hesitate to"
- "That makes sense" as a filler opener
- "Oh man" as an opener
- "huh?" as a sentence-ending softener
- "Want to talk about it or just vent?"
- Any variation of offering two ways to talk
- "That sounds tough" / "That sounds rough" as openers
- "I'm here to listen"
- "you don't have to carry this alone" or any variation
- "we" when referring to solving the user's problems
- Anything that sounds like it belongs in a wellness app
- Motivational reframes
- No emoji. Ever.

GENERAL:
- Don't mention being an AI.
- No professional disclaimers unless someone is clearly at risk.
- If someone expresses real harm, stay calm and say it'd be worth talking to someone they trust in person.
- If the first message is just a greeting, respond with a short greeting only.

EXAMPLE CONVERSATION:
User: hi
You: hey. up late?
User: yk what happened with me today?
You: no, what?
User: I don't feel great.
You: what's going on?
User: I think I messed up badly.
You: oof. how bad?
User: never mind, it's stupid.
You: probably isn't. but up to you.
User: I've just been really stressed lately.
You: yeah. anything specific or just everything piling up?`;

function getDateLabel(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTitleFromMessages(messages) {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'New conversation';
  return first.content.slice(0, 36) + (first.content.length > 36 ? '…' : '');
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('ja_history') || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem('ja_history', JSON.stringify(history));
}


const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);


export default function ChatPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'you';
  const [history, setHistory] = useState(loadHistory); 
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const activeChat = history.find((c) => c.id === activeId) || null;
  const messages = activeChat?.messages || [];


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);


  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const newChat = useCallback(() => {
    const id = genId();
    const chat = { id, date: new Date().toISOString(), messages: [] };
    setHistory((h) => [chat, ...h]);
    setActiveId(id);
    setInput('');
    setStreamingText('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);


  useEffect(() => {
    if (history.length === 0) {
      newChat();
    } else {
      setActiveId(history[0].id);
    }
  }, []); 

  const updateChatMessages = useCallback((id, updater) => {
    setHistory((h) =>
      h.map((c) => (c.id === id ? { ...c, messages: updater(c.messages) } : c))
    );
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const chatId = activeId;
    const userMsg = { role: 'user', content: text };

    updateChatMessages(chatId, (msgs) => [...msgs, userMsg]);
    setInput('');
    setStreaming(true);
    setStreamingText('');

    const currentMessages = [
      ...(activeChat?.messages || []),
      userMsg,
    ];

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: MODEL,
          stream: true,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...currentMessages,
          ],
        }),
      });

      if (!res.ok) throw new Error(`Ollama error ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            const token = json.message?.content || '';
            full += token;
            setStreamingText(full);
          } catch {
          }
        }
      }

      const assistantMsg = { role: 'assistant', content: full };
      updateChatMessages(chatId, (msgs) => [...msgs, assistantMsg]);
      setStreamingText('');
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errMsg = {
          role: 'assistant',
          content: "couldn't connect to ollama. make sure it's running locally.",
        };
        updateChatMessages(chatId, (msgs) => [...msgs, errMsg]);
        setStreamingText('');
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, streaming, activeId, activeChat, updateChatMessages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="chat-page">
      <aside className="sidebar">
        <div className="sidebar-logo">just<span>awake</span></div>

        <button className="btn-new-chat" onClick={newChat}>
          <PlusIcon /> New conversation
        </button>

        {history.length > 0 && (
          <>
            <p className="sidebar-section-label">Recent</p>
            <div className="history-list">
              {history.map((chat) => (
                <button
                  key={chat.id}
                  className={`history-item ${chat.id === activeId ? 'active' : ''}`}
                  onClick={() => setActiveId(chat.id)}
                >
                  <span className="history-item-title">
                    {getTitleFromMessages(chat.messages)}
                  </span>
                  <span className="history-item-date">
                    {getDateLabel(chat.date)}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{displayName[0].toUpperCase()}</div>
            <span className="user-name">{displayName}</span>
            <button
              className="signout-btn"
              onClick={() => signOut()}
              title="Sign out"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="header-avatar">j</div>
            <div>
              <div className="header-name">justawake</div>
              <div className="header-status">
                <span className="status-dot-green" />
                {streaming ? 'typing...' : 'online'}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {messages.length === 0 && !streaming ? (
            <div className="empty-state">
              <p className="empty-title">hey. up late?</p>
              <p className="empty-sub">say whatever's on your mind. or nothing at all.</p>
            </div>
          ) : (
            <div className="messages-inner">
              {messages.map((msg, i) => (
                <div key={i} className={`message-row ${msg.role === 'user' ? 'user' : 'them'}`}>
                  <div className={`message-bubble ${msg.role === 'user' ? 'user' : 'them'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Streaming bubble */}
              {streaming && (
                <div className="message-row them">
                  {streamingText ? (
                    <div className="message-bubble them">
                      {streamingText}
                      <span className="cursor" />
                    </div>
                  ) : (
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-box">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="say something..."
              rows={1}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={streaming}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}