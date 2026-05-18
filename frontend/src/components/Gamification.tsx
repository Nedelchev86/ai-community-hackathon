import {useMemo} from "react";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import {Trophy, Sprout, ShieldCheck, BadgeCheck, Mail, Phone, MapPin, Flame, Heart, Quote, Award, Target, MessageSquare, Package, User, Star} from "lucide-react";
import {CATEGORY_LABEL} from "@/lib/reviewsStore";

const LEVELS = [
    {
        key: "seed",
        name: "Семенце",
        desc: "Нов потребител, току-що посял добрина",
        min: 0,
        maxDepth: 1,
        rootLen: 25,
        leafColor: "hsl(142, 71%, 45%)",
        trunkColor: "hsl(25, 40%, 30%)",
        bloom: false,
        glow: "rgba(34,197,94,0.15)",
    },
    {
        key: "sprout",
        name: "Младо дърво",
        desc: "Редовна активност и първи плодове",
        min: 20,
        maxDepth: 3,
        rootLen: 35,
        leafColor: "hsl(142, 76%, 36%)",
        trunkColor: "hsl(25, 40%, 30%)",
        bloom: false,
        glow: "rgba(16,185,129,0.25)",
    },
    {
        key: "living",
        name: "Живо дърво",
        desc: "Помага активно на местната общност",
        min: 50,
        maxDepth: 5,
        rootLen: 45,
        leafColor: "hsl(142, 72%, 29%)",
        trunkColor: "hsl(25, 50%, 25%)",
        bloom: false,
        glow: "rgba(245,158,11,0.25)",
    },
    {
        key: "blooming",
        name: "Цъфтящо дърво",
        desc: "Вдъхновява други хора с примера си",
        min: 100,
        maxDepth: 6,
        rootLen: 55,
        leafColor: "hsl(142, 72%, 29%)",
        trunkColor: "hsl(25, 50%, 25%)",
        bloom: true,
        glow: "rgba(236,72,153,0.35)",
    },
    {
        key: "guardian",
        name: "Дърво-пазител",
        desc: "Огромен принос и дълбоки корени",
        min: 150,
        maxDepth: 7,
        rootLen: 65,
        leafColor: "hsl(160, 84%, 20%)",
        trunkColor: "hsl(25, 60%, 20%)",
        bloom: false,
        glow: "rgba(4,120,87,0.45)",
    },
    {
        key: "life",
        name: "Дърво на живота",
        desc: "Сърцето на цялата екосистема",
        min: 250,
        maxDepth: 8,
        rootLen: 70,
        leafColor: "hsl(45, 93%, 47%)",
        trunkColor: "hsl(215, 32%, 17%)",
        bloom: true,
        glow: "rgba(252,211,77,0.65)",
    },
];

const BADGES = [
    {icon: Sprout, name: "Първо дарение", desc: "Подари първата си вещ", earned: true},
    {icon: Heart, name: "Сърдечен дарител", desc: "10+ успешни дарения", earned: true},
    {icon: Flame, name: "7 дни подред", desc: "Активност цяла седмица", earned: true},
    {icon: Target, name: "Еко герой", desc: "Спести 100kg отпадъци", earned: false},
    {icon: Star, name: "5★ профил", desc: "Постигни перфектен рейтинг", earned: true},
    {icon: Award, name: "Лидер", desc: "Топ 3 в района ти", earned: false},
];

const CATEGORY_ICONS = {
    accuracy: Target,
    communication: MessageSquare,
    condition: Package,
} as const;

interface Review {
    id: number;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewer?: {name: string};
    exchange?: {donation?: {title: string}};
}

interface GamificationProps {
    reviews: Review[];
    donationsCount: number;
}

