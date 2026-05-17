import {useState, useEffect} from "react";
import {Heart, MessageCircle, Plus, Send, MoreVertical, Trash2} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {motion, AnimatePresence} from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getStories, createStory, addStoryComment, toggleStorySupport, API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function WallOfHope() {
    const { user } = useAuth();
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newStory, setNewStory] = useState({ title: "", content: "", imageUrl: "", tags: "" });

    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
    const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const data = await getStories();
            setStories(data);
        } catch (error) {
            toast.error("Грешка при зареждане на историите.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Влезте в профила си, за да публикувате история.");
            return;
        }
        try {
            const token = localStorage.getItem("access_token");
            await createStory(newStory, token!);
            toast.success("Историята е публикувана успешно!");
            setIsCreateOpen(false);
            setNewStory({ title: "", content: "", imageUrl: "", tags: "" });
            fetchStories();
        } catch (error) {
            toast.error("Грешка при публикуване на историята.");
        }
    };

    const handleDeleteStory = async (storyId: number) => {
        if (!window.confirm("Сигурни ли сте, че искате да изтриете тази история?")) return;
        try {
            const token = localStorage.getItem("access_token");
            await fetch(`${API_BASE}/stories/${storyId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Историята е изтрита.");
            fetchStories();
        } catch (error) {
            toast.error("Грешка при изтриване.");
        }
    };

    const handleToggleSupport = async (storyId: number) => {
        if (!user) {
            toast.error("Влезте в профила си, за да подкрепите.");
            return;
        }
        try {
            const token = localStorage.getItem("access_token");
            await toggleStorySupport(storyId, token!);
            fetchStories();
        } catch (error) {
            toast.error("Грешка при подкрепа.");
        }
    };

    const submitComment = async (storyId: number) => {
        if (!user) {
            toast.error("Влезте в профила си, за да коментирате.");
            return;
        }
        const content = commentInputs[storyId]?.trim();
        if (!content) return;

        try {
            const token = localStorage.getItem("access_token");
            await addStoryComment(storyId, content, token!);
            setCommentInputs(prev => ({...prev, [storyId]: ""}));
            fetchStories();
        } catch (error) {
            toast.error("Грешка при добавяне на коментар.");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <section className="py-12 bg-muted/30">
                <div className="container text-center max-w-3xl">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">Вдъхновяващи истории</h1>
                    <p className="text-muted-foreground text-lg mb-8">Вижте реалния ефект от вашите действия. Всяка малка добрина създава вълна от промяна. Споделете вашата история!</p>
                    
                    {user ? (
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="bg-gradient-primary">
                                    <Plus className="w-4 h-4 mr-2" /> Разкажи история
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Сподели твоята история</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateStory} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Заглавие</Label>
                                        <Input required value={newStory.title} onChange={e => setNewStory({...newStory, title: e.target.value})} placeholder="Кратко и вдъхновяващо..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>История</Label>
                                        <Textarea required value={newStory.content} onChange={e => setNewStory({...newStory, content: e.target.value})} placeholder="Разкажи какво се случи..." className="min-h-[120px]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Снимка (URL - по желание)</Label>
                                        <Input type="url" value={newStory.imageUrl} onChange={e => setNewStory({...newStory, imageUrl: e.target.value})} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Тагове (разделени със запетая)</Label>
                                        <Input value={newStory.tags} onChange={e => setNewStory({...newStory, tags: e.target.value})} placeholder="Дарение, Доброволчество, Помощ..." />
                                    </div>
                                    <Button type="submit" className="w-full">Публикувай</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <p className="text-sm text-muted-foreground italic mt-4">Трябва да влезете в профила си, за да публикувате.</p>
                    )}
                </div>
            </section>

            <section className="container py-12 max-w-4xl">
                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Зареждане на истории...</div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">Няма публикувани истории все още. Бъдете първи!</div>
                ) : (
                    <div className="space-y-8">
                        <AnimatePresence>
                            {stories.map((story, idx) => {
                                const hasSupported = user && story.supports?.some((s: any) => String(s.userId) === String(user.id));
                                const isAuthor = String(story.authorId) === String(user?.id);
                                const tags = story.tags ? story.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
                                const isCommentsExpanded = expandedComments[story.id];

                                return (
                                    <motion.div key={story.id} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: idx * 0.1}}>
                                        <Card className="overflow-hidden border-2 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-10 h-10 border border-border">
                                                            <AvatarImage src={story.author?.avatarUrl} />
                                                            <AvatarFallback>{story.author?.name?.charAt(0) || "U"}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-sm">{story.author?.name || "Анонимен"}</p>
                                                            <p className="text-xs text-muted-foreground">{new Date(story.createdAt).toLocaleDateString("bg-BG", {month: "long", day: "numeric", year: "numeric"})}</p>
                                                        </div>
                                                    </div>
                                                    {isAuthor && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleDeleteStory(story.id)} className="text-destructive focus:bg-destructive/10">
                                                                    <Trash2 className="w-4 h-4 mr-2" /> Изтрий
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>

                                                <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                                                <p className="text-foreground leading-relaxed mb-4 whitespace-pre-wrap">{story.content}</p>

                                                {story.imageUrl && (
                                                    <div className="w-full rounded-xl overflow-hidden mb-4 max-h-[400px]">
                                                        <img src={story.imageUrl} alt="Story" className="w-full h-full object-cover" />
                                                    </div>
                                                )}

                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {tags.map((tag: string, i: number) => (
                                                            <Badge key={i} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">#{tag}</Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="pt-4 border-t flex items-center gap-4">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className={`flex items-center gap-2 ${hasSupported ? 'text-rose-500 hover:text-rose-600 bg-rose-50' : 'text-muted-foreground hover:text-foreground'}`}
                                                        onClick={() => handleToggleSupport(story.id)}
                                                    >
                                                        <Heart className={`w-4 h-4 ${hasSupported ? 'fill-current' : ''}`} />
                                                        {story.supports?.length || 0} Подкрепи
                                                    </Button>

                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                                        onClick={() => setExpandedComments(prev => ({...prev, [story.id]: !prev[story.id]}))}
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        {story.comments?.length || 0} Коментара
                                                    </Button>
                                                </div>

                                                {isCommentsExpanded && (
                                                    <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: "auto"}} className="mt-4 bg-muted/30 p-4 rounded-xl space-y-4">
                                                        {user ? (
                                                            <div className="flex gap-2">
                                                                <Avatar className="w-8 h-8">
                                                                    <AvatarImage src={user.avatarUrl} />
                                                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 flex gap-2">
                                                                    <Input 
                                                                        placeholder="Напиши коментар..." 
                                                                        className="h-8 text-sm"
                                                                        value={commentInputs[story.id] || ""}
                                                                        onChange={(e) => setCommentInputs(prev => ({...prev, [story.id]: e.target.value}))}
                                                                        onKeyDown={(e) => e.key === 'Enter' && submitComment(story.id)}
                                                                    />
                                                                    <Button size="sm" className="h-8 px-3" onClick={() => submitComment(story.id)}>
                                                                        <Send className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-muted-foreground text-center pb-2">
                                                                Трябва да влезете, за да коментирате.
                                                            </div>
                                                        )}

                                                        <div className="space-y-3 pt-2">
                                                            {story.comments?.length === 0 ? (
                                                                <div className="text-sm text-muted-foreground text-center">Няма коментари.</div>
                                                            ) : (
                                                                story.comments?.map((comment: any) => (
                                                                    <div key={comment.id} className="flex gap-3 text-sm">
                                                                        <Avatar className="w-8 h-8">
                                                                            <AvatarImage src={comment.user?.avatarUrl} />
                                                                            <AvatarFallback>{comment.user?.name?.charAt(0) || "?"}</AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="bg-background border rounded-lg px-3 py-2 flex-1">
                                                                            <div className="flex justify-between items-baseline mb-1">
                                                                                <span className="font-medium">{comment.user?.name || "Анонимен"}</span>
                                                                                <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString("bg-BG")}</span>
                                                                            </div>
                                                                            <p className="text-muted-foreground">{comment.content}</p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </div>
    );
}
