import {Heart, PackagePlus, Search, MapPin, MessageCircle, Leaf, Users, Recycle, Sparkles, ArrowRight, Star, Menu, LogOut, Settings, User, Trophy, Medal} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Badge} from "@/components/ui/badge";
import {motion} from "framer-motion";
import heroImg from "@/assets/hero-donate.jpg";
import MutualReviews from "@/components/MutualReviews";
import GlobalImpact from "@/components/GlobalImpact";
import AiMatchmaker from "@/components/AiMatchmaker";

const topUsers = [
    {
        id: 1,
        name: "Венета Кирилова",
        avatar: "https://softuni.circle.so/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCT3ZzNXdrPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--b7e3ea9823418a1fe39751d76860e5d7eef437ff/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU2Q25OaGRtVnlld1k2Q25OMGNtbHdWQT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--67365f61f655fbc86c65a51f2e9992ab818c41cd/IMG_20251124_010930_135.jpg?w=150&h=150&fit=crop&crop=face",
        items: 142,
        badge: "Златно сърце",
        role: "Легенда",
        color: "from-amber-400 to-orange-500",
    },
    {id: 2, name: "Иван К.", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face", items: 89, badge: "Еко герой", role: "Супер дарител", color: "from-emerald-400 to-green-600"},
    {id: 3, name: "Мария С.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", items: 64, badge: "Вдъхновител", role: "Ментор", color: "from-blue-400 to-indigo-500"},
    {id: 4, name: "Петър В.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", items: 45, badge: "Посланик", role: "Активен", color: "from-purple-400 to-pink-500"},
    {id: 5, name: "Анна М.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", items: 31, badge: "Нова надежда", role: "Дарител", color: "from-rose-400 to-red-500"},
];

const Index = () => {
    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-hero">
                <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

                {/* Floating animated elements */}
                <motion.div animate={{y: [0, -20, 0]}} transition={{repeat: Infinity, duration: 4, ease: "easeInOut"}} className="absolute top-32 left-10 hidden lg:block">
                    <div className="w-16 h-16 rounded-full bg-accent/30 backdrop-blur-md grid place-items-center shadow-lg border border-white/20">
                        <Leaf className="w-6 h-6 text-accent-foreground" />
                    </div>
                </motion.div>
                <motion.div animate={{y: [0, 20, 0]}} transition={{repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1}} className="absolute bottom-32 right-1/2 hidden lg:block">
                    <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md grid place-items-center shadow-lg border border-white/20">
                        <Heart className="w-5 h-5 text-primary" fill="currentColor" />
                    </div>
                </motion.div>

                <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
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
                            <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-soft text-base h-12 px-6">
                                <PackagePlus className="w-5 h-5" /> Дарявам вещ
                            </Button>
                            <Button size="lg" variant="outline" className="text-base h-12 px-6 border-2">
                                <Search className="w-5 h-5" /> Търся вещ
                            </Button>
                        </div>
                        <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background" />
                                ))}
                            </div>
                            <span>Над 500+ души вече се присъединиха</span>
                        </div>
                    </motion.div>

                    <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.6, delay: 0.4}} className="relative">
                        <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-30" />
                        <img src={heroImg} alt="Ръце, които си подават вещ — символ на дарителство" width={1536} height={1024} className="relative rounded-3xl shadow-soft w-full" />
                        <Card className="absolute -bottom-22 -left-6 p-4 shadow-soft border-2 hidden sm:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent grid place-items-center">
                                    <Leaf className="w-5 h-5 text-accent-foreground" />
                                </div>
                                <div>
                                    <div className="font-bold">2,340 кг</div>
                                    <div className="text-xs text-muted-foreground">спасени от боклука</div>
                                </div>
                            </div>
                        </Card>
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

            {/* Heroes Section on Index */}
            <section id="heroes" className="bg-muted/30 py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="container relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground mb-4">
                            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                            <span className="text-sm font-medium">Топ потребители</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Сърцето на общността</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">Запознай се с хората, които правят най-голямата промяна. Те не просто даряват вещи, те подаряват надежда.</p>
                        <Link to="/heroes">
                            <Button variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-all group">
                                Виж цялата зала на славата
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                        {topUsers.slice(0, 4).map((user) => (
                            <HoverCard key={user.id}>
                                <HoverCardTrigger asChild>
                                    <button className="relative group cursor-pointer focus:outline-none">
                                        <div className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${user.color} opacity-0 group-hover:opacity-100 blur-md transition-all duration-500`} />
                                        <Avatar className="relative w-24 h-24 lg:w-28 lg:h-28 border-4 border-background shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                                            <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                                            <AvatarFallback className="text-xl font-bold">
                                                {user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Mini badge icon directly on avatar */}
                                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full grid place-items-center shadow-lg border-2 border-background group-hover:scale-110 transition-transform duration-300 z-10 bg-gradient-to-br ${user.color}`}>
                                            <Medal className="w-4 h-4 text-white" fill="currentColor" strokeWidth={1} />
                                        </div>
                                    </button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 p-0 overflow-hidden shadow-2xl border-border/50 rounded-xl z-50" sideOffset={15}>
                                    <div className={`h-2 bg-gradient-to-r ${user.color}`} />
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-lg font-bold">{user.name}</h4>
                                                <p className="text-sm text-muted-foreground">{user.role}</p>
                                            </div>
                                            <Badge variant="secondary" className={`bg-gradient-to-r ${user.color} text-white border-0 shadow-sm`}>
                                                {user.badge}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm mt-4">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-bold text-foreground">{user.items}</span>
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Дарени вещи</span>
                                            </div>
                                            <div className="h-10 w-px bg-border" />
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-bold text-foreground">{Math.floor(user.items * 2.5)}кг</span>
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Спестен CO2</span>
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </div>
                </div>
            </section>

            <GlobalImpact />

            <MutualReviews />

            {/* Impact */}
            <section id="impact" className="bg-gradient-hero py-20 lg:py-28">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Ефект, който усещаш</h2>
                            <p className="text-muted-foreground text-lg mb-8">Всяка дарена вещ е по-малко боклук, по-малко производство и едно семейство с повече усмивки.</p>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    {v: "2.3т", l: "спасени"},
                                    {v: "840", l: "дарения"},
                                    {v: "12", l: "квартала"},
                                ].map((s, i) => (
                                    <div key={i} className="text-center p-4 rounded-2xl bg-card border border-border shadow-soft">
                                        <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{s.v}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                {icon: Leaf, t: "Екология", d: "По-малко отпадъци, по-малко производство, по-чист град."},
                                {icon: Users, t: "Социално", d: "Реална помощ за семейства, които имат нужда."},
                                {icon: Recycle, t: "Кръгова икономика", d: "Втори, трети и пети живот на всяка вещ."},
                                {icon: Heart, t: "Общност", d: "Съседи, които си помагат — отново."},
                            ].map((c, i) => (
                                <Card key={i} className="p-6 border-2 hover:shadow-soft transition-smooth">
                                    <c.icon className="w-8 h-8 text-primary mb-3" />
                                    <h3 className="font-bold mb-1">{c.t}</h3>
                                    <p className="text-sm text-muted-foreground">{c.d}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Community CTA */}
            <section id="community" className="container py-20 lg:py-28">
                <Card className="relative overflow-hidden border-0 bg-gradient-primary p-12 lg:p-16 text-center shadow-glow">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-foreground/30 blur-2xl" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent/40 blur-2xl" />
                    </div>
                    <div className="relative max-w-2xl mx-auto text-primary-foreground">
                        <Star className="w-12 h-12 mx-auto mb-4" fill="currentColor" />
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">Стани част от движението</h2>
                        <p className="text-lg opacity-90 mb-8">Започваме общност в Бургас. Дари първата си вещ или резервирай нещо, което ти трябва — без пари, само с добро.</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Button size="lg" variant="secondary" className="h-12 px-6 text-base bg-card text-foreground hover:bg-card/90">
                                Присъедини се <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-6 text-base bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                Подкрепи проекта
                            </Button>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t border-border">
                <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                        <span>Пулсът на Доброто· 2026</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-foreground transition-smooth">
                            Условия
                        </a>
                        <a href="#" className="hover:text-foreground transition-smooth">
                            Контакти
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Index;
