import {useEffect, useMemo, useRef, useState} from "react";
import {MapContainer, TileLayer, Marker, Circle, useMap} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {Badge} from "@/components/ui/badge";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from "@/components/ui/sheet";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {toast} from "sonner";
import {Shirt, Sofa, BookOpen, Cpu, Package, MapPin, Heart, Search, MessageCircle, Phone, Star, Clock, User, Send, ArrowLeft, Bell, CheckCheck, Apple, Wrench, Footprints, Gamepad2, HandHeart} from "lucide-react";
import imgClothes from "@/assets/item-clothes.jpg";
import imgFurniture from "@/assets/item-furniture.jpg";
import imgBooks from "@/assets/item-books.jpg";
import imgTech from "@/assets/item-tech.jpg";
import imgOther from "@/assets/item-other.jpg";

type PointType = "donation" | "need" | "hub";
type Category = "Дрехи" | "Обувки" | "Играчки" | "Техника" | "Мебели" | "Книги" | "Други" | "Спасена храна" | "Време и труд";
type Status = "available" | "reserved" | "open" | "urgent";

interface MapPoint {
    id: string;
    type: PointType;
    category: Category;
    title: string;
    desc: string;
    lat: number;
    lng: number;
    status: Status;
    owner: string;
    rating: number;
    postedAgo: string;
    image: string;
}

const BURGAS: [number, number] = [42.5048, 27.4626];

const CITIES = [
    {name: "София", coords: [42.6977, 23.3219] as [number, number]},
    {name: "Пловдив", coords: [42.1354, 24.7453] as [number, number]},
    {name: "Варна", coords: [43.2141, 27.9147] as [number, number]},
    {name: "Бургас", coords: [42.5048, 27.4626] as [number, number]},
    {name: "Русе", coords: [43.8486, 25.9656] as [number, number]},
    {name: "Стара Загора", coords: [42.4258, 25.6345] as [number, number]},
    {name: "Плевен", coords: [43.4165, 24.6253] as [number, number]},
];

const POINTS: MapPoint[] = [];

const CATEGORIES: {value: Category | "all"; label: string; icon: any}[] = [
    {value: "all", label: "Всички", icon: Package},
    {value: "Спасена храна", label: "Спасена храна", icon: Apple},
    {value: "Време и труд", label: "Време и труд", icon: Wrench},
    {value: "Дрехи", label: "Дрехи", icon: Shirt},
    {value: "Обувки", label: "Обувки", icon: Footprints},
    {value: "Играчки", label: "Играчки", icon: Gamepad2},
    {value: "Техника", label: "Техника", icon: Cpu},
    {value: "Мебели", label: "Мебели", icon: Sofa},
    {value: "Книги", label: "Книги", icon: BookOpen},
    {value: "Други", label: "Други", icon: Package},
];

const TYPE_META: Record<PointType, {label: string; color: string; icon: string}> = {
    donation: {label: "Дарение", color: "hsl(152 56% 38%)", icon: "💚"},
    need: {label: "Нужда", color: "hsl(15 90% 60%)", icon: "🤝"},
    hub: {label: "Пункт", color: "hsl(200 85% 55%)", icon: "📦"},
};

const STATUS_META: Record<Status, {label: string; className: string}> = {
    available: {label: "Налично", className: "bg-primary text-primary-foreground"},
    reserved: {label: "Резервирано", className: "bg-muted text-muted-foreground"},
    open: {label: "Отворен пункт", className: "bg-secondary text-secondary-foreground"},
    urgent: {label: "Спешно", className: "bg-gradient-warm text-primary-foreground"},
};

