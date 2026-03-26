import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageNav from '@/components/PageNav';
import { useAuth } from '@/contexts/useAuth';
import { subscribeMyOrders } from '@/lib/market';
import type { MarketOrder } from '@/lib/types';

function formatDateTime(value: Date | null): string {
  if (!value) return '—';
  return value.toLocaleString('vi-VN');
}

function statusText(order: MarketOrder): string {
  if (order.status === 'open') return 'Open';
  if (order.status === 'cancelled') return 'Cancelled';
  return 'Matched';
}

export default function OrdersPage() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeMyOrders(
      user.uid,
      (nextOrders) => {
        setOrders(nextOrders);
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

  const groups = useMemo(() => {
    const open = orders.filter((order) => order.status === 'open');
    const matched = orders.filter((order) => order.status === 'partial' || order.status === 'filled');
    const cancelled = orders.filter((order) => order.status === 'cancelled');
    return { open, matched, cancelled };
  }, [orders]);

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
            <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
            <p className="text-sm text-muted-foreground">Theo dõi lệnh open, matched và cancelled.</p>
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
              <p className="text-sm text-muted-foreground">Đang tải đơn hàng...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive/30">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">Lỗi tải đơn hàng: {error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid gap-6 lg:grid-cols-3">
            {([
              { key: 'open', title: 'Open', data: groups.open },
              { key: 'matched', title: 'Matched', data: groups.matched },
              { key: 'cancelled', title: 'Cancelled', data: groups.cancelled },
            ] as const).map((section) => (
              <Card key={section.key}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {section.title} ({section.data.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.data.length === 0 && (
                    <p className="text-sm text-muted-foreground">Không có đơn hàng.</p>
                  )}
                  {section.data.map((order) => (
                    <div key={order.id} className="rounded-md border p-3 space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium uppercase">{order.side}</span>
                        <span className="text-muted-foreground">{statusText(order)}</span>
                      </div>
                      <p>Giá: {order.price}</p>
                      <p>Khối lượng: {order.quantity}</p>
                      <p>Còn lại: {order.remainingQuantity}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
