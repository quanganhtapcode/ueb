import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [bidPrice, setBidPrice] = useState('104.6');
  const [bidVolume, setBidVolume] = useState('10');
  const [askPrice, setAskPrice] = useState('104.9');
  const [askVolume, setAskVolume] = useState('10');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const market = {
    symbol: 'UEB-INDEX',
    name: 'UEB Market Index',
    lastPrice: 104.75,
    change: 1.8,
    high: 105.1,
    low: 102.4,
    volume: '1,284',
  };

  const bids = [
    { price: 104.7, volume: 120, total: 12564 },
    { price: 104.65, volume: 95, total: 9941.75 },
    { price: 104.6, volume: 180, total: 18828 },
    { price: 104.55, volume: 140, total: 14637 },
    { price: 104.5, volume: 200, total: 20900 },
  ];

  const asks = [
    { price: 104.8, volume: 90, total: 9432 },
    { price: 104.85, volume: 110, total: 11533.5 },
    { price: 104.9, volume: 130, total: 13637 },
    { price: 104.95, volume: 80, total: 8396 },
    { price: 105.0, volume: 170, total: 17850 },
  ];

  const recentTrades = [
    { time: '15:28:11', price: 104.75, volume: 20, side: 'buy' },
    { time: '15:27:54', price: 104.8, volume: 12, side: 'buy' },
    { time: '15:27:30', price: 104.7, volume: 16, side: 'sell' },
    { time: '15:26:59', price: 104.65, volume: 8, side: 'sell' },
    { time: '15:26:23', price: 104.75, volume: 10, side: 'buy' },
  ] as const;

  const bestAsk = asks[0]?.price ?? 0;
  const bestBid = bids[0]?.price ?? 0;
  const spread = (bestAsk - bestBid).toFixed(2);

  const handlePlaceBid = () => {
    alert(`Đặt lệnh MUA: ${bidVolume} @ ${bidPrice}`);
  };

  const handlePlaceAsk = () => {
    alert(`Đặt lệnh BÁN: ${askVolume} @ ${askPrice}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">UEB Trading Platform</h1>
            <p className="text-sm text-muted-foreground">Single-product market · Real-time bid/ask view</p>
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
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl">{market.symbol}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{market.name}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Last Price</p>
                  <p className="text-2xl font-bold">{market.lastPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24h Change</p>
                  <p className="text-2xl font-bold text-emerald-600">+{market.change}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">High / Low</p>
                  <p className="text-sm font-medium">{market.high.toFixed(2)} / {market.low.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Volume</p>
                  <p className="text-sm font-medium">{market.volume}</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sổ lệnh (Order Book)</CardTitle>
              <p className="text-xs text-muted-foreground">Spread: {spread}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-2">Bids (Mua)</p>
                <div className="space-y-1">
                  {bids.map((row) => (
                    <div key={`bid-${row.price}`} className="grid grid-cols-3 text-sm rounded-md px-2 py-1 bg-emerald-500/5">
                      <span className="font-medium text-emerald-600">{row.price.toFixed(2)}</span>
                      <span className="text-center">{row.volume}</span>
                      <span className="text-right text-muted-foreground">{row.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-rose-600 mb-2">Asks (Bán)</p>
                <div className="space-y-1">
                  {asks.map((row) => (
                    <div key={`ask-${row.price}`} className="grid grid-cols-3 text-sm rounded-md px-2 py-1 bg-rose-500/5">
                      <span className="font-medium text-rose-600">{row.price.toFixed(2)}</span>
                      <span className="text-center">{row.volume}</span>
                      <span className="text-right text-muted-foreground">{row.total.toFixed(2)}</span>
                    </div>
                  ))}
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
                  <Input value={bidPrice} onChange={(e) => setBidPrice(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Khối lượng</label>
                  <Input value={bidVolume} onChange={(e) => setBidVolume(e.target.value)} inputMode="numeric" />
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handlePlaceBid}>
                  Đặt lệnh Mua
                </Button>
              </div>

              <div className="space-y-3 rounded-lg border border-rose-200/60 bg-rose-50/40 p-4">
                <p className="text-sm font-semibold text-rose-700">Ask / Bán</p>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Giá</label>
                  <Input value={askPrice} onChange={(e) => setAskPrice(e.target.value)} inputMode="decimal" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Khối lượng</label>
                  <Input value={askVolume} onChange={(e) => setAskVolume(e.target.value)} inputMode="numeric" />
                </div>
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" onClick={handlePlaceAsk}>
                  Đặt lệnh Bán
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Khớp lệnh gần đây</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentTrades.map((trade) => (
                <div key={`${trade.time}-${trade.price}-${trade.volume}`} className="rounded-md border px-3 py-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{trade.time}</span>
                    <span className={trade.side === 'buy' ? 'text-emerald-600' : 'text-rose-600'}>
                      {trade.side.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{trade.price.toFixed(2)}</span>
                    <span>Vol {trade.volume}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
