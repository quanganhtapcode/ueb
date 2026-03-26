import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { subscribeMyChats } from '@/lib/market';
import type { MarketChat } from '@/lib/types';

function formatDate(value: Date | null): string {
  if (!value) return '';
  const now = new Date();
  const diffMs = now.getTime() - value.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return value.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return value.toLocaleDateString('vi-VN');
}

const PALETTE = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];

function chatColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<MarketChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeMyChats(
      user.uid,
      (nextChats) => { setChats(nextChats); setError(null); setLoading(false); },
      (nextError) => { setError(nextError.message); setLoading(false); },
    );
    return unsubscribe;
  }, [user]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Tin nhắn</h1>
        <p className="mt-0.5 text-sm text-gray-500">Trao đổi với các đối tác giao dịch.</p>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-10 text-center shadow-sm">
          <p className="text-sm text-gray-400">Đang tải tin nhắn...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-xl border border-rose-200 px-5 py-4 shadow-sm">
          <p className="text-sm text-rose-600">Lỗi: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Hộp thư</h2>
            <span className="text-xs text-gray-400">{chats.length} cuộc trò chuyện</span>
          </div>

          {chats.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-400">Chưa có tin nhắn nào.</p>
              <p className="text-xs text-gray-400 mt-1">Tin nhắn sẽ xuất hiện sau khi lệnh được khớp.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {chats.map((chat, idx) => (
                <Link
                  key={chat.id}
                  to={`/messages/${chat.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${chatColor(chat.id)}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-medium text-gray-900">
                        Giao dịch #{chat.matchId.slice(0, 8)}
                      </p>
                      <span className="shrink-0 text-xs text-gray-400">{formatDate(chat.lastMessageAt ?? chat.updatedAt)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {chat.lastMessageText ?? 'Bắt đầu cuộc trò chuyện'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
