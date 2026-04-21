import { useEffect, useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { apiClient } from '@/lib/api-client';
import { X } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiClient.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const dismiss = async (id: string) => {
    try {
      await apiClient.markNotificationAsRead(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return (
    <>
      <Topbar title="Notifications" subtitle="Stay updated on your transactions" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.date} at {n.time}</p>
              </div>
              <button onClick={() => dismiss(n.id)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
