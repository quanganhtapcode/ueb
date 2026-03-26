import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageNav from '@/components/PageNav';
import { useAuth } from '@/contexts/useAuth';
import { subscribeMyMatches } from '@/lib/market';
import type { MarketMatch } from '@/lib/types';

function formatDateTime(value: Date | null): string {
  if (!value) return '—';
  return value.toLocaleString('vi-VN');
}

function getCounterpartyEmail(match: MarketMatch, userId: string): string {
  return match.buyUserId === userId ? (match.sellUserEmail ?? 'Không rõ') : (match.buyUserEmail ?? 'Không rõ');
}

export default function MatchesPage() {
  const { user, signOut } = useAuth();
  const [matches, setMatches] = useState<MarketMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeMyMatches(
      user.uid,
      (nextMatches) => {
        setMatches(nextMatches);
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
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Khớp lệnh của tôi</h1>
            <p className="text-sm text-muted-foreground">Danh sách giao dịch đã khớp và thông tin đối tác.</p>
            <div className="mt-3">
              <PageNav />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Đăng nhập bởi</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Đang tải matches...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive/30">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">Lỗi tải matches: {error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Matches ({matches.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {matches.length === 0 && (
                <p className="text-sm text-muted-foreground">Chưa có lệnh nào được khớp.</p>
              )}
              {matches.map((match) => (
                <div key={match.id} className="rounded-md border p-3 text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Match #{match.id.slice(0, 8)}</span>
                    <span className="text-emerald-600">Matched</span>
                  </div>
                  <p>Đối tác: {getCounterpartyEmail(match, user?.uid ?? '')}</p>
                  <p>Giá: {match.price}</p>
                  <p>Khối lượng: {match.quantity}</p>
                  <p className="text-xs text-muted-foreground">Thời gian: {formatDateTime(match.createdAt)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
