import {useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Calendar} from "@/components/ui/calendar";
import {Clock, MapPin, Users, CheckCircle2, ChevronRight, Leaf, Heart, Calendar as CalendarIcon} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {toast} from "sonner";

const EVENTS = [
    {
        id: 1,
        title: "Пролетно почистване на парка",
        date: new Date(new Date().setHours(10, 0, 0, 0)),
        location: "Морска градина",
        participants: 24,
        maxParticipants: 50,
        organizer: "Дари вещ Бургас",
        type: "ecology",
        description: "Нека заедно изчистим алеите и плажа от пластмаса. Ние осигуряваме чували и ръкавици, вие донесете добро настроение!",
    },
    {
        id: 2,
        title: "Топъл обяд за бездомни",
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        location: "Централна ЖП Гара",
        participants: 12,
        maxParticipants: 15,
        organizer: "Каритас",
        type: "social",
        description: "Събираме се да раздадем топла супа и хляб. Търсим доброволци за раздаването и транспорт.",
    },
    {
        id: 3,
        title: "Урок по рисуване за деца",
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
        location: "Младежки Културен Център",
        participants: 5,
        maxParticipants: 10,
        organizer: "Арт Клуб 'Палитра'",
        type: "education",
        description: "Банка за време: търсим доброволци да помагат на 10 деца в неравностойно положение да нарисуват първата си картина.",
    },
];

const TYPE_STYLES = {
    ecology: {color: "text-emerald-600", bg: "bg-emerald-100", icon: <Leaf className="w-4 h-4" />},
    social: {color: "text-rose-600", bg: "bg-rose-100", icon: <Heart className="w-4 h-4" />},
    education: {color: "text-blue-600", bg: "bg-blue-100", icon: <Users className="w-4 h-4" />},
};

export default function CommunityEvents() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [joined, setJoined] = useState<number[]>([]);

    const handleJoin = (id: number) => {
        if (joined.includes(id)) return;
        setJoined([...joined, id]);
        toast.success("Успешно записване!", {
            description: "Очакваме те. Ще получиш напомняне 1 ден преди събитието.",
            icon: <CheckCircle2 className="text-emerald-500" />,
        });
    };

    // Filter events simply by month for the demo, or exact date if you want strict filtering
    const visibleEvents = EVENTS.sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <section id="events" className="container py-20 lg:py-28">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-4">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Календар на доброто</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">Събития и Акции</h2>
                <p className="text-muted-foreground text-lg">Включи се в общи инициативи, дари от своето време и стани част от промяната в твоя град.</p>
            </div>

            <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
                {/* Calendar Sidebar */}
                <Card className="p-4 border-2 shadow-soft w-full max-w-sm mx-auto lg:mx-0 sticky top-24">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                        // Highlighting dates that have events
                        modifiers={{
                            hasEvent: EVENTS.map((e) => e.date),
                        }}
                        modifiersStyles={{
                            hasEvent: {fontWeight: "bold", textDecoration: "underline", color: "hsl(var(--primary))"},
                        }}
                    />
                    <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" /> Твоите активности
                        </h4>
                        {joined.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Все още не си се записал за предстоящи събития.</p>
                        ) : (
                            <ul className="space-y-3">
                                {EVENTS.filter((e) => joined.includes(e.id)).map((e) => (
                                    <li key={e.id} className="text-sm flex items-center justify-between p-2 bg-muted rounded-md border border-border">
                                        <span className="font-medium truncate pr-2">{e.title}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{e.date.toLocaleDateString("bg-BG", {day: "2-digit", month: "short"})}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>

                {/* Events Feed */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {visibleEvents.map((event, idx) => {
                            const isJoined = joined.includes(event.id);
                            const style = TYPE_STYLES[event.type as keyof typeof TYPE_STYLES];

                            return (
                                <motion.div key={event.id} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: idx * 0.1}}>
                                    <Card className="p-6 border-2 hover:border-primary/50 transition-colors shadow-none hover:shadow-soft">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="secondary" className={`${style.bg} ${style.color} border-none flex items-center gap-1`}>
                                                        {style.icon} {event.type === "ecology" ? "Екология" : event.type === "social" ? "Социални" : "Образование"}
                                                    </Badge>
                                                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {event.date.toLocaleDateString("bg-BG", {weekday: "long", month: "long", day: "numeric"})}, {event.date.toLocaleTimeString("bg-BG", {hour: "2-digit", minute: "2-digit"})}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                                                    <p className="text-muted-foreground">{event.description}</p>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                                    <div className="flex items-center gap-1 text-foreground">
                                                        <MapPin className="w-4 h-4 text-primary" /> {event.location}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-foreground">
                                                        <Users className="w-4 h-4 text-primary" /> {event.participants} / {event.maxParticipants} записани
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:w-48 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                                                <div className="text-sm mb-4 text-center md:text-left">
                                                    <span className="text-muted-foreground">Организатор:</span>
                                                    <br />
                                                    <span className="font-bold">{event.organizer}</span>
                                                </div>
                                                <Button onClick={() => handleJoin(event.id)} variant={isJoined ? "secondary" : "default"} disabled={isJoined || event.participants >= event.maxParticipants} className={`w-full ${!isJoined && "bg-gradient-primary"}`}>
                                                    {isJoined ? "Записан си!" : "Ще участвам"}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
