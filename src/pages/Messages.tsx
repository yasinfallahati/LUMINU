import { useState, useEffect } from 'react';
import { Send, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { SectionTitle } from '../components/ui/SectionTitle';

export function Messages() {
  const { user } = useAuth();
  const { chats, photographers, addMessage, createChat, fetchChats } = useData();

  useEffect(() => {
    fetchChats();
  }, []);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const userChats = chats.filter(chat => chat.participants.includes(user?.id || ''));

  const getOtherParticipant = (chat: typeof chats[0]) => {
    const otherId = chat.participants.find(p => p !== user?.id);
    return photographers.find(p => p.id === otherId) || { id: '', name: 'کاربر', avatar: '', city: '' };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    addMessage(selectedChat, {
      senderId: user?.id || '',
      receiverId: chats.find(c => c.id === selectedChat)?.participants.find(p => p !== user?.id) || '',
      text: newMessage,
    });
    setNewMessage('');
  };

  const handleStartNewChat = async (photographerId: string) => {
    const chat = await createChat(photographerId);
    setSelectedChat(chat.id);
  };

  const currentChat = chats.find(c => c.id === selectedChat);

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="bg-white border-b border-border-light">
        <div className="container-wide py-10">
          <SectionTitle title="پیام‌ها" subtitle="گفتگوهای شما" />
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-border-light overflow-hidden" style={{ minHeight: '600px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            <div className="border-l border-border-light hidden md:block">
              <div className="p-5 border-b border-border-light">
                <div className="relative">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="جستجو..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 bg-surface-alt border border-border rounded-2xl text-sm focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                {userChats.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-text text-sm">هنوز گفتگویی ندارید</p>
                  </div>
                ) : (
                  userChats.map((chat) => {
                    const other = getOtherParticipant(chat);
                    return (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`w-full p-4 text-right border-b border-border-light hover:bg-surface-alt transition-colors duration-200 ${
                          selectedChat === chat.id ? 'bg-secondary/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <Avatar src={other.avatar} alt={other.name} fallback={other.name} size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary truncate">
                              {other.name}
                            </p>
                            <p className="text-sm text-text truncate">
                              {chat.lastMessage?.text || 'شروع گفتگو'}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="p-5 border-t border-border-light">
                <h3 className="text-sm font-medium text-primary mb-3">گفتگوی جدید</h3>
                <div className="space-y-2">
                  {photographers.slice(0, 5).map((photographer) => (
                    <button
                      key={photographer.id}
                      onClick={() => handleStartNewChat(photographer.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-surface-alt transition-colors duration-200 text-right"
                    >
                      <Avatar src={photographer.avatar} alt={photographer.name} fallback={photographer.name} size="sm" />
                      <span className="text-sm text-text">{photographer.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col">
              {currentChat ? (
                <>
                  {(() => {
                    const other = getOtherParticipant(currentChat);
                    return (
                      <>
                        <div className="p-5 border-b border-border-light flex items-center gap-3.5">
                          <Avatar
                            src={other.avatar}
                            alt={other.name}
                            fallback={other.name}
                            size="md"
                          />
                          <div>
                            <h3 className="font-medium text-primary">
                              {other.name}
                            </h3>
                            <p className="text-sm text-text">عکاس</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '400px' }}>
                    {currentChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-5 py-3.5 rounded-2xl ${
                            message.senderId === user?.id
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-surface-alt text-primary rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p
                            className={`text-xs mt-2 ${
                              message.senderId === user?.id ? 'text-white/50' : 'text-text-light'
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString('fa-IR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-5 border-t border-border-light">
                    <div className="flex gap-3">
                      <Input
                        value={newMessage}
                        onChange={setNewMessage}
                        placeholder="پیام خود را بنویسید..."
                        className="flex-1"
                      />
                      <Button type="submit">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Send className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-text">یک گفتگو را انتخاب کنید</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