const Branch = ({x, y, length, angle, depth, maxDepth, leafColor, trunkColor, bloom, pathStr}: any) => {
    const xEnd = x + length * Math.sin((angle * Math.PI) / 180);
    const yEnd = y - length * Math.cos((angle * Math.PI) / 180);
    const thickness = Math.max(1.5, (maxDepth - depth) * 1.5);

    // Deterministic pseudo-randomness based on the path
    const hash = pathStr.split("").reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
    const swayDelay = (hash % 4) + "s";

    if (depth >= maxDepth) {
        const isBloom = bloom && hash % 3 === 0;
        return (
            <g className="sway-branch" style={{animationDelay: swayDelay}}>
                <line x1={x} y1={y} x2={xEnd} y2={yEnd} stroke={trunkColor} strokeWidth={thickness} strokeLinecap="round" className="transition-all duration-1000" />
                <circle cx={xEnd} cy={yEnd} r={length * 0.8} fill={leafColor} opacity={0.85} className="transition-all duration-1000" />
                {isBloom && <circle cx={xEnd} cy={yEnd} r={length * 0.5} fill="#fbcfe8" opacity={0.9} className="transition-all duration-1000" />}
            </g>
        );
    }

    // Slightly asymmetrical angles
    const leftAngleModifier = 18 + (hash % 12);
    const rightAngleModifier = 18 + ((hash + 5) % 12);
    const leftAngle = angle - leftAngleModifier;
    const rightAngle = angle + rightAngleModifier;
    const nextLength = length * 0.76;

    return (
        <g className="sway-branch" style={{animationDelay: swayDelay}}>
            <line x1={x} y1={y} x2={xEnd} y2={yEnd} stroke={trunkColor} strokeWidth={thickness} strokeLinecap="round" className="transition-all duration-1000" />
            <Branch x={xEnd} y={yEnd} length={nextLength} angle={leftAngle} depth={depth + 1} maxDepth={maxDepth} leafColor={leafColor} trunkColor={trunkColor} bloom={bloom} pathStr={pathStr + "L"} />
            <Branch x={xEnd} y={yEnd} length={nextLength} angle={rightAngle} depth={depth + 1} maxDepth={maxDepth} leafColor={leafColor} trunkColor={trunkColor} bloom={bloom} pathStr={pathStr + "R"} />
        </g>
    );
};

const TreeSVG = ({currentLevel}: {currentLevel: any}) => {
    return (
        <div className="w-40 h-40 sm:w-56 sm:h-56 relative z-10">
            <svg width="100%" height="100%" viewBox="0 0 300 400" preserveAspectRatio="xMidYMax meet">
                <g transform="translate(150, 380)">
                    <Branch x={0} y={0} length={currentLevel.rootLen} angle={0} depth={0} maxDepth={currentLevel.maxDepth} leafColor={currentLevel.leafColor} trunkColor={currentLevel.trunkColor} bloom={currentLevel.bloom} pathStr="R" />
                </g>
                {/* Ground line */}
                <path d="M 50 380 Q 150 365 250 380" stroke={currentLevel.trunkColor} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.3" className="transition-all duration-1000" />
            </svg>
        </div>
    );
};

