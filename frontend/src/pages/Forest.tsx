import {useState, useEffect, useCallback} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Sparkles, Trees, Sprout, Flower2, Heart, Gift, Clock} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {toast} from "sonner";
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Видове растения в гората
type FloraType = "tree" | "sprout" | "flower" | "love";

interface FloraProps {
    id: string;
    type: FloraType;
    lat: number;
    lng: number;
    scale: number;
}

const BG_CITIES = [
    {name: "София", lat: 42.6977, lng: 23.3219},
    {name: "Пловдив", lat: 42.1354, lng: 24.7453},
    {name: "Варна", lat: 43.2141, lng: 27.9147},
    {name: "Бургас", lat: 42.5048, lng: 27.4626},
    {name: "Русе", lat: 43.8486, lng: 25.9656},
    {name: "Стара Загора", lat: 42.4258, lng: 25.6345},
    {name: "Плевен", lat: 43.4165, lng: 24.6253},
    {name: "Велико Търново", lat: 43.0757, lng: 25.6172},
    {name: "Благоевград", lat: 42.0209, lng: 23.0943},
    {name: "Шумен", lat: 43.2712, lng: 26.9361},
    {name: "Хасково", lat: 41.9344, lng: 25.5554},
    {name: "Сливен", lat: 42.6817, lng: 26.3229},
    {name: "Добрич", lat: 43.5726, lng: 27.8273},
    {name: "Пазарджик", lat: 42.1939, lng: 24.3333},
    {name: "Перник", lat: 42.6051, lng: 23.0312},
    {name: "Ямбол", lat: 42.4842, lng: 26.5035},
    {name: "Враца", lat: 43.2045, lng: 23.5517},
    {name: "Кърджали", lat: 41.6420, lng: 25.3688},
    {name: "Габрово", lat: 42.8742, lng: 25.3186},
    {name: "Видин", lat: 43.9902, lng: 22.8778},
    {name: "Смолян", lat: 41.5744, lng: 24.7120},
];

const LIVE_EVENTS = [
    {text: "Александър от София дари дрехи", type: "tree"},
    {text: "Мария от Варна спаси 10 порции храна", type: "flower"},
    {text: "Екип от Бургас чисти плажа", type: "tree"},
    {text: "Иван от Пловдив поправи стар лаптоп", type: "sprout"},
    {text: "Елена от Русе дари време за превод", type: "love"},
    {text: "Петър от Стара Загора дари мебели", type: "tree"},
    {text: "Николай от Плевен спаси книги", type: "tree"},
    {text: "Георги от Велико Търново дари техника", type: "tree"},
    {text: "Десислава от Благоевград спаси храна", type: "flower"},
    {text: "Стефан от Смолян дари дърва", type: "tree"},
    {text: "Лилия от Габрово дари дрехи", type: "tree"},
];

