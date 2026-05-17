import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Sprout, TreeDeciduous, Trees, Crown, Star, ShieldCheck,
  BadgeCheck, Mail, Phone, MapPin, Flame, Heart, Quote, Award,
  Target, MessageSquare, Package, User
} from "lucide-react";
import { CATEGORY_LABEL } from "@/lib/reviewsStore";

type Level = {
  key: string;
  name: string;
  min: number;
  icon: typeof Sprout;
  color: string;
};

const LEVELS: Level[] = [
  { key: "seed", name: "Семка", min: 0, icon: Sprout, color: "hsl(152 56% 38%)" },
  { key: "sprout", name: "Кълн", min: 5, icon: Sprout, color: "hsl(152 56% 45%)" },
  { key: "tree", name: "Дърво", min: 20, icon: TreeDeciduous, color: "hsl(45 95% 50%)" },
  { key: "forest", name: "Гора", min: 50, icon: Trees, color: "hsl(200 85% 55%)" },
  { key: "legend", name: "Легенда", min: 100, icon: Crown, color: "hsl(15 90% 60%)" },
];

const BADGES = [
  { icon: Sprout, name: "Първо дарение", desc: "Подари първата си вещ", earned: true },
  { icon: Heart, name: "Сърдечен дарител", desc: "10+ успешни дарения", earned: true },
  { icon: Flame, name: "7 дни подред", desc: "Активност цяла седмица", earned: true },
  { icon: Trees, name: "Еко герой", desc: "Спести 100kg отпадъци", earned: false },
  { icon: Star, name: "5★ профил", desc: "Постигни перфектен рейтинг", earned: true },
  { icon: Crown, name: "Лидер на квартала", desc: "Топ 3 в района ти", earned: false },
];

const CATEGORY_ICONS = {
  accuracy: Target,
  communication: MessageSquare,
  condition: Package,
} as const;

const TRUST_CHECKS = [
  { icon: Mail, label: "Имейл потвърден", done: true },
  { icon: Phone, label: "Телефон потвърден", done: true },
  { icon: BadgeCheck, label: "Лична карта (опц.)", done: false },
  { icon: MapPin, label: "Локация потвърдена", done: true },
];

interface Review {
    id: number;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewer?: { name: string };
    exchange?: { donation?: { title: string } };
}

interface GamificationProps {
    reviews: Review[];
    donationsCount: number;
}

