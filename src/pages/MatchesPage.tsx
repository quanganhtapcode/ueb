import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { subscribeMyMatches } from '@/lib/market';
import type { MarketMatch } from '@/lib/types';

function formatDateTime(value: Date | null): string {
  if (!value) return '—';
  return value.toLocaleString('vi-VN');
}

function getCounterpartyEmail(match: MarketMatch, userId: string): string {
  return match.buyUserId === userId
    ? (match.sellUserEmail ?? 'Không rõ')
    : (match.buyUserEmail ?? 'Không rõ');
}

export default function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MarketMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeMyMatches(
      user.uid,
      (nextMatches) => { setMatches(nextMatches); setError(null); setLoading(false); },
      (nextError) => { setError(nextError.message); setLoading(false); },
    );
    return unsubscribe;
  }, [user]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Khớp lệnh</h1>
        <p className="mt-0.5 text-sm text-gray-500">Danh sách giao dịch đã khớp và thông tin đối tác.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-4 shadow-sm">
          <p className="text-xs text-gray-500">Tổng khớp lệnh</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">{matches.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-4 shadow-sm">
          <p className="text-xs text-gray-500">Tổng khối lượng khớp</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
            {matches.reduce((sum, m) => sum + m.quantity, 0)}
          </p>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-10 text-center shadow-sm">
          <p className="text-sm text-gray-400">Đang tải...</p>
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
            <h2 className="text-sm font-semibold text-gray-900">Lịch sử khớp lệnh</h2>
            <span className="text-xs text-gray-400">{matches.length} giao dịch</span>
          </div>

          {matches.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-400">Chưa có lệnh nào được khớp.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">ID</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Đối tác</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Giá</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">KL</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr key={match.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3 text-xs font-mono text-gray-500">#{match.id.slice(0, 8)}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{getCounterpartyEmail(match, user?.uid ?? '')}</td>
                      <td className="px-5 py-3 text-sm font-medium tabular-nums text-gray-900">{match.price.toFixed(2)}</td>
                      <td className="px-5 py-3 text-sm tabular-nums text-gray-700">{match.quantity}</td>
                      <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDateTime(match.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
