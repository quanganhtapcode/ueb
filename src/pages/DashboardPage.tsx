import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">UEB Trading Platform</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Chào mừng!</CardTitle>
              <CardDescription>
                Bạn đã đăng nhập thành công
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Email: <span className="font-medium">{user?.displayName || user?.email}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Giao dịch</CardTitle>
              <CardDescription>
                Quản lý các giao dịch của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Xem giao dịch
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
              <CardDescription>
                Xem báo cáo và thống kê
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Xem báo cáo
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
