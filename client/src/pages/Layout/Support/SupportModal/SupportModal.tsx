import { useState, useEffect } from 'react';
import {
  createSupportRequest,
  sendMessage,
  getMessages,
  getSupportRequests,
} from '../../../../api/support.service';
import './SupportModal.css';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  _id: string;
  text: string;
  sentAt: string;
  author: {
    _id: string;
    name: string;
  };
}

interface SupportRequest {
  _id: string;
  isActive: boolean;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSupportRequests();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedRequest) {
      loadMessages(selectedRequest);
    }
  }, [selectedRequest]);

  const loadSupportRequests = async () => {
    try {
      const requests = await getSupportRequests();
      const sortedRequests = requests.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSupportRequests(sortedRequests);
    } catch (error) {
      console.error('Error loading support requests:', error);
    }
  };

  const loadMessages = async (requestId: string) => {
    try {
      const msgs = await getMessages(requestId);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleCreateRequest = async () => {
    setIsCreating(true);
    try {
      await createSupportRequest({ text: 'Новое обращение' });
      await loadSupportRequests();
    } catch (error) {
      console.error('Error creating support request:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedRequest || !newMessage.trim()) return;

    try {
      await sendMessage(selectedRequest, newMessage);
      setNewMessage('');
      await loadMessages(selectedRequest);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="support-modal-backdrop" onClick={onClose}>
      <div className="support-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="support-modal">
          <h3>Поддержка</h3>
          <div className="support-content">
            <div className="requests-list">
              <h4>Ваши обращения</h4>
              <button
                onClick={handleCreateRequest}
                disabled={isCreating}
                className="create-request-btn"
              >
                {isCreating ? 'Создание...' : 'Новое обращение'}
              </button>
              <ul>
                {supportRequests.map((request) => (
                  <li
                    key={request._id}
                    className={selectedRequest === request._id ? 'active' : ''}
                    onClick={() => setSelectedRequest(request._id)}
                  >
                    Обращение #{request._id.slice(-6)}
                    {request.isActive ? (
                      <span className="active-badge">Активно</span>
                    ) : (
                      <span className="closed-badge">Закрыто</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="chat-area">
              {selectedRequest ? (
                <>
                  <div className="messages">
                    {messages.map((msg, index) => {
                      const prevMsg = messages[index - 1];
                      const showDate = !prevMsg || new Date(msg.sentAt).toDateString() !== new Date(prevMsg.sentAt).toDateString();
                      return (
                        <div key={msg._id}>
                          {showDate && (
                            <div className="message-date">
                              {new Date(msg.sentAt).toLocaleDateString()}
                            </div>
                          )}
                          <div className='message-form'>
                          <div className="message">
                            <strong>{msg.author.name}:</strong> {msg.text}
                          </div>
                          <small>{new Date(msg.sentAt).toLocaleTimeString()}</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="message-input">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Введите сообщение..."
                      disabled={!supportRequests.find(r => r._id === selectedRequest)?.isActive}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!supportRequests.find(r => r._id === selectedRequest)?.isActive}
                    >
                      Отправить
                    </button>
                  </div>
                </>
              ) : (
                <p>Выберите обращение для просмотра чата</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
