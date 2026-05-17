import {useEffect, useState} from "react";
import {Heart, PackagePlus, Search, MapPin, MessageCircle, Leaf, Users, Recycle, Sparkles, ArrowRight, Star, Clock} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Badge} from "@/components/ui/badge";
import {motion} from "framer-motion";
import heroImg from "@/assets/hero-donate.jpg";
import MutualReviews from "@/components/MutualReviews";
import GlobalImpact from "@/components/GlobalImpact";
import AiMatchmaker from "@/components/AiMatchmaker";
import TopDonors from "@/components/TopDonors";
import {API_BASE} from "@/lib/api";

const Index = () => {
    const [recentUsers, setRecentUsers] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${API_BASE}/users/recent?limit=5`)
            .then((res) => res.json())
            .then((data) => setRecentUsers(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, []);

    const getUserColor = (index: number) => {
        const colors = ["from-amber-400 to-orange-500", "from-emerald-400 to-green-600", "from-blue-400 to-indigo-500", "from-purple-400 to-pink-500", "from-rose-400 to-red-500"];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-hero">
                <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

                {/* Floating animated elements */}
                <motion.div animate={{y: [0, 14, 0]}} transition={{repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1}} className="absolute top-1/3 right-6 hidden lg:block">
                    <div className="w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-xl grid place-items-center shadow-xl border border-white/40">
                        <Recycle className="w-5 h-5 text-primary" />
                    </div>
                </motion.div>

                <motion.div animate={{y: [0, -18, 0]}} transition={{repeat: Infinity, duration: 5, ease: "easeInOut"}} className="absolute top-24 left-8 hidden lg:block">
                    <div className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-xl grid place-items-center shadow-xl border border-white/40">
                        <Leaf className="w-6 h-6 text-primary" />
                    </div>
                </motion.div>

                <div className="container relative grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center py-14 lg:py-20">
                    <motion.div initial={{opacity: 0, x: -50}} animate={{opacity: 1, x: 0}} transition={{duration: 0.6, delay: 0.2}} className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Социална мрежа за полезност</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                            Дари вещ.
                            <br />
                            <span className="bg-gradient-primary bg-clip-text text-transparent">Подари живот.</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-lg">Платформа, която свързва дарители с хора в нужда. По-малко отпадъци, повече солидарност — започваме от Бургас.</p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link to="/donate">
                                <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-soft text-base h-12 px-6">
                                    <PackagePlus className="w-5 h-5" /> Дарявам вещ
                                </Button>
                            </Link>
                            <Link to="/need">
                                <Button size="lg" variant="outline" className="text-base h-12 px-6 border-2">
                                    <Search className="w-5 h-5" /> Търся вещ
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 pt-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background shadow" />
                                ))}
                            </div>
                            <div className="text-sm">
                                <div className="font-semibold text-foreground">500+ герои</div>
                                <div className="text-xs text-muted-foreground">вече се присъединиха</div>
                            </div>
                            <div className="hidden sm:block h-8 w-px bg-border/70 mx-1" />
                            <div className="hidden sm:flex items-center gap-2 text-sm">
                                <div className="w-8 h-8 rounded-full bg-accent/60 grid place-items-center">
                                    <Leaf className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">2 340 кг</div>
                                    <div className="text-xs text-muted-foreground">спасени от боклука</div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-[11px] font-medium text-foreground/80 shadow-sm">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                    </span>
                                    На живо · 12 активни дарения
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-[11px] font-medium text-foreground/80 shadow-sm">
                                    <Heart className="w-3 h-3 text-primary" fill="currentColor" /> 100% безплатно
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-[11px] font-medium text-foreground/80 shadow-sm">
                                    <Leaf className="w-3 h-3 text-primary" /> Проверена общност
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-2.5">
                                <motion.div animate={{y: [0, -3, 0]}} transition={{repeat: Infinity, duration: 4, ease: "easeInOut"}} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/65 backdrop-blur-md border border-white/60 shadow-sm">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shrink-0">
                                        <PackagePlus className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] text-muted-foreground">преди 2 мин</div>
                                        <div className="text-xs font-semibold leading-tight truncate">Иван дари зимни дрехи в София</div>
                                    </div>
                                </motion.div>
                                <motion.div animate={{y: [0, -3, 0]}} transition={{repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.5}} className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/65 backdrop-blur-md border border-white/60 shadow-sm">
                                    <div className="w-9 h-9 rounded-xl bg-accent grid place-items-center shrink-0">
                                        <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] text-muted-foreground">преди 5 мин</div>
                                        <div className="text-xs font-semibold leading-tight truncate">Елена намери дом за играчки</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.6, delay: 0.4}} className="relative">
                        <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-30" />
                        <img src={heroImg} alt="Giving" width={1536} height={1024} className="relative rounded-3xl shadow-soft w-full" />
                        <motion.div animate={{y: [0, -8, 0]}} transition={{repeat: Infinity, duration: 4, ease: "easeInOut"}} className="absolute -bottom-5 -right-2 sm:-right-6">
                            <div className="p-4 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-xl min-w-[180px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-accent grid place-items-center">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="text-xs font-medium text-muted-foreground">Активни сега</div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-2xl font-bold leading-none">128</div>
                                        <div className="text-[11px] text-muted-foreground mt-1">в общността</div>
                                    </div>
                                    <div className="flex -space-x-1.5">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-gradient-primary border-2 border-white" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* AI Floating Chat Widget */}
            <AiMatchmaker />

            {/* How it works */}
            <section id="how" className="container py-20 lg:py-28">
                <div className="max-w-2xl mx-auto text-center mb-14">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">Как работи?</h2>
                    <p className="text-muted-foreground text-lg">Три прости стъпки разделят една ненужна вещ от нов дом.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {icon: PackagePlus, title: "Качи вещ", desc: "Снимка, категория и кратко описание. Готов си за минута.", num: "01"},
                        {icon: MapPin, title: "Свържи се", desc: "Виж кой има нужда близо до теб или избери пункт за оставяне.", num: "02"},
                        {icon: MessageCircle, title: "Дари с любов", desc: "Кратък чат, среща и една усмивка повече в света.", num: "03"},
                    ].map((s, i) => (
                        <Card key={i} className="p-8 border-2 hover:border-primary hover:shadow-soft transition-smooth group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-soft group-hover:scale-110 transition-smooth">
                                    <s.icon className="w-7 h-7 text-primary-foreground" />
                                </div>
                                <span className="text-5xl font-bold text-muted">{s.num}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                            <p className="text-muted-foreground">{s.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Heroes Section on Index - Combined Recent & Top */}
            <section id="heroes" className="bg-muted/30 py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Recent Users Side */}
                        <div className="space-y-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground mb-4">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium uppercase tracking-wider">Нови герои</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">Сърцето на общността</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">Добре дошли на нашите най-нови членове! Всеки нов герой прави света малко по-добър.</p>
                            </div>

                            <div className="flex flex-wrap gap-6 lg:gap-8 justify-start">
                                {recentUsers.map((user, index) => (
                                    <HoverCard key={user.id}>
                                        <HoverCardTrigger asChild>
                                            <button className="relative group cursor-pointer focus:outline-none">
                                                <div className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${getUserColor(index)} opacity-0 group-hover:opacity-100 blur-md transition-all duration-500`} />
                                                <Avatar className="relative w-20 h-20 lg:w-28 lg:h-28 border-4 border-background shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                                                    <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                                                    <AvatarFallback className="text-xl font-bold">
                                                        {(user.name || "U")
                                                            .split(" ")
                                                            .map((n: string) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full grid place-items-center shadow-lg border-2 border-background group-hover:scale-110 transition-transform duration-300 z-10 bg-gradient-to-br ${getUserColor(index)}`}>
                                                    <Star className="w-4 h-4 text-white" fill="currentColor" strokeWidth={1} />
                                                </div>
                                            </button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-72 p-0 overflow-hidden shadow-2xl border-border/50 rounded-xl z-50" sideOffset={15}>
                                            <div className={`h-2 bg-gradient-to-r ${getUserColor(index)}`} />
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold">{user.name || "Анонимен"}</h4>
                                                        <p className="text-xs text-muted-foreground">{user.city || "България"}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] border-0 px-2 py-0">
                                                        НОВ
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground">{user._count?.donations || 0}</span>
                                                        <span className="text-muted-foreground text-[10px] uppercase">Обяви</span>
                                                    </div>
                                                    <div className="h-6 w-px bg-border" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{new Date(user.createdAt).toLocaleDateString("bg-BG")}</span>
                                                        <span className="text-muted-foreground text-[10px] uppercase tracking-tighter">Присъедини се</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                ))}
                            </div>

                            <Link to="/heroes">
                                <Button variant="outline" className="rounded-full shadow-soft hover:shadow-md transition-all group border-2 h-12 px-8">
                                    Виж всички герои
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        {/* Top Donors Side */}
                        <div className="w-full h-full min-h-[400px]">
                            <TopDonors />
                        </div>
                    </div>
                </div>
            </section>

            <GlobalImpact />

            <div className="container py-20">
                <MutualReviews />
            </div>

            {/* CTA */}
            <section className="container py-20 lg:py-32">
                <div className="bg-gradient-primary rounded-[3rem] p-10 lg:p-20 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-8 border-white" />
                        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full border-8 border-white" />
                    </div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">Готов ли си да станеш герой?</h2>
                        <p className="text-xl opacity-90 mb-12 leading-relaxed">Всяка вещ, която дариш, разказва история и променя бъдещето. Започни днес!</p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link to="/register">
                                <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-bold rounded-full shadow-xl hover:scale-105 transition-all">
                                    Регистрирай се безплатно
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
