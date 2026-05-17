import {Heart, PackagePlus, Menu, LogOut, Settings, User, Star, UserPlus, LogIn, HandHeart, HeartHandshake} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {motion} from "framer-motion";
import {useAuth} from "@/contexts/AuthContext";

export function Header() {
    const {user, isAuthenticated, logout} = useAuth();

    return (
        <motion.header initial={{y: -100, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: "spring", stiffness: 300, damping: 30}} className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl bg-background/80 border-b border-border shadow-sm">
            <div className="container flex items-center justify-between py-3">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center shadow-soft group-hover:scale-105 transition-transform duration-300">
                        <HeartHandshake className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight">Пулсът на Доброто</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1 bg-muted/50 px-4 py-1.5 rounded-full border border-border/50">
                    <a href="/#how" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-full transition-all">
                        Как работи
                    </a>
                    <Link to="/map" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-full transition-all">
                        Карта
                    </Link>
                    <Link to="/events" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-full transition-all">
                        Събития
                    </Link>
                    <Link to="/wall" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-full transition-all">
                        Стена
                    </Link>
                    <Link to="/forest" className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all">
                        🌲 Гората
                    </Link>
                    <Link to="/partners" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-full transition-all">
                        Партньори
                    </Link>
                    <a href="/#heroes" className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-full transition-all flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary" /> Герои
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <Link to="/donate">
                                <Button variant="default" className="hidden sm:flex bg-gradient-primary hover:opacity-90 shadow-soft rounded-full px-6">
                                    <PackagePlus className="w-4 h-4 mr-2" /> Дари
                                </Button>
                            </Link>
                            <Link to="/need">
                                <Button variant="outline" className="hidden sm:flex border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-orange-600 shadow-soft rounded-full px-6">
                                    <HandHeart className="w-4 h-4 mr-2" /> Поискай
                                </Button>
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="outline-none focus:ring-2 focus:ring-primary rounded-full ring-offset-2 ring-offset-background transition-all">
                                        <Avatar className="w-10 h-10 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
                                            <AvatarImage src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                                            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl border-border/50">
                                    <DropdownMenuLabel className="p-3">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="p-2 cursor-pointer">
                                        <Link to="/profile" className="flex items-center w-full">
                                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                            Моите обяви
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="p-2 cursor-pointer">
                                        <Link to="/settings" className="flex items-center w-full">
                                            <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                                            Настройки
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="p-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Изход
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" className="rounded-full px-6 hover:bg-accent/50">
                                    <LogIn className="w-4 h-4 mr-2" /> Вход
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="default" className="bg-gradient-primary hover:opacity-90 shadow-soft rounded-full px-6">
                                    <UserPlus className="w-4 h-4 mr-2" /> Регистрация
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </motion.header>
    );
}