const makeFloraIcon = (type: FloraType, scale: number) => {
    let icon = "🌲";
    if (type === "sprout") icon = "🌱";
    if (type === "flower") icon = "🌸";
    if (type === "love") icon = "❤️";

    const size = 28 * scale;
    
    return L.divIcon({
        className: "flora-marker-icon",
        html: `<div style="font-size: ${size}px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); cursor: default; transition: all 0.5s ease-out;">${icon}</div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size],
    });
};

export default function InteractiveForest() {
    const [flora, setFlora] = useState<FloraProps[]>([]);
    const [totalImpact, setTotalImpact] = useState(3421);
    const [actionText, setActionText] = useState("Добре дошли в Дигиталната Гора на България!");

    const createFloraElement = useCallback((id: string): FloraProps => {
        // Избираме случаен град за база
        const city = BG_CITIES[Math.floor(Math.random() * BG_CITIES.length)];
        
        // Малък jitter (около 15-20км), за да стоят строго в България
        const lat = city.lat + (Math.random() - 0.5) * 0.15;
        const lng = city.lng + (Math.random() - 0.5) * 0.25;
        
        const scale = 0.8 + Math.random() * 0.7;
        const types: FloraType[] = ["tree", "tree", "sprout", "tree", "flower"];

        return {
            id,
            type: types[Math.floor(Math.random() * types.length)],
            lat,
            lng,
            scale,
        };
    }, []);

    // Генератор на начална гора
    useEffect(() => {
        const initialFlora: FloraProps[] = Array.from({length: 45}).map((_, i) => createFloraElement(`init-${i}`));
        setFlora(initialFlora);
    }, [createFloraElement]);

    // Симулация на "Жива общност"
    useEffect(() => {
        const interval = setInterval(() => {
            setFlora((prev) => {
                const newFlora = createFloraElement(`live-${Date.now()}`);
                const randomEvent = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];
                newFlora.type = randomEvent.type as FloraType;

                setActionText(`${randomEvent.text}!`);
                setTotalImpact((t) => t + 1);

                return [...prev, newFlora].slice(-200); 
            });
        }, 6000);
        return () => clearInterval(interval);
    }, [createFloraElement]);

    const handleSimulateDonation = () => {
        setFlora((prev) => {
            const newFlora = createFloraElement(`manual-${Date.now()}`);
            newFlora.type = "love";
            return [...prev, newFlora];
        });
        setTotalImpact((prev) => prev + 1);
        setActionText("Ти добави частица добро към гората!");
        toast.success("Успешно действие", {
            description: "Твоят символ е поставен на картата. Благодаря!",
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container py-8 flex flex-col gap-6">
                {/* Header Stats */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-card p-8 rounded-[2rem] border-2 border-border shadow-soft">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            <Trees className="w-4 h-4" /> Еко система
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Живата карта на България</h1>
                        <p className="text-muted-foreground text-lg">Виж как всяко добро дело променя картата на страната ни в реално време.</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-center px-6 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-tighter mb-1">Засадени добрини</p>
                            <p className="text-4xl font-black text-emerald-600">{totalImpact.toLocaleString()}</p>
                        </div>
                        <Button onClick={handleSimulateDonation} size="lg" className="bg-gradient-primary hover:opacity-90 h-16 rounded-full px-8 shadow-glow text-lg font-bold">
                            <Gift className="w-5 h-5 mr-2" /> Добави добрина
                        </Button>
                    </div>
                </div>

                {/* The Map Canvas */}
                <Card className="relative overflow-hidden bg-muted/20 border-2 border-border shadow-soft rounded-[3rem] h-[650px]">
                    <MapContainer 
                        center={[42.7, 25.5]} 
                        zoom={7} 
                        scrollWheelZoom={true} 
                        style={{ height: "650px", width: "100%", background: "#f8fafc", zIndex: 1 }}
                        zoomControl={false}
                    >
                        <TileLayer 
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                        />
                        
                        {flora.map((item) => (
                            <Marker 
                                key={item.id} 
                                position={[item.lat, item.lng]} 
                                icon={makeFloraIcon(item.type, item.scale)}
                            />
                        ))}
                    </MapContainer>

                    {/* Live Action Ticker Overlay */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
                        <AnimatePresence mode="wait">
                            <motion.div key={actionText} initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}} className="bg-white/95 dark:bg-black/80 backdrop-blur-xl px-8 py-4 rounded-full shadow-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4 text-emerald-900 dark:text-emerald-100 font-bold text-center justify-center">
                                <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                                {actionText}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-8 left-8 z-[1000] space-y-2 bg-white/90 dark:bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/50 dark:border-emerald-900/20 shadow-xl">
                        <div className="flex items-center gap-3 text-xs font-bold text-emerald-900 dark:text-emerald-100">
                            <span className="text-xl">🌲</span> Дарена вещ
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-emerald-900 dark:text-emerald-100">
                            <span className="text-xl">🌸</span> Спасена храна
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-emerald-900 dark:text-emerald-100">
                            <span className="text-xl">❤️</span> Добро дело
                        </div>
                    </div>

                    <div className="absolute bottom-8 right-8 z-[1000] text-right hidden sm:block pointer-events-none">
                        <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-xl border shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/60 dark:text-emerald-500/60 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Световно време: {new Date().toLocaleTimeString('bg-BG')}
                            </p>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
}
