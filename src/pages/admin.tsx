import { useEffect, useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { apiClient } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, u] = await Promise.all([
          apiClient.getAdminStats(),
          apiClient.getUsers(),
        ]);
        setStats(s);
        setUsers(u);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserUpdate = async (id: string, updates: any) => {
    try {
      await apiClient.updateUser(id, updates);
      const updated = await apiClient.getUsers();
      setUsers(updated);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <>
      <Topbar title="Admin Panel" subtitle="System configuration and user management" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {!loading && (
            <Tabs defaultValue="users">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="corridors">Corridors</TabsTrigger>
                <TabsTrigger value="fees">Fee Rules</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {users.map((u) => (
                    <div key={u.id} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{u.name}</h3>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                      <Badge>{u.role}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="corridors" className="space-y-4 mt-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-muted-foreground">Corridor configuration coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="fees" className="space-y-4 mt-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-muted-foreground">Fee rules configuration coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="partners" className="space-y-4 mt-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-muted-foreground">Partner management coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </>
  );
}
