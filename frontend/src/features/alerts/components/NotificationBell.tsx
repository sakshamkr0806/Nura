import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { AlertCenter } from "./AlertCenter"
import api from "@/api/axios"

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Initial fetch for count
    const fetchCount = async () => {
      try {
        const res = await api.get('/alerts')
        setUnreadCount(res.data.filter((a: any) => !a.isRead).length)
      } catch (err) {}
    }
    fetchCount()
    
    // Evaluate rules on mount to potentially generate new alerts
    api.post('/alerts/evaluate').then(() => fetchCount())
  }, [])

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative" 
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in fade-in zoom-in duration-300">
            {unreadCount}
          </span>
        )}
      </Button>
      <AlertCenter 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onUpdateCount={setUnreadCount}
      />
    </>
  )
}
