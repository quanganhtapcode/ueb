import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageNav from '@/components/PageNav';
import { useAuth } from '@/contexts/useAuth';
import { subscribeMyChats } from '@/lib/market';
import type { MarketChat } from '@/lib/types';

function formatDateTime(value: Date | null): string {
  if (!value) return '—';
  return value.toLocaleString('vi-VN');
}

export default function MessagesPage() {
  const { user, signOut } = useAuth();
  const [chats, setChats] = useState<MarketChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeMyChats(
      user.uid,
      (nextChats) => {
        setChats(nextChats);
        setError(null);
        setLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Không thể đăng xuất.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Tin nhắn</h1>
            <p className="text-sm text-muted-foreground">Danh sách chat theo từng lệnh khớp.</p>
            <div className="mt-3">
              <PageNav />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border bg-background/80 p-3 md:justify-end md:rounded-none md:border-0 md:bg-transparent md:p-0">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Đăng nhập bởi</p>
              <p className="truncate text-sm font-medium max-w-[180px] sm:max-w-[260px]">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Đang tải chats...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive/30">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">Lỗi tải chats: {error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chats ({chats.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {chats.length === 0 && (
                <p className="text-sm text-muted-foreground">Bạn chưa có cuộc trò chuyện nào.</p>
              )}
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/messages/${chat.id}`}
                  className="block rounded-md border p-3 text-sm transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Chat #{chat.id.slice(0, 8)}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(chat.updatedAt)}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground line-clamp-1">
                    {chat.lastMessageText || 'Chưa có tin nhắn'}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
