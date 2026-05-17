import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, User as UserIcon } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ChatDialog from "./ChatDialog";

interface UnreadMessage {
  id: number;
  content: string;
  sender: {
    name: string;
    avatarUrl?: string;
  };
  exchangeId: number;
  exchange: {
    donation: {
      title: string;
    };
  };
}

export const GlobalChatNotifier = () => {
  const { isAuthenticated } = useAuth();
  const [unread, setUnread] = useState<UnreadMessage[]>([]);
  const [chatMetadata, setChatMetadata] = useState<{ id: number, name: string, item: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const token = localStorage.getItem("access_token");

  const fetchUnread = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch(`${API_BASE}/messages/my/unread`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUnread(data);
        // Only show bubble if we're not currently chatting with someone
        if (data.length > 0 && !isChatOpen) setIsVisible(true);
      }
    } catch (err) {
      console.error("Failed to fetch unread messages:", err);
    }
  }, [isAuthenticated, token, isChatOpen]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 10000); // Check every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchUnread]);

  const latest = unread[0];

  const handleOpenChat = () => {
    if (latest) {
      setChatMetadata({
        id: latest.exchangeId,
        name: latest.sender.name,
        item: latest.exchange.donation.title
      });
      setIsChatOpen(true);
      setIsVisible(false);
    }
  };

  if (!isAuthenticated || (unread.length === 0 && !isChatOpen)) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && !isChatOpen && unread.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none"
          >
            {/* Message preview */}
            <motion.div 
                className="bg-background border-2 shadow-2xl rounded-2xl p-3 max-w-[280px] pointer-events-auto cursor-pointer hover:border-primary/50 transition-colors relative"
                onClick={handleOpenChat}
            >
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 grid place-items-center hover:bg-accent transition-colors shadow-sm"
                >
                    <X className="w-3 h-3" />
                </button>
                
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary shrink-0 grid place-items-center text-primary-foreground font-bold">
                        {latest.sender.avatarUrl ? (
                            <img src={latest.sender.avatarUrl} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <UserIcon className="w-5 h-5" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">Ново съобщение</p>
                        <p className="text-sm font-bold truncate">{latest.sender.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 italic">"{latest.content}"</p>
                    </div>
                </div>
            </motion.div>

            {/* Main bubble */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenChat}
              className="w-14 h-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center text-white pointer-events-auto relative"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 border-2 border-white text-[10px] font-black grid place-items-center">
                {unread.length}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {chatMetadata && (
        <ChatDialog
          exchangeId={chatMetadata.id}
          isOpen={isChatOpen}
          onOpenChange={(open) => {
            setIsChatOpen(open);
            if (!open) {
                setChatMetadata(null);
                fetchUnread(); // Refresh unread count after closing
            }
          }}
          recipientName={chatMetadata.name}
          itemTitle={chatMetadata.item}
        />
      )}
    </>
  );
};

export default GlobalChatNotifier;
