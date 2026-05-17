import {useEffect, useMemo, useRef, useState} from "react";
import {MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {Badge} from "@/components/ui/badge";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from "@/components/ui/sheet";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {Shirt, Sofa, BookOpen, Cpu, Package, MapPin, Heart, Search, MessageCircle, Phone, Star, Clock, User, ArrowLeft, Apple, Wrench, Footprints, Gamepad2, HandHeart, LocateFixed, Navigation, Loader2} from "lucide-react";
import {API_BASE} from "@/lib/api";
import imgOther from "@/assets/item-other.jpg";
import ChatDialog from "./ChatDialog";
import {useAuth} from "@/contexts/AuthContext";

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
    ownerId: number;
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

const FEATURED_CITIES = [
    {name: "Бургас", coords: [42.5048, 27.4626] as [number, number], emoji: "🌊"},
    {name: "София", coords: [42.6977, 23.3219] as [number, number], emoji: "🏛️"},
    {name: "Варна", coords: [43.2141, 27.9147] as [number, number], emoji: "⚓"},
    {name: "Пловдив", coords: [42.1354, 24.7453] as [number, number], emoji: "🏺"},
    {name: "Русе", coords: [43.8486, 25.9656] as [number, number], emoji: "🌉"},
];

const makeIcon = (type: PointType) =>
    L.divIcon({
        className: "",
        html: `<div style="background:${TYPE_META[type].color};width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.25);border:3px solid white;cursor:pointer;"><span style="transform:rotate(45deg);font-size:16px;">${TYPE_META[type].icon}</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });

const userPinIcon = L.divIcon({
    className: "",
    html: `<div style="background:hsl(210, 100%, 50%);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:grid;place-items:center;box-shadow:0 0 20px rgba(0,149,255,0.4);border:4px solid white;cursor:move;"><span style="transform:rotate(45deg);font-size:18px;">📍</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
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
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const MapEvents = ({onMapClick}: {onMapClick: (lat: number, lng: number) => void}) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

export const DonationMap = () => {
    const {user: currentUser} = useAuth();
    const token = localStorage.getItem("access_token");
    const [donations, setDonations] = useState<MapPoint[]>([]);
    const [isLoadingPoints, setIsLoadingPoints] = useState(true);

    useEffect(() => {
        setIsLoadingPoints(true);
        fetch(`${API_BASE}/donations`)
            .then((res) => res.json())
            .then((data) => {
                const mappedPoints: MapPoint[] = data
                    .filter((d: any) => ["available", "reserved", "open", "urgent"].includes(d.status))
                    .map((d: any) => ({
                        id: d.id.toString(),
                        type: (d.type as PointType) || "donation",
                        category: (d.category as Category) || "Други",
                        title: d.title,
                        desc: d.description,
                        lat: (d.lat || CITIES.find((c) => c.name === d.city)?.coords[0] || BURGAS[0]) + (Math.random() - 0.5) * 0.005,
                        lng: (d.lng || CITIES.find((c) => c.name === d.city)?.coords[1] || BURGAS[1]) + (Math.random() - 0.5) * 0.005,
                        status: d.status as Status,
                        owner: d.user?.name || "Неизвестен",
                        ownerId: d.userId,
                        rating: 5.0,
                        postedAgo: new Date(d.createdAt).toLocaleDateString(),
                        image: d.imageUrl || imgOther,
                    }));
                setDonations(mappedPoints);
                setIsLoadingPoints(false);
            })
            .catch((err) => {
                console.error("Грешка при извличане:", err);
                setDonations([]);
                setIsLoadingPoints(false);
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
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Real Chat States
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeExchangeId, setActiveExchangeId] = useState<number | null>(null);
    const [isChatLoading, setIsChatLoading] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Bulgaria")}&limit=1`);
            const data = await res.json();
            if (data && data.length > 0) {
                const {lat, lon} = data[0];
                setCenter([parseFloat(lat), parseFloat(lon)]);
                toast.success(`Намерено: ${data[0].display_name}`);
            } else {
                toast.error("Не намерихме това място. Опитайте пак.");
            }
        } catch (err) {
            toast.error("Грешка при търсенето.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleLocate = () => {
        if (!navigator.geolocation) {
            toast.error("Браузърът ви не поддържа геолокация.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCenter([pos.coords.latitude, pos.coords.longitude]);
                setIsLocating(false);
                toast.success("Вашата позиция е намерена!");
            },
            () => {
                setIsLocating(false);
                toast.error("Не успяхме да ви локализираме. Проверете настройките за достъп.");
            },
        );
    };

    const handleOpenChat = async () => {
        if (!selected || !token) {
            toast.error("Трябва да влезете в профила си, за да чатите.");
            return;
        }

        if (selected.ownerId === parseInt(currentUser?.id || "0")) {
            toast.error("Не можете да чатите със себе си.");
            return;
        }

        setIsChatLoading(true);
        try {
            // First, try to find an existing exchange
            const res = await fetch(`${API_BASE}/exchanges/my-requests`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const exchanges = await res.json();
            const existing = exchanges.find((e: any) => e.donationId === parseInt(selected.id));

            if (existing) {
                setActiveExchangeId(existing.id);
                setIsChatOpen(true);
            } else {
                // Create a new exchange to start chatting
                const createRes = await fetch(`${API_BASE}/exchanges`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({donationId: parseInt(selected.id)}),
                });
                if (createRes.ok) {
                    const newExchange = await createRes.json();
                    setActiveExchangeId(newExchange.id);
                    setIsChatOpen(true);
                    toast.success("Започнахте нов чат!");
                } else {
                    const err = await createRes.json();
                    toast.error("Грешка", {description: err.message});
                }
            }
        } catch (err) {
            toast.error("Мрежова грешка при стартиране на чат.");
        } finally {
            setIsChatLoading(false);
        }
    };

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
                <p className="text-muted-foreground text-lg">Използвай картата, за да намериш помощ или да дариш в твоя район. Можеш да местиш пина или да търсиш град.</p>
            </div>

            <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory" style={{scrollbarWidth: "none"}}>
                    {FEATURED_CITIES.map((c) => {
                        const active = Math.abs(center[0] - c.coords[0]) < 0.01 && Math.abs(center[1] - c.coords[1]) < 0.01;
                        const count = donations.filter((p) => distKm(c.coords, [p.lat, p.lng]) <= 25).length;
                        return (
                            <button
                                key={c.name}
                                onClick={() => {
                                    setCenter(c.coords);
                                    toast.success(`Преместено към ${c.name}`);
                                }}
                                className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-300 ${active ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft scale-105" : "bg-card border-border hover:border-primary hover:bg-primary/5"}`}
                            >
                                <span className="text-base">{c.emoji}</span>
                                <span>{c.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                {/* Filters */}
                <div className="space-y-4">
                    <Card className="p-5 border-2 space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                                <Search className="w-4 h-4" /> Търси локация
                            </h3>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input placeholder="Град или квартал..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-card" />
                                <Button type="submit" size="icon" disabled={isSearching} className="shrink-0 bg-gradient-primary">
                                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                                </Button>
                            </form>
                        </div>

                        <div className="pt-2">
                            <h3 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                                <MapPin className="w-4 h-4" /> Бърз избор
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Select
                                    value={CITIES.find((c) => c.coords[0] === center[0] && c.coords[1] === center[1])?.name || ""}
                                    onValueChange={(val) => {
                                        const c = CITIES.find((x) => x.name === val);
                                        if (c) setCenter(c.coords);
                                    }}
                                >
                                    <SelectTrigger className="w-full bg-card border-2">
                                        <SelectValue placeholder="Избери голям град..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CITIES.map((c) => (
                                            <SelectItem key={c.name} value={c.name}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button variant="outline" className="w-full border-2 hover:bg-primary/5 hover:text-primary transition-colors h-10" onClick={handleLocate} disabled={isLocating}>
                                    {isLocating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LocateFixed className="w-4 h-4 mr-2" />}
                                    Локализирай ме
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 border-2">
                        <h3 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                            <Search className="w-4 h-4" /> Категория
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
                        <h3 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                            Радиус: <span className="text-primary">{radius} км</span>
                        </h3>
                        <Slider value={[radius]} min={1} max={50} step={1} onValueChange={(v) => setRadius(v[0])} />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase font-bold tracking-tighter">
                            <span>1 км</span>
                            <span>50 км</span>
                        </div>
                    </Card>

                    <Card className="p-5 border-2">
                        <h3 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">Покажи</h3>
                        <div className="space-y-2">
                            {(Object.keys(TYPE_META) as PointType[]).map((t) => (
                                <button key={t} onClick={() => setActiveTypes((s) => ({...s, [t]: !s[t]}))} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border-2 transition-smooth ${activeTypes[t] ? "border-primary bg-primary/5" : "border-border opacity-50"}`}>
                                    <span className="flex items-center gap-2 text-sm font-medium">
                                        <span className="w-3 h-3 rounded-full" style={{background: TYPE_META[t].color}} />
                                        {TYPE_META[t].label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{donations.filter((p) => p.type === t).length}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-5 border-2 bg-gradient-hero border-primary/20">
                        <div className="flex items-start gap-3 text-primary">
                            <Heart className="w-5 h-5 mt-0.5" fill="currentColor" />
                            <div>
                                <div className="font-black text-sm">{filtered.length} обяви</div>
                                <div className="text-[11px] font-medium leading-tight">намерени в избрания район</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Map */}
                <Card className="overflow-hidden border-2 shadow-soft h-[650px] relative z-0 isolate group">
                    <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
                        <Recenter center={center} />
                        <MapEvents onMapClick={(lat, lng) => setCenter([lat, lng])} />
                        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <Circle
                            center={center}
                            radius={radius * 1000}
                            pathOptions={{
                                color: "hsl(152, 56%, 38%)",
                                fillColor: "hsl(152, 70%, 55%)",
                                fillOpacity: 0.1,
                                weight: 2,
                                dashArray: "5, 10",
                            }}
                        />

                        {/* User position pin */}
                        <Marker position={center} icon={userPinIcon} zIndexOffset={-50} />

                        {isLoadingPoints ? (
                            <div className="absolute inset-0 z-[1000] bg-background/20 backdrop-blur-[1px] grid place-items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            filtered.map((p) => <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon(p.type)} eventHandlers={{click: () => setSelected(p)}} />)
                        )}
                    </MapContainer>

                    <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none">
                        <div className="bg-background/90 backdrop-blur-md px-4 py-2 rounded-full border shadow-lg text-[11px] font-bold text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">💡 Кликни на картата, за да преместиш позицията си</div>
                    </div>
                </Card>
            </div>

            {/* Details Sheet */}
            <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-[100dvh] max-h-[100dvh]">
                    {selected && (
                        <div className="overflow-y-auto">
                            <div className="relative">
                                <img src={selected.image} alt={selected.title} loading="lazy" width={512} height={512} className="w-full h-64 object-cover" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge style={{background: TYPE_META[selected.type]?.color || "#ccc"}} className="text-white border-0 shadow-soft">
                                        {TYPE_META[selected.type]?.icon || "📦"} {TYPE_META[selected.type]?.label || "Вещ"}
                                    </Badge>
                                    {STATUS_META[selected.status] && <Badge className={`border-0 shadow-soft ${STATUS_META[selected.status].className}`}>{STATUS_META[selected.status].label}</Badge>}
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
                                        <Button className="flex-1 bg-gradient-primary hover:opacity-90 shadow-soft h-12 text-base" onClick={handleOpenChat} disabled={isChatLoading}>
                                            {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageCircle className="w-5 h-5 mr-2" />}
                                            Чат
                                        </Button>
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700 shadow-soft h-12 text-base text-white"
                                            onClick={async () => {
                                                try {
                                                    if (!token) {
                                                        toast.error("Трябва да влезете в профила си.");
                                                        return;
                                                    }
                                                    const res = await fetch(`${API_BASE}/exchanges`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                        body: JSON.stringify({donationId: parseInt(selected.id)}),
                                                    });
                                                    if (res.ok) {
                                                        toast.success("Заявката е изпратена успішно!", {description: "Собственикът ще бъде уведомен."});
                                                    } else {
                                                        const err = await res.json();
                                                        toast.error("Възникна грешка", {description: err.message});
                                                    }
                                                } catch (e) {
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
                </SheetContent>
            </Sheet>

            {activeExchangeId && <ChatDialog exchangeId={activeExchangeId} isOpen={isChatOpen} onOpenChange={setIsChatOpen} recipientName={selected?.owner || "Потребител"} itemTitle={selected?.title || "Вещ"} />}
        </section>
    );
};

export default DonationMap;