const makeIcon = (type: PointType) =>
    L.divIcon({
        className: "",
        html: `<div style="background:${TYPE_META[type].color};width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.25);border:3px solid white;cursor:pointer;"><span style="transform:rotate(45deg);font-size:16px;">${TYPE_META[type].icon}</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });

const distKm = (a: [number, number], b: [number, number]) => {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLng = ((b[1] - a[1]) * Math.PI) / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

const Recenter = ({center}: {center: [number, number]}) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
};

type ChatMessage = {
    id: string;
    from: "me" | "them";
    text: string;
    ts: number;
};

const CHAT_KEY = (id: string) => `dnh_chat_${id}`;
const loadChat = (id: string): ChatMessage[] => {
    try {
        return JSON.parse(localStorage.getItem(CHAT_KEY(id)) || "[]");
    } catch {
        return [];
    }
};
const saveChat = (id: string, msgs: ChatMessage[]) => localStorage.setItem(CHAT_KEY(id), JSON.stringify(msgs));

const AUTO_REPLIES = ["Здравей! Благодаря за интереса 💚", "Да, още е налично. Кога ти е удобно?", "Мога да го запазя за теб до утре.", "Намира се близо до центъра, лесно за вземане.", "Супер! Пиши ми час и ще се организираме."];

const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("bg-BG", {hour: "2-digit", minute: "2-digit"});
};

export const DonationMap = () => {
    const [donations, setDonations] = useState<MapPoint[]>([]);

    useEffect(() => {
        // Извличане на всички дарения от бекенда
        fetch("http://localhost:3000/donations")
            .then((res) => res.json())
            .then((data) => {
                const mappedPoints: MapPoint[] = data.map((d: any) => ({
                    id: d.id.toString(),
                    type: (d.type as PointType) || "donation",
                    category: (d.category as Category) || "Други",
                    title: d.title,
                    desc: d.description,
                    lat: d.lat || CITIES.find((c) => c.name === d.city)?.coords[0] || BURGAS[0] + (Math.random() - 0.5) * 0.05,
                    lng: d.lng || CITIES.find((c) => c.name === d.city)?.coords[1] || BURGAS[1] + (Math.random() - 0.5) * 0.05,
                    status: d.status,
                    owner: d.user?.name || "Неизвестен",
                    rating: 5.0,
                    postedAgo: new Date(d.createdAt).toLocaleDateString(),
                    image: d.imageUrl || imgOther,
                }));

                // Само реални данни от сървъра
                setDonations(mappedPoints);
            })
            .catch((err) => {
                console.error("Грешка при извличане:", err);
                setDonations([]);
            });
    }, []);

    const [category, setCategory] = useState<Category | "all">("all");
    const [radius, setRadius] = useState(5);
    const [activeTypes, setActiveTypes] = useState<Record<PointType, boolean>>({
        donation: true,
        need: true,
        hub: true,
    });
    const [center, setCenter] = useState<[number, number]>(BURGAS);
    const [selected, setSelected] = useState<MapPoint | null>(null);
    const [view, setView] = useState<"details" | "chat">("details");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const replyTimer = useRef<number | null>(null);
    const scrollEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selected) setMessages(loadChat(selected.id));
        else setView("details");
    }, [selected]);

    useEffect(() => {
        scrollEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, view]);

    const sendMessage = () => {
        if (!selected || !draft.trim()) return;
        const mine: ChatMessage = {
            id: crypto.randomUUID(),
            from: "me",
            text: draft.trim(),
            ts: Date.now(),
        };
        const next = [...messages, mine];
        setMessages(next);
        saveChat(selected.id, next);
        setDraft("");

        if (replyTimer.current) window.clearTimeout(replyTimer.current);
        const point = selected;
        replyTimer.current = window.setTimeout(
            () => {
                const reply: ChatMessage = {
                    id: crypto.randomUUID(),
                    from: "them",
                    text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
                    ts: Date.now(),
                };
                const updated = [...loadChat(point.id), reply];
                saveChat(point.id, updated);
                setMessages(updated);
                toast(`Ново съобщение от ${point.owner}`, {
                    description: reply.text,
                    icon: <Bell className="w-4 h-4" />,
                });
            },
            1400 + Math.random() * 1200,
        );
    };

    const openChat = () => setView("chat");

    const filtered = useMemo(
        () =>
            donations
                .filter((p) => activeTypes[p.type])
                .filter((p) => category === "all" || p.category === category)
                .filter((p) => distKm(center, [p.lat, p.lng]) <= radius),
        [category, radius, activeTypes, center, donations],
    );

    return (
        <section id="map" className="container py-20 lg:py-28">
            <div className="max-w-2xl mx-auto text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Карта на добротата</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">Виж близо до теб</h2>
                <p className="text-muted-foreground text-lg">Дарения, активни нужди и пунктове за събиране — кликни на маркер за детайли.</p>
            </div>

            <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                {/* Filters */}
                <div className="space-y-4">
                    <Card className="p-5 border-2">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" /> Град / Регион
                        </h3>
                        <Select
                            value={CITIES.find((c) => c.coords[0] === center[0] && c.coords[1] === center[1])?.name || "Бургас"}
                            onValueChange={(val) => {
                                const c = CITIES.find((x) => x.name === val);
                                if (c) setCenter(c.coords);
                            }}
                        >
                            <SelectTrigger className="w-full bg-card">
                                <SelectValue placeholder="Избери град..." />
                            </SelectTrigger>
                            <SelectContent>
                                {CITIES.map((c) => (
                                    <SelectItem key={c.name} value={c.name}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Card>

                    <Card className="p-5 border-2">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Search className="w-4 h-4 text-primary" /> Категория
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {CATEGORIES.map((c) => {
                                const Icon = c.icon;
                                const active = category === c.value;
                                return (
                                    <button key={c.value} onClick={() => setCategory(c.value)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-smooth border-2 ${active ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft" : "bg-card border-border hover:border-primary"}`}>
                                        <Icon className="w-4 h-4" /> {c.label}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <Card className="p-5 border-2">
                        <h3 className="font-bold mb-3">Разстояние</h3>
                        <Slider value={[radius]} min={1} max={20} step={1} onValueChange={(v) => setRadius(v[0])} />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>1 км</span>
                            <span className="font-bold text-foreground">{radius} км</span>
                            <span>20 км</span>
                        </div>
                    </Card>

                    <Card className="p-5 border-2">
                        <h3 className="font-bold mb-3">Покажи</h3>
                        <div className="space-y-2">
                            {(Object.keys(TYPE_META) as PointType[]).map((t) => (
                                <button key={t} onClick={() => setActiveTypes((s) => ({...s, [t]: !s[t]}))} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border-2 transition-smooth ${activeTypes[t] ? "border-primary bg-muted" : "border-border opacity-50"}`}>
                                    <span className="flex items-center gap-2 text-sm font-medium">
                                        <span className="w-3 h-3 rounded-full" style={{background: TYPE_META[t].color}} />
                                        {TYPE_META[t].label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{donations.filter((p) => p.type === t).length}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-5 border-2 bg-gradient-hero">
                        <div className="flex items-start gap-3">
                            <Heart className="w-5 h-5 text-primary mt-0.5" fill="currentColor" />
                            <div>
                                <div className="font-bold text-sm">{filtered.length} резултата</div>
                                <div className="text-xs text-muted-foreground">в радиус {radius} км около центъра</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Map */}
                <Card className="overflow-hidden border-2 shadow-soft h-[600px] relative z-0 isolate">
                    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{height: "100%", width: "100%"}}>
                        <Recenter center={center} />
                        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Circle
                            center={center}
                            radius={radius * 1000}
                            pathOptions={{
                                color: "hsl(152, 56%, 38%)",
                                fillColor: "hsl(152, 70%, 55%)",
                                fillOpacity: 0.08,
                                weight: 2,
                            }}
                        />
                        {filtered.map((p) => (
                            <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon(p.type)} eventHandlers={{click: () => setSelected(p)}} />
                        ))}
                    </MapContainer>
                </Card>
            </div>

            {/* Details Sheet */}
            <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-[100dvh] max-h-[100dvh]">
                    {selected && view === "details" && (
                        <div className="overflow-y-auto">
                            <div className="relative">
                                <img src={selected.image} alt={selected.title} loading="lazy" width={512} height={512} className="w-full h-64 object-cover" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge style={{background: TYPE_META[selected.type].color}} className="text-white border-0 shadow-soft">
                                        {TYPE_META[selected.type].icon} {TYPE_META[selected.type].label}
                                    </Badge>
                                    <Badge className={`border-0 shadow-soft ${STATUS_META[selected.status].className}`}>{STATUS_META[selected.status].label}</Badge>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <SheetHeader className="text-left space-y-2">
                                    <SheetTitle className="text-2xl">{selected.title}</SheetTitle>
                                    <SheetDescription className="text-base text-muted-foreground">{selected.desc}</SheetDescription>
                                </SheetHeader>

                                <div className="grid grid-cols-2 gap-3">
                                    <Card className="p-3 border-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                            <MapPin className="w-3 h-3" /> Разстояние
                                        </div>
                                        <div className="font-bold">{distKm(center, [selected.lat, selected.lng]).toFixed(1)} км</div>
                                    </Card>
                                    <Card className="p-3 border-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                            <Clock className="w-3 h-3" /> Публикувано
                                        </div>
                                        <div className="font-bold">{selected.postedAgo}</div>
                                    </Card>
                                </div>

                                <Card className="p-4 border-2 bg-muted/40">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-primary grid place-items-center">
                                            <User className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{selected.owner}</div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Star className="w-3 h-3 fill-accent text-accent" />
                                                <span className="font-medium text-foreground">{selected.rating}</span>
                                                <span>· проверен профил</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="space-y-2 pt-2">
                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-gradient-primary hover:opacity-90 shadow-soft h-12 text-base" onClick={openChat}>
                                            <MessageCircle className="w-5 h-5 mr-2" /> Чат
                                            {messages.length > 0 && <Badge className="ml-2 bg-background/20 text-primary-foreground border-0">{messages.length}</Badge>}
                                        </Button>
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700 shadow-soft h-12 text-base text-white"
                                            onClick={async () => {
                                                try {
                                                    const token = localStorage.getItem("access_token");
                                                    if (!token) {
                                                        toast.error("Трябва да влезете в профила си.");
                                                        return;
                                                    }
                                                    const res = await fetch("http://localhost:3000/exchanges", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${token}`
                                                        },
                                                        body: JSON.stringify({ donationId: parseInt(selected.id) })
                                                    });
                                                    if (res.ok) {
                                                        toast.success("Заявката е изпратена успішно!", { description: "Собственикът ще бъде уведомен."});
                                                    } else {
                                                        const err = await res.json();
                                                        toast.error("Възникна грешка", { description: err.message });
                                                    }
                                                } catch(e) {
                                                    toast.error("Мрежова грешка");
                                                }
                                            }}
                                        >
                                            <HandHeart className="w-5 h-5 mr-2" /> Поискай
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-base border-2"
                                        onClick={() =>
                                            toast("Заявка изпратена", {
                                                description: "Ще получиш телефон за връзка след одобрение.",
                                            })
                                        }
                                    >
                                        <Phone className="w-5 h-5" /> Поискай телефон
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {selected && view === "chat" && (
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-3 p-4 border-b bg-gradient-hero shrink-0">
                                <Button variant="ghost" size="icon" onClick={() => setView("details")} className="shrink-0">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <div className="w-10 h-10 rounded-full bg-gradient-primary grid place-items-center shrink-0">
                                    <User className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm truncate">{selected.owner}</div>
                                    <div className="text-xs text-muted-foreground truncate">{selected.title}</div>
                                </div>
                                <Badge style={{background: TYPE_META[selected.type].color}} className="text-white border-0 shrink-0">
                                    {TYPE_META[selected.type].icon}
                                </Badge>
                            </div>

                            <ScrollArea className="flex-1 min-h-0 p-4">
                                {messages.length === 0 ? (
                                    <div className="h-full grid place-items-center text-center py-16">
                                        <div>
                                            <div className="w-16 h-16 mx-auto rounded-full bg-muted grid place-items-center mb-3">
                                                <MessageCircle className="w-7 h-7 text-muted-foreground" />
                                            </div>
                                            <div className="font-bold mb-1">Започни разговора</div>
                                            <div className="text-sm text-muted-foreground max-w-xs">Поздрави {selected.owner} и попитай за вещта.</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {messages.map((m) => (
                                            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-soft ${m.from === "me" ? "bg-gradient-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                                                    <div className="text-sm whitespace-pre-wrap break-words">{m.text}</div>
                                                    <div className={`flex items-center gap-1 text-[10px] mt-1 ${m.from === "me" ? "text-primary-foreground/80 justify-end" : "text-muted-foreground"}`}>
                                                        {formatTime(m.ts)}
                                                        {m.from === "me" && <CheckCheck className="w-3 h-3" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={scrollEndRef} />
                                    </div>
                                )}
                            </ScrollArea>

                            <div className="p-3 border-t bg-background flex items-center gap-2">
                                <Input
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Напиши съобщение…"
                                    className="flex-1"
                                />
                                <Button onClick={sendMessage} disabled={!draft.trim()} className="bg-gradient-primary shrink-0" size="icon">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </section>
    );
};

export default DonationMap;
