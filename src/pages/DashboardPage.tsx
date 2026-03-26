import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageNav from '@/components/PageNav';
import { useAuth } from '@/contexts/useAuth';
import { placeOrder, subscribeOrderBook } from '@/lib/market';
import { SINGLE_PRODUCT_NAME, SINGLE_PRODUCT_SYMBOL, type OrderBookView } from '@/lib/types';

type StatusTone = 'idle' | 'loading' | 'success' | 'error';

interface FormStatus {
  tone: StatusTone;
  message: string;
}

const IDLE_STATUS: FormStatus = { tone: 'idle', message: '' };

function toPositiveNumber(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const [bidPrice, setBidPrice] = useState('104.6');
  const [bidVolume, setBidVolume] = useState('10');
  const [askPrice, setAskPrice] = useState('104.9');
  const [askVolume, setAskVolume] = useState('10');

  const [orderBook, setOrderBook] = useState<OrderBookView>({ bids: [], asks: [] });
  const [orderBookLoading, setOrderBookLoading] = useState(true);
  const [orderBookError, setOrderBookError] = useState<string | null>(null);

  const [bidStatus, setBidStatus] = useState<FormStatus>(IDLE_STATUS);
  const [askStatus, setAskStatus] = useState<FormStatus>(IDLE_STATUS);

  useEffect(() => {
    const unsubscribe = subscribeOrderBook(
      (view) => {
        setOrderBook(view);
        setOrderBookLoading(false);
        setOrderBookError(null);
      },
      (error) => {
        setOrderBookLoading(false);
        setOrderBookError(error.message);
      },
    );

    return unsubscribe;
  }, []);

  const marketSummary = useMemo(() => {
    const bestBid = orderBook.bids[0]?.price ?? null;
    const bestAsk = orderBook.asks[0]?.price ?? null;

    const spread = bestBid !== null && bestAsk !== null ? bestAsk - bestBid : null;
    const midpoint = bestBid !== null && bestAsk !== null ? (bestBid + bestAsk) / 2 : null;
    const bidDepth = orderBook.bids.reduce((sum, level) => sum + level.quantity, 0);
    const askDepth = orderBook.asks.reduce((sum, level) => sum + level.quantity, 0);

    return {
      bestBid,
      bestAsk,
      spread,
      midpoint,
      bidDepth,
      askDepth,
    };
  }, [orderBook]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePlaceBid = async () => {
    const price = toPositiveNumber(bidPrice);
    const quantity = toPositiveNumber(bidVolume);

    if (price === null || quantity === null) {
      setBidStatus({ tone: 'error', message: 'Giá và khối lượng mua phải là số dương.' });
      return;
    }

    if (!user) {
      setBidStatus({ tone: 'error', message: 'Bạn cần đăng nhập để đặt lệnh mua.' });
      return;
    }

    setBidStatus({ tone: 'loading', message: 'Đang gửi lệnh mua...' });

    try {
      const order = await placeOrder('buy', price, quantity, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      setBidStatus({ tone: 'success', message: `Đã đặt lệnh mua thành công (#${order.id.slice(0, 8)}).` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể đặt lệnh mua. Vui lòng thử lại.';
      setBidStatus({ tone: 'error', message });
    }
  };

  const handlePlaceAsk = async () => {
    const price = toPositiveNumber(askPrice);
    const quantity = toPositiveNumber(askVolume);

    if (price === null || quantity === null) {
      setAskStatus({ tone: 'error', message: 'Giá và khối lượng bán phải là số dương.' });
      return;
    }

    if (!user) {
      setAskStatus({ tone: 'error', message: 'Bạn cần đăng nhập để đặt lệnh bán.' });
      return;
    }

    setAskStatus({ tone: 'loading', message: 'Đang gửi lệnh bán...' });

    try {
      const order = await placeOrder('sell', price, quantity, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      setAskStatus({ tone: 'success', message: `Đã đặt lệnh bán thành công (#${order.id.slice(0, 8)}).` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể đặt lệnh bán. Vui lòng thử lại.';
      setAskStatus({ tone: 'error', message });
    }
  };

  const statusClassName = (tone: StatusTone): string => {
    if (tone === 'success') {
      return 'text-emerald-700';
    }
    if (tone === 'error') {
      return 'text-rose-700';
    }
    if (tone === 'loading') {
      return 'text-muted-foreground';
    }
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">UEB Trading Platform</h1>
            <p className="text-sm text-muted-foreground">Single-product market · Real-time bid/ask view</p>
            <div className="mt-3">
              <PageNav />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/orders">Orders</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/matches">Matches</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/messages">Messages</Link>
            </Button>
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

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl">{SINGLE_PRODUCT_SYMBOL}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{SINGLE_PRODUCT_NAME}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Best Bid / Ask</p>
                  <p className="text-sm font-medium">
                    {marketSummary.bestBid?.toFixed(2) ?? '--'} / {marketSummary.bestAsk?.toFixed(2) ?? '--'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mid Price</p>
                  <p className="text-sm font-medium">{marketSummary.midpoint?.toFixed(2) ?? '--'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Spread</p>
                  <p className="text-sm font-medium">{marketSummary.spread?.toFixed(2) ?? '--'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Depth (Bid / Ask)</p>
                  <p className="text-sm font-medium">
                    {marketSummary.bidDepth} / {marketSummary.askDepth}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sổ lệnh (Order Book)</CardTitle>
              {orderBookLoading && <p className="text-xs text-muted-foreground">Đang tải dữ liệu realtime...</p>}
              {orderBookError && <p className="text-xs text-rose-700">{orderBookError}</p>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-emerald-600">Bids (Mua)</p>
                <div className="space-y-1">
                  {orderBook.bids.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Chưa có lệnh mua đang mở.</p>
                  ) : (
                    orderBook.bids.map((row) => (
                      <div
                        key={`bid-${row.price}`}
                        className="grid grid-cols-3 rounded-md bg-emerald-500/5 px-2 py-1 text-sm"
                      >
                        <span className="font-medium text-emerald-600">{row.price.toFixed(2)}</span>
                        <span className="text-center">{row.quantity}</span>
                        <span className="text-right text-muted-foreground">{(row.price * row.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-rose-600">Asks (Bán)</p>
                <div className="space-y-1">
                  {orderBook.asks.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Chưa có lệnh bán đang mở.</p>
                  ) : (
                    orderBook.asks.map((row) => (
                      <div
                        key={`ask-${row.price}`}
                        className="grid grid-cols-3 rounded-md bg-rose-500/5 px-2 py-1 text-sm"
                      >
                        <span className="font-medium text-rose-600">{row.price.toFixed(2)}</span>
                        <span className="text-center">{row.quantity}</span>
                        <span className="text-right text-muted-foreground">{(row.price * row.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Đặt lệnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 rounded-lg border border-emerald-200/60 bg-emerald-50/40 p-4">
                <p className="text-sm font-semibold text-emerald-700">Bid / Mua</p>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Giá</label>
                  <Input
                    value={bidPrice}
                    onChange={(event) => {
                      setBidPrice(event.target.value);
                      if (bidStatus.tone !== 'idle') {
                        setBidStatus(IDLE_STATUS);
                      }
                    }}
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Khối lượng</label>
                  <Input
                    value={bidVolume}
                    onChange={(event) => {
                      setBidVolume(event.target.value);
                      if (bidStatus.tone !== 'idle') {
                        setBidStatus(IDLE_STATUS);
                      }
                    }}
                    inputMode="numeric"
                  />
                </div>
                <Button
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={handlePlaceBid}
                  disabled={bidStatus.tone === 'loading'}
                >
                  {bidStatus.tone === 'loading' ? 'Đang đặt lệnh mua...' : 'Đặt lệnh Mua'}
                </Button>
                {bidStatus.tone !== 'idle' && (
                  <p className={`text-xs ${statusClassName(bidStatus.tone)}`}>{bidStatus.message}</p>
                )}
              </div>

              <div className="space-y-3 rounded-lg border border-rose-200/60 bg-rose-50/40 p-4">
                <p className="text-sm font-semibold text-rose-700">Ask / Bán</p>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Giá</label>
                  <Input
                    value={askPrice}
                    onChange={(event) => {
                      setAskPrice(event.target.value);
                      if (askStatus.tone !== 'idle') {
                        setAskStatus(IDLE_STATUS);
                      }
                    }}
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Khối lượng</label>
                  <Input
                    value={askVolume}
                    onChange={(event) => {
                      setAskVolume(event.target.value);
                      if (askStatus.tone !== 'idle') {
                        setAskStatus(IDLE_STATUS);
                      }
                    }}
                    inputMode="numeric"
                  />
                </div>
                <Button
                  className="w-full bg-rose-600 text-white hover:bg-rose-700"
                  onClick={handlePlaceAsk}
                  disabled={askStatus.tone === 'loading'}
                >
                  {askStatus.tone === 'loading' ? 'Đang đặt lệnh bán...' : 'Đặt lệnh Bán'}
                </Button>
                {askStatus.tone !== 'idle' && (
                  <p className={`text-xs ${statusClassName(askStatus.tone)}`}>{askStatus.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tóm tắt thị trường</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border px-3 py-2">
                <p className="text-xs text-muted-foreground">Single product</p>
                <p className="mt-1 font-medium">{SINGLE_PRODUCT_NAME}</p>
              </div>
              <div className="rounded-md border px-3 py-2">
                <p className="text-xs text-muted-foreground">Số mức giá bid / ask</p>
                <p className="mt-1 font-medium">
                  {orderBook.bids.length} / {orderBook.asks.length}
                </p>
              </div>
              <div className="rounded-md border px-3 py-2">
                <p className="text-xs text-muted-foreground">Realtime feed</p>
                <p className="mt-1 font-medium">{orderBookError ? 'Mất kết nối' : 'Đang hoạt động'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
