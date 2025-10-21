import { useState, useEffect } from 'react';
import {
  getManagerSupportRequests,
  sendManagerMessage,
  getManagerMessages,
  closeManagerSupportRequest,
} from '../../../api/manager-support.service';
import './SupportModalManager.css';

interface SupportModalManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupportRequest {
  id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client: {
    id: string;
    name: string;
    email: string;
    contactPhone?: string;
  };
}

interface Message {
  id: string;
  createdAt: string;
  text: string;
  readAt?: string;
  author: {
    id: string;
    name: string;
  };
}

export default function SupportModalManager({ isOpen, onClose }: SupportModalManagerProps) {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');

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
      const requests = await getManagerSupportRequests();
      setSupportRequests(requests);
    } catch (error) {
      console.error('Error loading support requests:', error);
    }
  };

  const loadMessages = async (requestId: string) => {
    try {
      const msgs = await getManagerMessages(requestId);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedRequest || !newMessage.trim()) return;

    setIsLoading(true);
    try {
      await sendManagerMessage(selectedRequest, newMessage);
      setNewMessage('');
      await loadMessages(selectedRequest);
      await loadSupportRequests();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseRequest = async () => {
    if (!selectedRequest) return;

    try {
      await closeManagerSupportRequest(selectedRequest);
      await loadSupportRequests();
      setSelectedRequest(null);
      setMessages([]);
    } catch (error) {
      console.error('Error closing support request:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="support-modal-backdrop" onClick={onClose}>
      <div className="support-modal-window card-common" onClick={(e) => e.stopPropagation()}>
        <div className="support-modal-manager">
          <h2>Управление поддержкой</h2>
          <div className="support-content">
            <div className="requests-list">
              <h4>Обращения клиентов</h4>
              <div className="tabs">
                <button
                  className={activeTab === 'active' ? 'tab active' : 'tab'}
                  onClick={() => setActiveTab('active')}
                >
                  Активные ({supportRequests.filter(r => r.isActive).length})
                </button>
                <button
                  className={activeTab === 'closed' ? 'tab active' : 'tab'}
                  onClick={() => setActiveTab('closed')}
                >
                  Завершенные ({supportRequests.filter(r => !r.isActive).length})
                </button>
              </div>
              <ul>
                {supportRequests
                  .filter(request => activeTab === 'active' ? request.isActive : !request.isActive)
                  .map((request) => (
                    <li
                      key={request.id}
                      className={selectedRequest === request.id ? 'active' : ''}
                      onClick={() => setSelectedRequest(request.id)}
                    >
                      <div className="request-info">
                        <strong>{request.client.name}</strong>
                        <small>{request.client.email}</small>
                        <small>{new Date(request.createdAt).toLocaleDateString()}</small>
                      </div>
                      <div className="request-status">
                        {request.isActive ? (
                          <span className="active-badge">Активно</span>
                        ) : (
                          <span className="closed-badge">Закрыто</span>
                        )}
                        {request.isActive && request.hasNewMessages && <span className="new-messages">Новые сообщения</span>}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="chat-area">
              {selectedRequest ? (
                <>
                  <div className="messages">
                    {messages.map((msg) => (
                      <div key={msg.id} className="message">
                        <strong>{msg.author.name}:</strong> {msg.text}
                        <small>{new Date(msg.createdAt).toLocaleString()}</small>
                      </div>
                    ))}
                  </div>
                  <div className="message-input">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Введите сообщение..."
                      rows={3}
                      disabled={!supportRequests.find(r => r.id === selectedRequest)?.isActive}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !supportRequests.find(r => r.id === selectedRequest)?.isActive}
                    >
                      {isLoading ? 'Отправка...' : 'Отправить'}
                    </button>
                    {supportRequests.find(r => r.id === selectedRequest)?.isActive && (
                      <button onClick={handleCloseRequest} className="close-request-btn">
                        Закрыть обращение
                      </button>
                    )}
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
