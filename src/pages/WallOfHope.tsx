import {useState} from "react";
import {ArrowLeft, Heart, MessageCircle, Share2, Sparkles} from "lucide-react";
import {Link} from "react-router-dom";
import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {motion} from "framer-motion";

const STORIES = [
    {
        id: 1,
        author: "Елена С.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
        text: "Благодаря на Мария за прекрасните детски книжки! Дъщеря ми цял следобед не спира да ги чете. Страхотно е, че има общност като вас! ❤️",
        category: "Дарение",
        likes: 24,
    },
    {
        id: 2,
        author: "Каритас Бургас",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        image: "https://images.unsplash.com/photo-1593113565214-061c5c4f2ac4?q=80&w=800&auto=format&fit=crop",
        text: "Днес раздадохме над 30 топли супи на възрастни хора в нужда, благодарение на спасената храна от местни ресторанти. Заедно можем повече!",
        category: "Доброволчество",
        likes: 89,
    },
    {
        id: 3,
        author: "Иван П.",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop",
        text: "Успешна акция! Група доброволци успяхме да изчистим парка само за 3 часа. Събрани са 50 чувала с пластмаса.",
        category: "Екология",
        likes: 112,
    },
    {
        id: 4,
        author: "Петя В.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        image: null,
        text: "Искам да изкажа огромна благодарност на Митко, който дойде и поправи пералнята на баба ми напълно безплатно! Истински герой!",
        category: "Време и труд",
        likes: 45,
    },
    {
        id: 5,
        author: "Асен К.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=800&auto=format&fit=crop",
        text: "Старото дървено бюро вече си има нов собственик – студент по архитектура! Радвам се, че отиде при някого, на когото наистина ще върши работа.",
        category: "Дарение",
        likes: 31,
    },
];

export default function WallOfHope() {
    const [likedStories, setLikedStories] = useState<number[]>([]);

    const toggleLike = (id: number) => {
        if (likedStories.includes(id)) {
            setLikedStories(likedStories.filter((storyId) => storyId !== id));
        } else {
            setLikedStories([...likedStories, id]);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border">
                <div className="container flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
                        <ArrowLeft className="w-4 h-4" /> Назад към началото
                    </Link>
                    <span className="font-extrabold text-xl tracking-tight hidden sm:block flex items-center gap-2">
                        Стена на Доброто <Sparkles className="w-5 h-5 text-amber-500 inline-block mb-1" />
                    </span>
                    <div className="w-[100px]"></div> {/* Spacer for balance */}
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-12 bg-muted/30">
                <div className="container text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">Вдъхновяващи истории</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Вижте реалния ефект от вашите действия. Всяка малка добрина създава вълна от промяна. Ето какво постигна общността на Пулсът на Доброто.</p>
                </div>
            </section>

            {/* Masonry Grid Feed */}
            <section className="container py-12">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {STORIES.map((story, idx) => {
                        const isLiked = likedStories.includes(story.id);
                        return (
                            <motion.div key={story.id} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: idx * 0.1}} className="break-inside-avoid">
                                <Card className="overflow-hidden border-2 flex flex-col hover:border-primary/50 transition-colors shadow-soft">
                                    {/* Story Image (Optional) */}
                                    {story.image && (
                                        <div className="w-full h-48 sm:h-64 overflow-hidden">
                                            <img src={story.image} alt="Success story" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}

                                    {/* Story Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 border border-border">
                                                    <AvatarImage src={story.avatar} />
                                                    <AvatarFallback>{story.author.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-sm">{story.author}</p>
                                                    <Badge variant="secondary" className="mt-1 text-xs">
                                                        {story.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground mb-6 flex-1 italic">"{story.text}"</p>

                                        {/* Actions */}
                                        <div className="pt-4 border-t border-border flex items-center justify-between text-muted-foreground">
                                            <button onClick={() => toggleLike(story.id)} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? "text-rose-500" : "hover:text-foreground"}`}>
                                                <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                                                {story.likes + (isLiked ? 1 : 0)}
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <button className="flex items-center gap-1.5 text-sm font-medium hover:text-foreground transition-colors">
                                                    <MessageCircle className="w-4 h-4" /> 0
                                                </button>
                                                <button className="flex items-center gap-1.5 text-sm font-medium hover:text-foreground transition-colors">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
