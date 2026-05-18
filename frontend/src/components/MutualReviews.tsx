import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeftRight, CheckCircle2, Clock, Quote } from "lucide-react";
import { getReviewsStats, getRecentReviews } from "@/lib/api";

export const MutualReviews = () => {
  const [stats, setStats] = useState({ donated: 0, pending: 0, averageRating: 0 });
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reviewsData] = await Promise.all([
          getReviewsStats(),
          getRecentReviews(6)
        ]);
        setStats(statsData);
        setRecentReviews(reviewsData);
      } catch (error) {
        console.error("Failed to fetch reviews data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'току-що';
    if (diffHours < 24) return `преди ${diffHours}ч`;
    if (diffDays === 1) return 'вчера';
    return `преди ${diffDays} дни`;
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
          { v: loading ? "..." : stats.donated, l: "дарени", icon: CheckCircle2, color: "text-primary" },
          { v: loading ? "..." : stats.pending, l: "чакащи", icon: Clock, color: "text-accent" },
          { v: loading ? "..." : (stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"), l: "ср. рейтинг", icon: Star, color: "text-accent" },
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

      {/* Recent Reviews Feed */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentReviews.map((review) => {
          // Identify if the review is about a donor or receiver
          // If reviewer is the donor of the exchange, reviewee is the receiver
          // Unfortunately we didn't send exact role info, but we can guess or just display neutrally.
          const isReviewerDonor = review.exchange?.donation?.userId === review.reviewerId;
          const roleLabel = isReviewerDonor ? "Получател" : "Дарител";

          return (
            <Card
              key={review.id}
              className="p-4 sm:p-5 border-2 border-border transition-smooth shadow-soft"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-[10px] py-0 h-5">
                  {review.exchange?.donation?.category || "Общи"}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{formatAgo(review.createdAt)}</span>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground font-bold shrink-0 text-sm sm:text-base">
                  {review.reviewee?.avatarUrl ? (
                    <img src={review.reviewee.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    review.reviewee?.name?.charAt(0) || "?"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold leading-tight truncate text-sm sm:text-base">{review.exchange?.donation?.title || "Вещ"}</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    оценка за <span className="text-foreground font-medium">{review.reviewee?.name || "Потребител"}</span>
                  </div>
                </div>
              </div>

              {/* The review itself */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border relative mt-auto">
                <Quote className="absolute top-2 right-2 w-3 h-3 text-muted-foreground/40" />
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-2.5 h-2.5 ${j < review.rating ? "text-accent fill-accent" : "text-muted-foreground/30"}`} />
                  ))}
                  <span className="text-[9px] text-muted-foreground ml-1 truncate">
                    от {review.reviewer?.name || "Анонимен"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed line-clamp-3">"{review.comment}"</p>
              </div>
            </Card>
          );
        })}
        {!loading && recentReviews.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            Все още няма оставени отзиви.
          </div>
        )}
      </div>
    </section>
  );
};

export default MutualReviews;