import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCard } from "./AlertCard";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { BellOff } from "lucide-react";

export function AlertCenter({ isOpen, onClose, onUpdateCount }) {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data);
      onUpdateCount(res.data.filter((a) => !a.isRead).length);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      fetchAlerts();
    } catch (err) {
      console.error("Failed to mark alert as read", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alerts/${id}`);
      fetchAlerts();
    } catch (err) {
      console.error("Failed to delete alert", err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-[400px] flex-col p-0 sm:w-[540px]">
        <SheetHeader className="border-b p-6">
          <SheetTitle>Alert Center</SheetTitle>
          <SheetDescription>
            Proactive warnings and wellness notifications.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                <BellOff size={48} className="mb-4" />
                <p>No active alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
