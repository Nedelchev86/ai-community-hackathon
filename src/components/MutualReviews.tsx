import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Star, ArrowLeftRight, CheckCircle2, Clock, Quote, ThumbsUp, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useExchanges, reviewsStore, TAGS_DONOR, TAGS_RECEIVER,
} from "@/lib/reviewsStore";

export const MutualReviews = () => {
  const exchanges = useExchanges();
  const [openId, setOpenId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const open = exchanges.find((e) => e.id === openId) || null;
  const tagPool = open?.myRole === "donor" ? TAGS_DONOR : TAGS_RECEIVER;

  const stats = useMemo(() => {
    const done = exchanges.filter((e) => e.myReview).length;
    const pending = exchanges.length - done;
    const allRatings = exchanges
      .flatMap((e) => [e.myReview?.rating, e.partnerReview?.rating])
      .filter((r): r is number => typeof r === "number");
    const avg = allRatings.length
      ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
      : "—";
    return { done, pending, avg };
  }, [exchanges]);

  const startReview = (id: string) => {
    setOpenId(id);
    setRating(5);
    setHover(0);
    setText("");
    setPicked([]);
  };

  const togglePick = (t: string) =>
    setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : p.length < 3 ? [...p, t] : p));

  const submit = () => {
    if (!open) return;
    if (text.trim().length < 5) {
      toast({ title: "Добави кратък коментар", description: "Поне 5 символа.", variant: "destructive" });
      return;
    }
    reviewsStore.setMyReview(open.id, {
      rating,
      text: text.trim().slice(0, 280),
      tags: picked,
    });
    toast({
      title: "Благодарим за отзива! ⭐",
      description: `Оценката ти за ${open.partnerName} е изпратена.`,
    });
    setOpenId(null);
  };

  return (
    <section id="reviews" className="container py-20 lg:py-28">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-4">
          <ArrowLeftRight className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Двупосочни отзиви</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Оценявайте се взаимно</h2>
        <p className="text-muted-foreground text-lg">
          След всяка успешна размяна и дарителят, и получателят оставят отзив. Така изграждаме общност на доверие.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
        {[
          { v: stats.done, l: "оставени", icon: CheckCircle2, color: "text-primary" },
          { v: stats.pending, l: "чакащи", icon: Clock, color: "text-accent" },
          { v: stats.avg, l: "ср. рейтинг", icon: Star, color: "text-accent" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="p-4 border-2 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              <div className="text-2xl font-bold">{s.v}</div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {exchanges.map((e) => {
          const isDone = !!e.myReview;
          return (
            <Card
              key={e.id}
              className={`p-5 border-2 transition-smooth ${
                isDone ? "border-border" : "border-primary/40 bg-primary/5 shadow-soft"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs">
                  {e.myRole === "donor" ? "Дарил си" : "Получи"}
                </Badge>
                <span className="text-xs text-muted-foreground">{e.completedAgo}</span>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground font-bold shrink-0">
                  {e.partnerAvatar}
                </div>
                <div className="min-w-0">
                  <div className="font-bold leading-tight truncate">{e.item}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.myRole === "donor" ? "за" : "от"}{" "}
                    <span className="text-foreground font-medium">{e.partnerName}</span> · {e.category}
                  </div>
                </div>
              </div>

              {/* Partner review */}
              {e.partnerReview && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border mb-3 relative">
                  <Quote className="absolute top-2 right-2 w-4 h-4 text-muted-foreground/40" />
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: e.partnerReview.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-accent fill-accent" />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {e.partnerName} · {e.partnerReview.ago}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">"{e.partnerReview.text}"</p>
                  {e.partnerReview.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {e.partnerReview.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My review status */}
              {isDone ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Остави {e.myReview!.rating}★</span>
                  <ThumbsUp className="w-3.5 h-3.5 ml-auto" />
                </div>
              ) : (
                <Button
                  onClick={() => startReview(e.id)}
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-soft"
                >
                  <Sparkles className="w-4 h-4" />
                  Остави отзив
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Review dialog */}
      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              Оцени {open?.partnerName}
            </DialogTitle>
            <DialogDescription>
              {open?.myRole === "donor"
                ? "Как мина срещата с получателя?"
                : "Как беше дарителят и състоянието на вещта?"}
            </DialogDescription>
          </DialogHeader>

          {open && (
            <div className="space-y-4">
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 py-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    className="p-1 transition-smooth hover:scale-110"
                    aria-label={`${n} звезди`}
                  >
                    <Star
                      className={`w-9 h-9 ${
                        n <= (hover || rating) ? "text-accent fill-accent" : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Tags */}
              <div>
                <div className="text-xs text-muted-foreground mb-2">
                  Избери до 3 етикета ({picked.length}/3)
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagPool.map((t) => {
                    const on = picked.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => togglePick(t)}
                        className={`px-3 py-1.5 text-xs rounded-full border-2 transition-smooth ${
                          on
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 280))}
                  placeholder="Сподели как мина размяната..."
                  rows={3}
                />
                <div className="text-[10px] text-muted-foreground text-right mt-1">{text.length}/280</div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenId(null)}>
              Отказ
            </Button>
            <Button onClick={submit} className="bg-gradient-primary hover:opacity-90">
              Изпрати отзив
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MutualReviews;