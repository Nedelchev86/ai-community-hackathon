import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {ArrowLeft, Sparkles, Trees, Sprout, Flower2, Heart, Gift, Users, ShieldAlert, Cloud} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {toast} from "sonner";

// Видове растения в гората
type FloraType = "tree" | "sprout" | "flower" | "love";

interface FloraProps {
    id: string;
    type: FloraType;
    x: number; // 0-100%
    y: number; // 0-100%
    scale: number;
    zIndex: number;
}

const LIVE_EVENTS = [
    {text: "Александър дари дрехи", type: "tree"},
    {text: "Мария спаси 10 порции храна", type: "flower"},
    {text: "Екип от 5 човека чисти плажа", type: "tree"},
    {text: "Иван поправи стар телефон", type: "sprout"},
    {text: "Елена дари време за превод", type: "love"},
];

export default function InteractiveForest() {
    const [flora, setFlora] = useState<FloraProps[]>([]);
    const [totalImpact, setTotalImpact] = useState(3421);
    const [actionText, setActionText] = useState("Добре дошли в Гората на Пулсът на Доброто!");

    const createFloraElement = (id: string, currentCount: number): FloraProps => {
        // Как расте гората: започва от центъра и се разширява лека-полека навън
        const maxRadius = Math.min(15 + currentCount * 0.6, 40); // Максималният радиус расте с броя дървета
        const angle = Math.random() * Math.PI * 2;
        // Квадратен корен за по-естествено струпване (повече близо до центъра)
        const radius = maxRadius * Math.sqrt(Math.random());

        let x = 50 + Math.cos(angle) * radius;
        let y = 55 + Math.sin(angle) * (radius * 0.6); // 0.6 смачкваме по Y заради перспективата

        // Ограничаваме до границите
        x = Math.max(5, Math.min(95, x));
        y = Math.max(15, Math.min(90, y));

        const scale = 0.5 + (y / 100) * 1.2;
        const types: FloraType[] = ["tree", "tree", "sprout", "tree", "flower"];

        return {
            id,
            type: types[Math.floor(Math.random() * types.length)],
            x,
            y,
            scale,
            zIndex: Math.floor(y * 100),
        };
    };

    // Генератор на начална гора
    useEffect(() => {
        const initialFlora: FloraProps[] = Array.from({length: 40}).map((_, i) => createFloraElement(`init-${i}`, i));
        initialFlora.sort((a, b) => a.y - b.y);
        setFlora(initialFlora);
    }, []);

    // Симулация на "Жива общност"
    useEffect(() => {
        const interval = setInterval(() => {
            setFlora((prev) => {
                const newFlora = createFloraElement(`live-${Date.now()}`, prev.length);
                const randomEvent = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];
                newFlora.type = randomEvent.type as FloraType;

                setActionText(`${randomEvent.text}!`);
                setTotalImpact((t) => t + 1);

                return [...prev, newFlora].sort((a, b) => a.y - b.y);
            });
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const handleSimulateDonation = () => {
        setFlora((prev) => {
            const newFlora = createFloraElement(`manual-${Date.now()}`, prev.length);
            newFlora.type = "love";
            return [...prev, newFlora].sort((a, b) => a.y - b.y);
        });
        setTotalImpact((prev) => prev + 1);
        setActionText("Ти току-що допринесе за гората!");
        toast.success("Успешно действие", {
            description: "Твоето дръвче е посято на картата. Благодаря!",
        });
    };

    const renderFlora = (item: FloraProps) => {
        switch (item.type) {
            case "tree":
                return <Trees className="text-emerald-700 drop-shadow-md" size={48} />;
            case "sprout":
                return <Sprout className="text-green-500 drop-shadow-md" size={32} />;
            case "flower":
                return <Flower2 className="text-pink-500 drop-shadow-sm" size={28} />;
            case "love":
                return <Heart className="text-rose-500 drop-shadow-md fill-rose-500" size={36} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container py-8 flex flex-col gap-6">
                {/* Header Stats */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 p-6 rounded-2xl border border-border">
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">Живата гора на Пулсът на Доброто</h1>
                        <p className="text-muted-foreground">Всяко посадено тук дръвче е реално добро дело, направено в платформата.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Спасени ресурси</p>
                            <p className="text-4xl font-black text-emerald-600">{totalImpact.toLocaleString()}</p>
                        </div>
                        <Button onClick={handleSimulateDonation} className="bg-emerald-600 hover:bg-emerald-700 h-14 rounded-full px-6 shadow-lg shadow-emerald-500/20">
                            <Gift className="w-5 h-5 mr-2" /> Добави добрина
                        </Button>
                    </div>
                </div>

                {/* The Live Interactive Canvas / Map */}
                <Card className="flex-1 min-h-[60vh] relative overflow-hidden bg-[#f0ebd8] border-4 border-white shadow-xl rounded-3xl isolate">
                    {/* Topographical Map Background */}
                    <svg className="absolute inset-0 w-full h-full text-emerald-900/5 opacity-50" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Abstract map contour lines */}
                        <path d="M-100,200 Q150,100 300,250 T700,100 T1100,300" />
                        <path d="M-100,250 Q150,150 300,300 T700,150 T1100,350" />
                        <path d="M-100,300 Q150,200 300,350 T700,200 T1100,400" />
                        <path d="M-100,350 Q150,250 300,400 T700,250 T1100,450" />

                        {/* River / Water path */}
                        <path d="M200,0 Q150,150 300,300 T400,600" stroke="#7ed3fc" strokeWidth="40" strokeLinecap="round" className="opacity-40" />
                        <path d="M800,0 Q850,200 700,350 T650,600" stroke="#7ed3fc" strokeWidth="20" strokeLinecap="round" className="opacity-30" />
                    </svg>

                    {/* Compass / Map Decoration */}
                    <div className="absolute top-6 left-6 opacity-60 pointer-events-none z-0">
                        <div className="w-16 h-16 border-4 border-emerald-900/20 rounded-full flex items-center justify-center relative">
                            <div className="absolute w-1 h-8 bg-emerald-900/30 -top-2"></div>
                            <div className="absolute w-8 h-1 bg-emerald-900/30 -right-2"></div>
                            <div className="text-emerald-900/40 font-bold text-xs absolute -top-6">С</div>
                        </div>
                    </div>

                    {/* Live Action Ticker Overlay */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100]">
                        <AnimatePresence mode="wait">
                            <motion.div key={actionText} initial={{opacity: 0, y: -20, scale: 0.9}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: 10, scale: 0.9}} className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-emerald-100 flex items-center gap-3 text-emerald-800 font-semibold">
                                <Sparkles className="w-4 h-4 text-emerald-500" />
                                {actionText}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* The Digital Forest Grid */}
                    <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                        <AnimatePresence>
                            {flora.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{scale: 0, opacity: 0, y: 50}}
                                    animate={{scale: item.scale, opacity: 1, y: 0}}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        duration: 1,
                                    }}
                                    className="absolute origin-bottom transform-gpu"
                                    style={{
                                        left: `${item.x}%`,
                                        top: `${item.y}%`,
                                        zIndex: item.zIndex,
                                        // Slightly offset center point so the footprint is accurate
                                        transform: `translate(-50%, -100%) scale(${item.scale})`,
                                    }}
                                >
                                    {renderFlora(item)}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Card>
            </main>
        </div>
    );
}
