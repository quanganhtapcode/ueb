import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageNav from '@/components/PageNav';
import { useAuth } from '@/contexts/useAuth';
import { sendChatMessage, subscribeChatMessages } from '@/lib/market';
import type { ChatMessage } from '@/lib/types';

function formatDateTime(value: Date | null): string {
  if (!value) return '—';
  return value.toLocaleString('vi-VN');
}

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const missingChatId = !chatId;

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeChatMessages(
      chatId,
      (nextMessages) => {
        setMessages(nextMessages);
        setError(null);
        setLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [chatId]);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0)),
    [messages],
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Không thể đăng xuất.');
    }
  };

  const handleSend = async () => {
    if (!chatId || !user) {
      setSendError('Không thể gửi tin nhắn do thiếu thông tin người dùng hoặc chat.');
      return;
    }

    try {
      setSending(true);
      setSendError(null);
      await sendChatMessage(chatId, user.uid, draft);
      setDraft('');
    } catch (nextError) {
      setSendError(nextError instanceof Error ? nextError.message : 'Gửi tin nhắn thất bại.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Chi tiết chat</h1>
            <p className="text-sm text-muted-foreground">Chat ID: {chatId || '—'}</p>
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

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg">Thread</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/messages">Quay lại danh sách chat</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p className="text-sm text-muted-foreground">Đang tải tin nhắn...</p>}
            {missingChatId && <p className="text-sm text-destructive">Thiếu chatId trong đường dẫn.</p>}
            {error && <p className="text-sm text-destructive">Lỗi tải chat: {error}</p>}
            {!loading && !error && sortedMessages.length === 0 && (
              <p className="text-sm text-muted-foreground">Chưa có tin nhắn nào.</p>
            )}
            {!loading &&
              !error &&
              sortedMessages.map((message) => {
                const isMine = message.senderUserId === user?.uid;
                return (
                  <div
                    key={message.id}
                    className={`max-w-[88%] sm:max-w-[80%] rounded-lg border p-3 text-sm ${
                      isMine ? 'ml-auto bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(message.createdAt)}</p>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Gửi tin nhắn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Nhập nội dung..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={sending}
              />
              <Button className="sm:w-auto w-full" onClick={handleSend} disabled={sending || !draft.trim()}>
                {sending ? 'Đang gửi...' : 'Gửi'}
              </Button>
            </div>
            {sendError && <p className="text-sm text-destructive">Lỗi gửi tin nhắn: {sendError}</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