export const Gamification = ({reviews, donationsCount}: GamificationProps) => {
    // Higher multipliers to make it satisfying to grow the tree
    const myPoints = donationsCount * 15 + reviews.filter((r) => r.rating >= 4).length * 10;

    const stats = useMemo(() => {
        const overall = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;
        return {
            overall,
            count: reviews.length,
            byCategory: {
                accuracy: {avg: overall, count: reviews.length},
                communication: {avg: overall, count: reviews.length},
                condition: {avg: overall, count: reviews.length},
            },
        };
    }, [reviews]);

    const {current, next, progress} = useMemo(() => {
        const cur = [...LEVELS].reverse().find((l) => myPoints >= l.min) || LEVELS[0];
        const nxt = LEVELS.find((l) => l.min > myPoints);
        const span = nxt ? nxt.min - cur.min : 1;
        const have = myPoints - cur.min;
        return {current: cur, next: nxt, progress: Math.min(100, (have / span) * 100)};
    }, [myPoints]);

    return (
        <section id="trust" className="py-20 lg:py-28">
            <div className="max-w-2xl mx-auto text-center mb-14">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-4">
                    <Trophy className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Моето Дърво на Доброто</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">Расти с всяко добро дело</h2>
                <p className="text-muted-foreground text-lg">Всяка подарена вещ и оставен отзив поливат твоето дърво. Виж как се променя!</p>
            </div>

            {/* Procedural Tree Card */}
            <div className="grid lg:grid-cols-1 gap-6 mb-8">
                <Card className="lg:col-span-2 p-8 border-2 overflow-hidden relative" style={{borderRadius: "2rem"}}>
                    {/* Subtle animated background representing the environment */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20 pointer-events-none" />
                    <div className="absolute top-1/2 left-20 w-96 h-96 -translate-y-1/2 rounded-full blur-3xl opacity-50 animate-pulse transition-colors duration-1000 pointer-events-none" style={{backgroundColor: current.glow}} />

                    <div className="relative flex flex-col sm:flex-row items-center gap-10">
                        {/* The SVG Tree Container */}
                        <div className="relative shrink-0 flex items-center justify-center p-6 bg-white/40 dark:bg-black/20 rounded-full border border-white/40 dark:border-white/10 shadow-xl backdrop-blur-md">
                            <TreeSVG currentLevel={current} />
                        </div>

                        {/* Level Info */}
                        <div className="flex-1 w-full text-center sm:text-left z-10">
                            <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground font-black">Етап на развитие</span>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5">
                                    Ниво {LEVELS.indexOf(current) + 1} / {LEVELS.length}
                                </Badge>
                            </div>
                            <h3 className="text-4xl sm:text-5xl font-black mb-2 tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{current.name}</h3>
                            <p className="text-muted-foreground text-base sm:text-lg font-medium mb-6 italic">"{current.desc}"</p>

                            {next ? (
                                <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-sm">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <div className="text-2xl font-bold leading-none mb-1">
                                                {myPoints} <span className="text-sm font-normal text-muted-foreground">точки</span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-right">
                                            Още <span className="font-bold text-primary">{next.min - myPoints}</span> до <span className="font-bold">{next.name}</span>
                                        </div>
                                    </div>
                                    <Progress value={progress} className="h-2.5 bg-muted/50" />
                                </div>
                            ) : (
                                <div className="bg-gradient-primary text-white rounded-2xl p-5 shadow-soft animate-pulse">
                                    <div className="font-bold text-lg mb-1">Максимално ниво! ✨</div>
                                    <div className="text-white/80 text-sm">Постигна пълна хармония с природата и общността. Твоето Дърво на живота цъфти!</div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Rating breakdown by category */}
            {/* <Card className="p-6 lg:p-8 border-2 mb-8" style={{borderRadius: "2rem"}}>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-accent fill-accent" />
                        <h3 className="text-xl font-bold">Рейтинг по категории</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{stats.overall ? stats.overall.toFixed(1) : "—"}</span>
                        <div className="flex flex-col">
                            <div className="flex">
                                {Array.from({length: 5}).map((_, j) => (
                                    <Star key={j} className={`w-3.5 h-3.5 ${stats.overall && j < Math.round(stats.overall) ? "text-accent fill-accent" : "text-muted-foreground/30"}`} />
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
                                    <span className="ml-auto font-bold text-lg">{c.avg ? c.avg.toFixed(1) : "—"}</span>
                                </div>
                                <Progress value={pct} className="h-2" />
                                <div className="text-[11px] text-muted-foreground mt-1.5">
                                    {c.count} {c.count === 1 ? "отзив" : "отзива"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card> */}

            {/* Badges */}
            {/* <Card className="p-6 lg:p-8 border-2 mb-8" style={{borderRadius: "2rem"}}>
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
                            <div key={i} className={`group p-4 rounded-2xl border-2 text-center transition-smooth ${b.earned ? "border-primary/30 bg-gradient-hero hover:shadow-soft" : "border-dashed border-border opacity-50 grayscale"}`}>
                                <div className={`w-14 h-14 mx-auto rounded-2xl grid place-items-center mb-2 ${b.earned ? "bg-gradient-primary shadow-soft group-hover:scale-110 transition-smooth" : "bg-muted"}`}>
                                    <Icon className={`w-7 h-7 ${b.earned ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                </div>
                                <div className="font-bold text-sm leading-tight">{b.name}</div>
                                <div className="text-xs text-muted-foreground mt-1 leading-tight">{b.desc}</div>
                            </div>
                        );
                    })}
                </div>
            </Card> */}

            {/* Reviews - Real data with preferred visualization */}
            <div className="grid lg:grid-cols-1 gap-6">
                <Card className="p-6 lg:p-8 border-2" style={{borderRadius: "2rem"}}>
                    <div className="flex items-center gap-2 mb-6">
                        <Star className="w-5 h-5 text-accent fill-accent" />
                        <h3 className="text-xl font-bold">Отзиви за теб</h3>
                    </div>
                    <div className="space-y-4">
                        {reviews.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">Все още нямаш отзиви.</div>}
                        {reviews.map((r, i) => {
                            return (
                                <div key={i} className="p-5 rounded-[1.5rem] bg-muted/40 border border-border relative overflow-hidden">
                                    <Quote className="absolute -top-2 -right-2 w-16 h-16 text-primary opacity-5" />
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex">
                                            {Array.from({length: 5}).map((_, j) => (
                                                <Star key={j} className={`w-4 h-4 ${j < r.rating ? "text-accent fill-accent" : "text-muted-foreground/20"}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground ml-auto font-medium">{new Date(r.createdAt).toLocaleDateString("bg-BG")}</span>
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
