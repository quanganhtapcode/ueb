import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/AppLayout';
import { placeOrder, subscribeOrderBook } from '@/lib/market';
import { SINGLE_PRODUCT_NAME, SINGLE_PRODUCT_SYMBOL, type OrderBookView } from '@/lib/types';
import { useAuth } from '@/contexts/useAuth';

type StatusTone = 'idle' | 'loading' | 'success' | 'error';

interface FormStatus {
  tone: StatusTone;
  message: string;
}

const IDLE_STATUS: FormStatus = { tone: 'idle', message: '' };

function toPositiveNumber(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export default function DashboardPage() {
  const { user } = useAuth();

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
    return { bestBid, bestAsk, spread, midpoint, bidDepth, askDepth };
  }, [orderBook]);

  const handlePlaceBid = async () => {
    const price = toPositiveNumber(bidPrice);
    const quantity = toPositiveNumber(bidVolume);
    if (price === null || quantity === null) {
      setBidStatus({ tone: 'error', message: 'Giá và khối lượng phải là số dương.' });
      return;
    }
    if (!user) {
      setBidStatus({ tone: 'error', message: 'Bạn cần đăng nhập.' });
      return;
    }
    setBidStatus({ tone: 'loading', message: '' });
    try {
      const order = await placeOrder('buy', price, quantity, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      setBidStatus({ tone: 'success', message: `Đặt mua thành công #${order.id.slice(0, 8)}` });
    } catch (error) {
      setBidStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Lỗi đặt lệnh mua.' });
    }
  };

  const handlePlaceAsk = async () => {
    const price = toPositiveNumber(askPrice);
    const quantity = toPositiveNumber(askVolume);
    if (price === null || quantity === null) {
      setAskStatus({ tone: 'error', message: 'Giá và khối lượng phải là số dương.' });
      return;
    }
    if (!user) {
      setAskStatus({ tone: 'error', message: 'Bạn cần đăng nhập.' });
      return;
    }
    setAskStatus({ tone: 'loading', message: '' });
    try {
      const order = await placeOrder('sell', price, quantity, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
      setAskStatus({ tone: 'success', message: `Đặt bán thành công #${order.id.slice(0, 8)}` });
    } catch (error) {
      setAskStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Lỗi đặt lệnh bán.' });
    }
  };

  return (
    <AppLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">{SINGLE_PRODUCT_SYMBOL}</h1>
        <p className="mt-0.5 text-sm text-gray-500">{SINGLE_PRODUCT_NAME} · Thị trường thời gian thực</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {[
          { label: 'Best Bid', value: marketSummary.bestBid?.toFixed(2) ?? '—', cls: 'text-emerald-600' },
          { label: 'Best Ask', value: marketSummary.bestAsk?.toFixed(2) ?? '—', cls: 'text-rose-500' },
          { label: 'Mid Price', value: marketSummary.midpoint?.toFixed(2) ?? '—', cls: 'text-gray-900' },
          { label: 'Spread', value: marketSummary.spread?.toFixed(2) ?? '—', cls: 'text-gray-900' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 px-4 py-4 shadow-sm">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums tracking-tight ${stat.cls}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Order book */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Sổ lệnh</h2>
            {orderBookLoading && <span className="text-xs text-gray-400">Đang tải...</span>}
            {orderBookError && <span className="text-xs text-rose-500">{orderBookError}</span>}
            {!orderBookLoading && !orderBookError && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Trực tiếp
              </span>
            )}
          </div>

          {/* Asks */}
          <div>
            <div className="grid grid-cols-3 px-5 py-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Giá bán</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-center">SL</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Tổng</span>
            </div>
            <div>
              {orderBook.asks.length === 0 ? (
                <p className="px-5 py-3 text-xs text-gray-400">Chưa có lệnh bán</p>
              ) : (
                [...orderBook.asks].reverse().map((row) => (
                  <div
                    key={`ask-${row.price}`}
                    className="grid grid-cols-3 px-5 py-1.5 hover:bg-rose-50/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-rose-500 tabular-nums">{row.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-700 text-center tabular-nums">{row.quantity}</span>
                    <span className="text-sm text-gray-400 text-right tabular-nums">{(row.price * row.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Spread divider */}
          <div className="flex items-center gap-4 px-5 py-2 bg-gray-50 border-y border-gray-100">
            <span className="text-xs text-gray-400">Spread</span>
            <span className="text-xs font-semibold text-gray-700 tabular-nums">{marketSummary.spread?.toFixed(2) ?? '—'}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">Mid</span>
            <span className="text-xs font-semibold text-gray-700 tabular-nums">{marketSummary.midpoint?.toFixed(2) ?? '—'}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">Depth</span>
            <span className="text-xs font-semibold text-gray-700 tabular-nums">{marketSummary.bidDepth}/{marketSummary.askDepth}</span>
          </div>

          {/* Bids */}
          <div>
            <div className="grid grid-cols-3 px-5 py-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Giá mua</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-center">SL</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Tổng</span>
            </div>
            <div>
              {orderBook.bids.length === 0 ? (
                <p className="px-5 py-3 text-xs text-gray-400">Chưa có lệnh mua</p>
              ) : (
                orderBook.bids.map((row) => (
                  <div
                    key={`bid-${row.price}`}
                    className="grid grid-cols-3 px-5 py-1.5 hover:bg-emerald-50/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-emerald-600 tabular-nums">{row.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-700 text-center tabular-nums">{row.quantity}</span>
                    <span className="text-sm text-gray-400 text-right tabular-nums">{(row.price * row.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Order forms */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Buy */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-semibold text-gray-900">Đặt lệnh Mua</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Giá</label>
                <Input
                  value={bidPrice}
                  onChange={(e) => { setBidPrice(e.target.value); if (bidStatus.tone !== 'idle') setBidStatus(IDLE_STATUS); }}
                  inputMode="decimal"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Khối lượng</label>
                <Input
                  value={bidVolume}
                  onChange={(e) => { setBidVolume(e.target.value); if (bidStatus.tone !== 'idle') setBidStatus(IDLE_STATUS); }}
                  inputMode="numeric"
                  className="h-9 text-sm"
                />
              </div>
              <button
                onClick={handlePlaceBid}
                disabled={bidStatus.tone === 'loading'}
                className="w-full h-9 rounded-lg bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {bidStatus.tone === 'loading' ? 'Đang đặt...' : 'Mua'}
              </button>
              {bidStatus.tone !== 'idle' && (
                <p className={`text-xs ${bidStatus.tone === 'success' ? 'text-emerald-600' : bidStatus.tone === 'error' ? 'text-rose-600' : 'text-gray-400'}`}>
                  {bidStatus.message}
                </p>
              )}
            </div>
          </div>

          {/* Sell */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              <h2 className="text-sm font-semibold text-gray-900">Đặt lệnh Bán</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Giá</label>
                <Input
                  value={askPrice}
                  onChange={(e) => { setAskPrice(e.target.value); if (askStatus.tone !== 'idle') setAskStatus(IDLE_STATUS); }}
                  inputMode="decimal"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Khối lượng</label>
                <Input
                  value={askVolume}
                  onChange={(e) => { setAskVolume(e.target.value); if (askStatus.tone !== 'idle') setAskStatus(IDLE_STATUS); }}
                  inputMode="numeric"
                  className="h-9 text-sm"
                />
              </div>
              <button
                onClick={handlePlaceAsk}
                disabled={askStatus.tone === 'loading'}
                className="w-full h-9 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {askStatus.tone === 'loading' ? 'Đang đặt...' : 'Bán'}
              </button>
              {askStatus.tone !== 'idle' && (
                <p className={`text-xs ${askStatus.tone === 'success' ? 'text-emerald-600' : askStatus.tone === 'error' ? 'text-rose-600' : 'text-gray-400'}`}>
                  {askStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
