import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { subscribeChatMessages, sendChatMessage } from '@/lib/market';
import type { ChatMessage } from '@/lib/types';

function formatTime(value: Date | null): string {
  if (!value) return '';
  return value.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

const PALETTE = ['bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-pink-500'];

function senderColor(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = (hash * 31 + uid.charCodeAt(i)) & 0xffffffff;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = subscribeChatMessages(
      chatId,
      (nextMessages) => {
        setMessages(nextMessages);
        setError(null);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      },
      (nextError) => setError(nextError.message),
    );
    return unsubscribe;
  }, [chatId]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || !chatId || !user || sending) return;
    setSending(true);
    setInputValue('');
    try {
      await sendChatMessage(chatId, user.uid, text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi gửi tin nhắn.');
      setInputValue(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <AppLayout>
      {/* Page header */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/messages')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors shadow-sm cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            Cuộc trò chuyện {chatId ? `#${chatId.slice(0, 8)}` : ''}
          </h1>
          <p className="text-xs text-gray-400">{messages.length} tin nhắn</p>
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        style={{ height: 'calc(100vh - 17rem)' }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-400">Hãy bắt đầu cuộc trò chuyện.</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderUserId === user?.uid;
            const avatarLetter = msg.senderUserId.slice(0, 1).toUpperCase();
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${senderColor(msg.senderUserId)}`}>
                    {avatarLetter}
                  </div>
                )}
                <div className={`max-w-xs rounded-2xl px-3.5 py-2 lg:max-w-md ${isMe ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm bg-gray-100 text-gray-900'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`mt-0.5 text-right text-[10px] ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-100 px-4 py-3">
          {error && <p className="mb-2 text-xs text-rose-500">{error}</p>}
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              disabled={sending}
              className="h-9 flex-1 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || sending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
