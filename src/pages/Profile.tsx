import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Star, Target, MessageSquare, Package, Heart, Quote } from "lucide-react";
import {
  useExchanges,
  computeProfileStats,
  CATEGORY_LABEL,
  getReceivedReviews,
} from "@/lib/reviewsStore";

const CATEGORY_ICONS = {
  accuracy: Target,
  communication: MessageSquare,
  condition: Package,
} as const;

const Profile = () => {
  const exchanges = useExchanges();
  const stats = computeProfileStats(exchanges);
  const reviews = getReceivedReviews(exchanges);

  const overall = stats.overall ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="w-4 h-4" /> Назад
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-primary grid place-items-center shadow-soft">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-lg">Профил</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="container py-12 max-w-4xl space-y-8">
        {/* Header card */}
        <Card className="p-8 border-2 shadow-soft">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-primary grid place-items-center text-4xl font-bold text-primary-foreground shadow-soft">
              Т
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-1">Ти</h1>
              <p className="text-muted-foreground mb-3">Дарител в Бургас · от 2026</p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i <= Math.round(overall) ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-lg">{overall.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({stats.count} отзива)</span>
              </div>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-soft">Редактирай</Button>
          </div>
        </Card>

        {/* Overall rating */}
        <Card className="p-8 border-2">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-2xl font-bold">Общ рейтинг</h2>
            <span className="text-sm text-muted-foreground">базиран на {stats.count} отзива</span>
          </div>
          <div className="flex items-end gap-4 mb-4">
            <span className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {overall.toFixed(1)}
            </span>
            <span className="text-muted-foreground pb-2">/ 5.0</span>
          </div>
          <Progress value={(overall / 5) * 100} className="h-3" />
        </Card>

        {/* Category breakdown */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Разбивка по категории</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {(Object.keys(CATEGORY_ICONS) as Array<keyof typeof CATEGORY_ICONS>).map((key) => {
              const Icon = CATEGORY_ICONS[key];
              const cat = stats.byCategory[key];
              const value = cat.avg ?? 0;
              return (
                <Card key={key} className="p-6 border-2 hover:shadow-soft transition-smooth">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center shadow-soft">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-bold">{CATEGORY_LABEL[key]}</div>
                      <div className="text-xs text-muted-foreground">{cat.count} отзива</div>
                    </div>
                  </div>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-3xl font-bold">{cat.avg ? value.toFixed(1) : "—"}</span>
                    {cat.avg && <span className="text-sm text-muted-foreground pb-1">/ 5</span>}
                  </div>
                  <Progress value={(value / 5) * 100} className="h-2" />
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent reviews */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Отзиви за теб</h2>
          <div className="space-y-3">
            {reviews.length === 0 && (
              <Card className="p-6 border-2 text-center text-muted-foreground">Все още няма отзиви.</Card>
            )}
            {reviews.map((r, i) => (
              <Card key={i} className="p-6 border-2">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i <= r.rating ? "fill-primary text-primary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      {r.ago && <span className="text-xs text-muted-foreground">{r.ago}</span>}
                    </div>
                    <p className="text-sm mb-3">{r.text}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;