import MessageBubble from './MessageBubble';
import "./MessageList.css"

const MessageList = ({ messages, onRetry }) => {
  return (
    <div className="chat-container">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} onRetry={onRetry} />
      ))}
    </div>
  );
};

export default MessageList;