export const Gamification = ({ reviews, donationsCount }: GamificationProps) => {
  // Logic to calculate points: 5 points per donation, 2 points per 5-star review
  const myPoints = (donationsCount * 5) + (reviews.filter(r => r.rating === 5).length * 2);
  
  const stats = useMemo(() => {
    const overall = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;
    return {
        overall,
        count: reviews.length,
        byCategory: {
            accuracy: { avg: overall, count: reviews.length },
            communication: { avg: overall, count: reviews.length },
            condition: { avg: overall, count: reviews.length },
        }
    };
  }, [reviews]);

  const { current, next, progress } = useMemo(() => {
    const cur = [...LEVELS].reverse().find((l) => myPoints >= l.min) || LEVELS[0];
    const nxt = LEVELS.find((l) => l.min > myPoints);
    const span = nxt ? nxt.min - cur.min : 1;
    const have = myPoints - cur.min;
    return { current: cur, next: nxt, progress: Math.min(100, (have / span) * 100) };
  }, [myPoints]);

  const CurIcon = current.icon;

  return (
    <section id="trust" className="py-20 lg:py-28">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-4">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Геймификация и доверие</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
          Расти с всяко добро дело
        </h2>
        <p className="text-muted-foreground text-lg">
          Печели нива, събирай значки и изграждай доверен профил в общността.
        </p>
      </div>

      {/* My Profile + Level */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 p-6 lg:p-8 border-2 bg-gradient-hero overflow-hidden relative" style={{ borderRadius: '2rem' }}>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className="w-24 h-24 rounded-3xl grid place-items-center shadow-glow shrink-0"
              style={{ background: `linear-gradient(135deg, ${current.color}, hsl(var(--primary-glow)))` }}
            >
              <CurIcon className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  Твоето ниво
                </span>
                <Badge className="bg-gradient-primary border-0">Ниво {LEVELS.indexOf(current) + 1}</Badge>
              </div>
              <div className="text-3xl font-bold mb-2">{current.name}</div>
              {next ? (
                <>
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>{myPoints} точки</span>
                    <span>
                      Още <b className="text-foreground">{next.min - myPoints}</b> до{" "}
                      <b className="text-foreground">{next.name}</b>
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Достигна максималното ниво 👑</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
            {[
              { v: donationsCount.toString(), l: "дарения" },
              { v: stats.overall ? stats.overall.toFixed(1) : "—", l: `рейтинг (${stats.count})` },
              { v: `${donationsCount * 2}кг`, l: "спасени" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {s.v}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trust card */}
        <Card className="p-6 border-2" style={{ borderRadius: '2rem' }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Доверен профил</h3>
            <Badge className="ml-auto bg-primary/10 text-primary border-0">75%</Badge>
          </div>
          <Progress value={75} className="h-2 mb-4" />
          <div className="space-y-2">
            {TRUST_CHECKS.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border-2 ${
                    t.done ? "border-primary/30 bg-primary/5" : "border-dashed border-border opacity-70"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${t.done ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm flex-1">{t.label}</span>
                  {t.done ? (
                    <BadgeCheck className="w-4 h-4 text-primary" />
                  ) : (
                    <span className="text-xs text-muted-foreground">+10pt</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Rating breakdown by category */}
      <Card className="p-6 lg:p-8 border-2 mb-8" style={{ borderRadius: '2rem' }}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <h3 className="text-xl font-bold">Рейтинг по категории</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {stats.overall ? stats.overall.toFixed(1) : "—"}
            </span>
            <div className="flex flex-col">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${
                      stats.overall && j < Math.round(stats.overall)
                        ? "text-accent fill-accent"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">{stats.count} отзива</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {(Object.keys(stats.byCategory) as Array<keyof typeof stats.byCategory>).map((key) => {
            const c = stats.byCategory[key];
            const Icon = CATEGORY_ICONS[key];
            const pct = c.avg ? (c.avg / 5) * 100 : 0;
            return (
              <div key={key} className="p-4 rounded-2xl border-2 border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-primary grid place-items-center shrink-0">
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-sm">{CATEGORY_LABEL[key]}</span>
                  <span className="ml-auto font-bold text-lg">
                    {c.avg ? c.avg.toFixed(1) : "—"}
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="text-[11px] text-muted-foreground mt-1.5">
                  {c.count} {c.count === 1 ? "отзив" : "отзива"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6 lg:p-8 border-2 mb-8" style={{ borderRadius: '2rem' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold">Значки</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {BADGES.filter((b) => b.earned).length} / {BADGES.length} спечелени
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className={`group p-4 rounded-2xl border-2 text-center transition-smooth ${
                  b.earned
                    ? "border-primary/30 bg-gradient-hero hover:shadow-soft"
                    : "border-dashed border-border opacity-50 grayscale"
                }`}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl grid place-items-center mb-2 ${
                    b.earned ? "bg-gradient-primary shadow-soft group-hover:scale-110 transition-smooth" : "bg-muted"
                  }`}
                >
                  <Icon className={`w-7 h-7 ${b.earned ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <div className="font-bold text-sm leading-tight">{b.name}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-tight">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reviews - Real data with preferred visualization */}
      <div className="grid lg:grid-cols-1 gap-6">
        <Card className="p-6 lg:p-8 border-2" style={{ borderRadius: '2rem' }}>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <h3 className="text-xl font-bold">Отзиви за теб</h3>
          </div>
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-6">
                Все още нямаш отзиви.
              </div>
            )}
            {reviews.map((r, i) => {
              return (
                <div key={i} className="p-5 rounded-[1.5rem] bg-muted/40 border border-border relative">
                  <Quote className="absolute top-4 right-4 w-6 h-6 text-primary opacity-10" />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                        {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < r.rating ? "text-accent fill-accent" : "text-muted-foreground/20"}`} />
                        ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto font-medium">{new Date(r.createdAt).toLocaleDateString('bg-BG')}</span>
                  </div>
                  <p className="text-base mb-4 leading-relaxed italic text-foreground/90">"{r.comment || "Без коментар"}"</p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <User className="w-3 h-3" />
                    от <span className="font-bold text-foreground">{r.reviewer?.name || "Анонимен"}</span> 
                    <span className="opacity-50">·</span>
                    <span>за: {r.exchange?.donation?.title || "вещ"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Gamification;
