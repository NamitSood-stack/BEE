import './ChatPreview.css';

const previewMessages = [
  { from: 'them', text: 'hey. up late?' },
  { from: 'me',   text: "yeah, can't stop thinking" },
  { from: 'them', text: 'about anything specific or just everything at once?' },
  { from: 'me',   text: 'kinda both honestly' },
  { from: 'them', text: 'yeah. that kind of night.' },
];

export default function ChatPreview() {
  return (
    <div className="chat-preview">
      <div className="chat-preview-header">
        <div className="avatar">j</div>
        <div>
          <div className="preview-name">Kindled</div>
          <div className="preview-status">
            <span className="status-dot" />
            online now
          </div>
        </div>
      </div>

      <div className="messages">
        {previewMessages.map((msg, i) => (
          <div key={i} className={`msg ${msg.from === 'me' ? 'user' : ''}`}>
            <div className={`bubble ${msg.from === 'them' ? 'them' : 'me'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}