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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
        {[
          { v: stats.done, l: "оставени", icon: CheckCircle2, color: "text-primary" },
          { v: stats.pending, l: "чакащи", icon: Clock, color: "text-accent" },
          { v: stats.avg, l: "ср. рейтинг", icon: Star, color: "text-accent" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="p-3 sm:p-4 border-2 text-center flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-1">
              <Icon className={`w-5 h-5 ${s.color} shrink-0`} />
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <div className="text-xl sm:text-2xl font-bold leading-none">{s.v}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">{s.l}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exchanges.map((e) => {
          const isDone = !!e.myReview;
          return (
            <Card
              key={e.id}
              className={`p-4 sm:p-5 border-2 transition-smooth ${
                isDone ? "border-border" : "border-primary/40 bg-primary/5 shadow-soft"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-[10px] py-0 h-5">
                  {e.myRole === "donor" ? "Дарил си" : "Получи"}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{e.completedAgo}</span>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground font-bold shrink-0 text-sm sm:text-base">
                  {e.partnerAvatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold leading-tight truncate text-sm sm:text-base">{e.item}</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {e.myRole === "donor" ? "за" : "от"}{" "}
                    <span className="text-foreground font-medium">{e.partnerName}</span> · {e.category}
                  </div>
                </div>
              </div>

              {/* Partner review */}
              {e.partnerReview && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border mb-3 relative">
                  <Quote className="absolute top-2 right-2 w-3 h-3 text-muted-foreground/40" />
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: e.partnerReview.rating }).map((_, j) => (
                      <Star key={j} className="w-2.5 h-2.5 text-accent fill-accent" />
                    ))}
                    <span className="text-[9px] text-muted-foreground ml-1 truncate">
                      {e.partnerName} · {e.partnerReview.ago}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed line-clamp-3">"{e.partnerReview.text}"</p>
                  {e.partnerReview.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {e.partnerReview.tags.map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-card border border-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My review status */}
              {isDone ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium">Остави {e.myReview!.rating}★</span>
                  <ThumbsUp className="w-3.5 h-3.5 ml-auto" />
                </div>
              ) : (
                <Button
                  onClick={() => startReview(e.id)}
                  size="sm"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-soft h-9 sm:h-10"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 h-4 mr-2" />
                  Остави отзив
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Review dialog */}
      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Star className="w-5 h-5 text-accent fill-accent" />
              Оцени {open?.partnerName}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {open?.myRole === "donor"
                ? "Как мина срещата с получателя?"
                : "Как беше дарителят и състоянието на вещта?"}
            </DialogDescription>
          </DialogHeader>

          {open && (
            <div className="space-y-4">
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 py-1 sm:py-2">
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
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${
                        n <= (hover || rating) ? "text-accent fill-accent" : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Tags */}
              <div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-2 font-bold uppercase tracking-wider">
                  Избери до 3 етикета ({picked.length}/3)
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {tagPool.map((t) => {
                    const on = picked.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => togglePick(t)}
                        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs rounded-full border-2 transition-smooth ${
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
                  className="text-sm rounded-xl"
                />
                <div className="text-[9px] sm:text-[10px] text-muted-foreground text-right mt-1">{text.length}/280</div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-row gap-2 mt-4 sm:mt-6">
            <Button variant="outline" onClick={() => setOpenId(null)} className="flex-1 rounded-xl h-11">
              Отказ
            </Button>
            <Button onClick={submit} className="flex-1 bg-gradient-primary hover:opacity-90 rounded-xl h-11">
              Изпрати
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MutualReviews;