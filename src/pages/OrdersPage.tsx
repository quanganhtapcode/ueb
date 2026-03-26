import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { subscribeMyOrders } from '@/lib/market';
import type { MarketOrder } from '@/lib/types';

function formatDateTime(value: Date | null): string {
  if (!value) return '—';
  return value.toLocaleString('vi-VN');
}

function statusLabel(order: MarketOrder): { text: string; cls: string } {
  if (order.status === 'open') return { text: 'Open', cls: 'bg-blue-50 text-blue-700' };
  if (order.status === 'cancelled') return { text: 'Huỷ', cls: 'bg-gray-100 text-gray-500' };
  return { text: 'Khớp', cls: 'bg-emerald-50 text-emerald-700' };
}

function OrderRow({ order }: { order: MarketOrder }) {
  const { text, cls } = statusLabel(order);
  const isBuy = order.side === 'buy';
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
      <td className="px-5 py-3">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${isBuy ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
          {isBuy ? 'Mua' : 'Bán'}
        </span>
      </td>
      <td className="px-5 py-3 text-sm tabular-nums text-gray-900 font-medium">{order.price.toFixed(2)}</td>
      <td className="px-5 py-3 text-sm tabular-nums text-gray-700">{order.quantity}</td>
      <td className="px-5 py-3 text-sm tabular-nums text-gray-500">{order.remainingQuantity}</td>
      <td className="px-5 py-3">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${cls}`}>{text}</span>
      </td>
      <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
    </tr>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeMyOrders(
      user.uid,
      (nextOrders) => { setOrders(nextOrders); setError(null); setLoading(false); },
      (nextError) => { setError(nextError.message); setLoading(false); },
    );
    return unsubscribe;
  }, [user]);

  const groups = useMemo(() => {
    const open = orders.filter((o) => o.status === 'open');
    const matched = orders.filter((o) => o.status === 'partial' || o.status === 'filled');
    const cancelled = orders.filter((o) => o.status === 'cancelled');
    return { open, matched, cancelled };
  }, [orders]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Đơn hàng</h1>
        <p className="mt-0.5 text-sm text-gray-500">Theo dõi lệnh mở, đã khớp và đã huỷ.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Đang mở', count: groups.open.length, cls: 'text-blue-600' },
          { label: 'Đã khớp', count: groups.matched.length, cls: 'text-emerald-600' },
          { label: 'Đã huỷ', count: groups.cancelled.length, cls: 'text-gray-500' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 px-4 py-4 shadow-sm">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${item.cls}`}>{item.count}</p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-10 text-center shadow-sm">
          <p className="text-sm text-gray-400">Đang tải đơn hàng...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-xl border border-rose-200 px-5 py-4 shadow-sm">
          <p className="text-sm text-rose-600">Lỗi: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {([
            { key: 'open', title: 'Đang mở', data: groups.open },
            { key: 'matched', title: 'Đã khớp', data: groups.matched },
            { key: 'cancelled', title: 'Đã huỷ', data: groups.cancelled },
          ] as const).map((section) => (
            <div key={section.key} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">{section.title}</h2>
                <span className="text-xs text-gray-400">{section.data.length} lệnh</span>
              </div>
              {section.data.length === 0 ? (
                <p className="px-5 py-6 text-sm text-gray-400">Không có đơn hàng.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Loại</th>
                        <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Giá</th>
                        <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">KL</th>
                        <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Còn lại</th>
                        <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Trạng thái</th>
                        <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.data.map((order) => (
                        <OrderRow key={order.id} order={order} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
