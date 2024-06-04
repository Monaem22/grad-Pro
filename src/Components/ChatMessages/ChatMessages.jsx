import React from 'react';

const ChatMessages = ({ messages }) => {
  return (
    <div>
      <h5 className="mb-3">Chat Messages</h5>
      {messages.length === 0 ? (
        <p>No messages</p>
      ) : (
        <ul className="list-group">
          {messages.map((message) => (
            <li key={message._id} className="list-group-item">
              <strong>{message.messageOwner.userName}:</strong> {message.theMessage}
              <span className="float-end">{new Date(message.date).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatMessages;

