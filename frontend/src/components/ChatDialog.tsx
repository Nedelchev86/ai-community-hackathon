import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Send, CheckCheck, MessageCircle } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  sender: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}

interface ChatDialogProps {
  exchangeId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  itemTitle: string;
}

export const ChatDialog = ({
  exchangeId,
  isOpen,
  onOpenChange,
  recipientName,
  itemTitle,
}: ChatDialogProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const token = localStorage.getItem("access_token");

  const fetchMessages = useCallback(async () => {
    if (!exchangeId || !token) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${exchangeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, [exchangeId, token]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, fetchMessages]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!draft.trim() || !token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exchangeId, content: draft.trim() }),
      });
      if (res.ok) {
        setDraft("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 flex flex-col h-[600px] overflow-hidden rounded-3xl border-2">
        <DialogHeader className="p-4 border-b bg-muted/30 flex-row items-center gap-3 space-y-0">
          <div className="w-10 h-10 rounded-full bg-gradient-primary grid place-items-center shrink-0">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm font-bold truncate">{recipientName}</DialogTitle>
            <p className="text-xs text-muted-foreground truncate">{itemTitle}</p>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 bg-muted/10">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-50">
              <MessageCircle className="w-12 h-12 mb-2" />
              <p className="text-sm font-medium">Няма съобщения още.</p>
              <p className="text-xs">Започни разговора!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const isMe = m.senderId === parseInt(user?.id || "0");
                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                        isMe
                          ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                          : "bg-background border-2 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                      <div
                        className={`flex items-center gap-1 text-[9px] mt-1 ${
                          isMe ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(m.createdAt)}
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-background flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Напиши съобщение..."
            className="flex-1 rounded-xl h-11"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!draft.trim() || isLoading}
            className="rounded-xl h-11 w-11 p-0 bg-gradient-primary"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
