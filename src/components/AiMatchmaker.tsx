import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Bot, Sparkles, Clock, MapPin, Search, CheckCircle2, User, ArrowRight, Heart, Send, X, MessageSquareHeart} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

type Message = {
    id: string;
    role: "bot" | "user";
    text: string;
    options?: string[];
    isResult?: boolean;
};

export default function AiMatchmaker() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            text: "Здравей! Аз съм твоят AI асистент за добри дела. ✨ Имаш ли желание да помогнеш днес? С колко време разполагаш?",
            options: ["Около 1 час", "2-3 часа", "Цял ден"],
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleOptionSelect = (option: string, msgId: string) => {
        // Премахваме опциите от предишното съобщение, за да не се цъкат пак
        setMessages((prev) => prev.map((m) => (m.id === msgId ? {...m, options: undefined} : m)));

        // Добавяме отговора на потребителя
        const userMsg: Message = {id: Date.now().toString(), role: "user", text: option};
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        // Симулираме мислене на бота според броя съобщения
        setTimeout(() => {
            setIsTyping(false);
            if (messages.length === 1) {
                // Стъпка 2: Транспорт
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        role: "bot",
                        text: "Чудесно! Как планираш да се придвижваш из града?",
                        options: ["Пеша", "С кола", "С колело"],
                    },
                ]);
            } else if (messages.length === 3) {
                // Стъпка 3: Категория
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        role: "bot",
                        text: "И последно – какъв тип каузи предпочиташ да подкрепиш днес?",
                        options: ["Екология", "Помощ за хора", "Спасяване на храна"],
                    },
                ]);
            } else if (messages.length === 5) {
                // Стъпка 4: Краен резултат (след малко по-дълго мислене)
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: "result-intro",
                            role: "bot",
                            text: "Анализирах трафика, локациите и активните кампании... Намерих нещо перфектно за теб!",
                        },
                        {
                            id: "result-card",
                            role: "bot",
                            text: "",
                            isResult: true,
                        },
                    ]);
                }, 1500);
            }
        }, 1000);
    };

    const resetChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                role: "bot",
                text: "Здравей! Аз съм твоят AI асистент за добри дела. ✨ Имаш ли желание да помогнеш днес? С колко време разполагаш?",
                options: ["Около 1 час", "2-3 часа", "Цял ден"],
            },
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{opacity: 0, scale: 0.9, y: 20}} animate={{opacity: 1, scale: 1, y: 0}} exit={{opacity: 0, scale: 0.9, y: 20}} className="mb-4 w-[calc(100vw-3rem)] sm:w-[450px] shadow-2xl pointer-events-auto origin-bottom-right">
                        <Card className="w-full overflow-hidden border-2 border-indigo-100/50 shadow-2xl isolate relative bg-[#f8f9fc] flex flex-col h-[550px] rounded-3xl">
                            {/* Header */}
                            <div className="bg-white p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between z-10 shrink-0 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-full relative">
                                        <Bot className="w-5 h-5 text-indigo-600" />
                                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 leading-tight">AI Сватовник</h2>
                                        <p className="text-xs font-medium text-emerald-600">Онлайн • Готов да помогне</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 z-50">
                                    <div className="flex items-center gap-1 justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                resetChat();
                                            }}
                                            className="text-slate-400 hover:text-indigo-600 rounded-full w-8 h-8 pointer-events-auto"
                                            title="Рестарт"
                                        >
                                            <Search className="w-4 h-4 pointer-events-none" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpen(false);
                                            }}
                                            className="text-slate-400 hover:text-rose-500 rounded-full w-8 h-8 pointer-events-auto cursor-pointer relative z-50"
                                            title="Затвори"
                                        >
                                            <X className="w-5 h-5 pointer-events-none relative z-50" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth z-10">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div key={msg.id} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            {msg.role === "bot" && !msg.isResult && (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 mt-1 shrink-0">
                                                    <Bot className="w-4 h-4 text-indigo-600" />
                                                </div>
                                            )}

                                            <div className="flex flex-col max-w-[85%]">
                                                {!msg.isResult ? (
                                                    <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"}`}>{msg.text}</div>
                                                ) : (
                                                    /* Резултатът (Мисията) като съобщение */
                                                    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden mt-2 ml-11">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10"></div>
                                                        <div className="flex flex-col space-y-4">
                                                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 self-start">
                                                                <Sparkles className="w-3 h-3" /> 98% AI Match
                                                            </div>
                                                            <h3 className="text-xl font-bold text-slate-800 leading-tight">Спаси храна и я занеси до Център "Надежда"</h3>
                                                            <p className="text-slate-600 text-sm">Взехме предвид отговорите ти! На 5 минути от теб има сладкарница с 20 останали порции от днес. Като ги закараш до социалния център ще спасиш храна и ще донесеш радост.</p>
                                                            <div className="flex flex-wrap gap-2 py-1">
                                                                <div className="flex items-center bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-xs font-medium border border-slate-100">
                                                                    <Clock className="w-3 h-3 mr-1 text-indigo-500" /> ~45 мин
                                                                </div>
                                                                <div className="flex items-center bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-xs font-medium border border-slate-100">
                                                                    <MapPin className="w-3 h-3 mr-1 text-emerald-500" /> Бургас, Център
                                                                </div>
                                                                <div className="flex items-center bg-rose-50 text-rose-600 px-2 py-1 rounded-md text-xs font-bold border border-rose-100">
                                                                    <Heart className="w-3 h-3 mr-1 fill-rose-600" /> +3 Дървета
                                                                </div>
                                                            </div>
                                                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-10 shadow-md shadow-emerald-600/20 text-sm">Приемам мисията</Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Бутони за отговор */}
                                                {msg.options && (
                                                    <div className="flex flex-wrap gap-2 mt-3 ml-11">
                                                        {msg.options.map((opt) => (
                                                            <button key={opt} onClick={() => handleOptionSelect(opt, msg.id)} className="bg-white hover:bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm transition-colors active:scale-95">
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Индикатор за писане (Typing indicator) */}
                                    {isTyping && (
                                        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="flex justify-start">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 mt-1 shrink-0">
                                                <Bot className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[52px]">
                                                <motion.div animate={{y: [0, -5, 0]}} transition={{repeat: Infinity, duration: 0.6, ease: "easeInOut"}} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                                <motion.div animate={{y: [0, -5, 0]}} transition={{repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2}} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                                <motion.div animate={{y: [0, -5, 0]}} transition={{repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4}} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </AnimatePresence>
                            </div>

                            {/* Background Decorations */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-0 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-0 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button initial={{opacity: 0, scale: 0}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={() => setIsOpen(true)} className="pointer-events-auto shadow-2xl relative flex items-center justify-center p-4 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white overflow-hidden group">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <MessageSquareHeart className="w-8 h-8 relative z-10" />

                        {/* Notification Dot */}
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full z-20"></span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
