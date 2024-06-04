import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PrivateChatMessages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChatMessages, setShowChatMessages] = useState(false);
  const [intendedMessage, setIntendedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [senderId, setSenderId] = useState('');

  useEffect(() => {
    fetchAllChats();
  }, []);

  const fetchAllChats = async () => {
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/user/showAllMyChats', { withCredentials: true });
      setChats(response.data.myChats);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const fetchSpecificChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`https://grad-project-3zvo.onrender.com/app/user/showSpecificChat/${chatId}`, { withCredentials: true });
      const formattedMessages = response.data.specificChat.AllMessages.map(message => ({
        ...message,
        date: formatDate(message.date),
        senderId: message.messageOwner._id,
        senderUsername: message.messageOwner.userName,
        senderImage: message.messageOwner.image
      }));
      setChatMessages(formattedMessages);
      setShowChatMessages(true);
      setReceiverId(response.data.specificChat.receiver._id);
      setSenderId(response.data.specificChat.sender._id);
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  };

  const handleChatButtonClick = async (chatId) => {
    if (selectedChat === chatId) {
      setShowChatMessages(false);
      setSelectedChat(null);
    } else {
      setSelectedChat(chatId);
      await fetchSpecificChatMessages(chatId);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete('https://grad-project-3zvo.onrender.com/app/user/deleteSpecificChat', {
        withCredentials: true,
        data: { chatID: chatId }
      });
      toast.success('Chat has been deleted successfully');
      await fetchAllChats();
      setShowChatMessages(false);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  async function getMyUserId() {
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/user/showMyProfile', { withCredentials: true });
      const myProfile = response.data.my_Profile;
      const userId = myProfile._id;
      localStorage.setItem('userId', userId);
      return userId;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  const sendMessage = async () => {
    setIsLoading(true);
    try {
      const myUserId = await getMyUserId();
      let finalReceiverId = receiverId;
      if (receiverId === myUserId) {
        finalReceiverId = senderId;
      }
      await axios.post('https://grad-project-3zvo.onrender.com/app/user/sendMessagePrivte', {
        receiverID: finalReceiverId,
        intendedMessage: intendedMessage
      }, { withCredentials: true });
      setIntendedMessage('');
      toast.success('Message has been sent successfully');
      if (selectedChat) {
        await fetchSpecificChatMessages(selectedChat);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div style={{ 
      margin: '50px auto',
      maxWidth: '800px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Chats</h1>
        {chats.length === 0 && <p>No chats yet</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chats.map(chat => (
            <li style={{ 
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }} key={chat._id}>
              {chat.chatName.split('|_|').map((email, index) => (
                <span key={index} style={{ color: index === 0 ? 'blue' : 'green' }}>
                  {index === 0 ? 'Receiver: ' : 'Sender: '}{email}
                  {index !== chat.chatName.split('|_|').length - 1 && <>&nbsp;&nbsp;</>}
                </span>
              ))}
              <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                <button style={{ 
                  padding: '8px 16px',
                  marginRight: '8px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }} onClick={() => handleChatButtonClick(chat._id)}>Show Messages</button>
                <button style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }} onClick={() => handleDeleteChat(chat._id)}>Delete Chat</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showChatMessages && (
        <div style={{ marginTop: '30px' }}>
          <h1 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Chat Messages</h1>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {chatMessages.map(message => (
              <li style={{ 
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: message.senderId === senderId ? '#e2f5e3' : '#e8f0fe',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' 
              }} key={message._id}>
 <img
                        src={`https://grad-project-3zvo.onrender.com${message.messageOwner.image}`}
                        alt="Profile"
                        className="img-fluid rounded-circle mb-3"
                        style={{ width: '50px', height: '50px', border: '2px solid black', objectFit: 'cover', marginRight: '10px' }}
                      />             
                         <div>
                  <p style={{ marginBottom: '5px', color: message.senderId === senderId ? '#28a745' : '#007bff' }}>{message.senderUsername}:{message.theMessage}</p>
                  <p>{message.date}</p>
                </div>
              </li>
            ))}
          </ul>
          <form style={{ marginTop: '30px' }} onSubmit={e => { e.preventDefault(); sendMessage(); }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="intendedMessage" style={{ fontWeight: 'bold' }}>Message:</label>
              <textarea 
                id="intendedMessage" 
                rows="3" 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                }} 
                value={intendedMessage} 
                onChange={e => setIntendedMessage(e.target.value)} 
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
