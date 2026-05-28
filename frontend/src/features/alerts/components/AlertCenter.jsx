import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCard } from "./AlertCard";
import { useEffect, useState, useCallback } from "react";
import api from "@/api/axios";
import { BellOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AlertCenter({ isOpen, onClose, onUpdateCount }) {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await api.get("/alerts");
      const unreadAlerts = res.data.filter((a) => !a.isRead);
      setAlerts(unreadAlerts);
      onUpdateCount(unreadAlerts.length);
    } catch {
      // Silently handle error
    }
  }, [onUpdateCount]);

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen, fetchAlerts]);

  const handleMarkAsRead = async (id) => {
    const previousAlerts = alerts;
    const updatedAlerts = alerts.filter((a) => a.id !== id);
    setAlerts(updatedAlerts);
    onUpdateCount(updatedAlerts.length);

    try {
      await api.patch(`/alerts/${id}/read`);
    } catch {
      setAlerts(previousAlerts);
      onUpdateCount(previousAlerts.length);
    }
  };

  const handleDelete = async (id) => {
    const previousAlerts = alerts;
    const updatedAlerts = alerts.filter((a) => a.id !== id);
    setAlerts(updatedAlerts);
    onUpdateCount(updatedAlerts.length);

    try {
      await api.delete(`/alerts/${id}`);
    } catch {
      setAlerts(previousAlerts);
      onUpdateCount(previousAlerts.length);
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
          <div className="flex flex-col gap-4">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                <BellOff size={48} className="mb-4" />
                <p>No active alerts</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    layout
                    exit={{
                      opacity: 0,
                      height: 0,
                      scale: 0.95,
                      overflow: "hidden",
                    }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  >
                    <AlertCard
                      alert={alert}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
