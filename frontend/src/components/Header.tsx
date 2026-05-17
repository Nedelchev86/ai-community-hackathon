import {Heart, PackagePlus, Menu, LogOut, Settings, User, Star, UserPlus, LogIn, HandHeart, HeartHandshake, MapPin} from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {motion} from "framer-motion";
import {useAuth} from "@/contexts/AuthContext";
import { useState } from "react";

export function Header() {
    const {user, isAuthenticated, logout} = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { href: "/#how", label: "Как работи", isAnchor: true },
        { href: "/map", label: "Карта", icon: MapPin },
        { href: "/events", label: "Събития" },
        { href: "/wall", label: "Стена" },
        { href: "/forest", label: "🌲 Гората", className: "text-emerald-600" },
        { href: "/partners", label: "Партньори" },
        { href: "/heroes", label: "Герои", icon: Star, className: "text-primary font-bold" },
    ];

    const NavItems = ({ mobile = false, onClick = () => {} }: { mobile?: boolean, onClick?: () => void }) => (
        <>
            {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return link.isAnchor ? (
                    <a
                        key={link.label}
                        href={link.href}
                        onClick={onClick}
                        className={`px-4 py-2 text-sm transition-all rounded-full hover:bg-accent/50 ${
                            isActive ? "bg-accent/80 font-bold text-foreground" : "font-medium"
                        } ${mobile ? "w-full text-left" : (!isActive ? "text-muted-foreground hover:text-foreground" : "")} ${link.className || ""}`}
                    >
                        {link.label}
                    </a>
                ) : (
                    <Link
                        key={link.label}
                        to={link.href}
                        onClick={onClick}
                        className={`px-4 py-2 text-sm transition-all rounded-full hover:bg-accent/50 flex items-center gap-2 ${
                            isActive ? "bg-accent/80 font-bold text-foreground" : "font-medium"
                        } ${mobile ? "w-full text-left" : (!isActive ? "text-muted-foreground hover:text-foreground" : "")} ${link.className || ""}`}
                    >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                    </Link>
                );
            })}
        </>
    );

    return (
        <motion.header initial={{y: -100, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{type: "spring", stiffness: 300, damping: 30}} className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl bg-background/80 border-b border-border shadow-sm">
            <div className="container flex items-center justify-between py-3">
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-primary grid place-items-center shadow-soft group-hover:scale-105 transition-transform duration-300">
                        <HeartHandshake className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-extrabold text-lg sm:text-xl tracking-tight truncate max-w-[150px] sm:max-w-none">Пулсът на Доброто</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden xl:flex items-center gap-1 bg-muted/50 px-4 py-1.5 rounded-full border border-border/50">
                    <NavItems />
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    {isAuthenticated ? (
                        <>
                            <div className="hidden lg:flex items-center gap-2">
                                <Link to="/donate">
                                    <Button variant="default" size="sm" className="bg-gradient-primary hover:opacity-90 shadow-soft rounded-full px-5">
                                        <PackagePlus className="w-4 h-4 mr-2" /> Дари
                                    </Button>
                                </Link>
                                <Link to="/need">
                                    <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-orange-600 shadow-soft rounded-full px-5">
                                        <HandHeart className="w-4 h-4 mr-2" /> Поискай
                                    </Button>
                                </Link>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="outline-none focus:ring-2 focus:ring-primary rounded-full ring-offset-2 ring-offset-background transition-all">
                                        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
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
                        <div className="hidden sm:flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="rounded-full px-4 hover:bg-accent/50">
                                    <LogIn className="w-4 h-4 mr-2" /> Вход
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="default" size="sm" className="bg-gradient-primary hover:opacity-90 shadow-soft rounded-full px-5">
                                    <UserPlus className="w-4 h-4 mr-2" /> Регистрация
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="xl:hidden rounded-full hover:bg-accent/50">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col gap-6 p-6">
                            <SheetHeader className="text-left">
                                <SheetTitle className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center">
                                        <HeartHandshake className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <span>Меню</span>
                                </SheetTitle>
                            </SheetHeader>
                            
                            <div className="flex flex-col gap-1 mt-2">
                                <NavItems mobile onClick={() => setIsOpen(false)} />
                            </div>

                            <div className="mt-auto space-y-4 pt-6 border-t">
                                {isAuthenticated ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        <Link to="/donate" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full bg-gradient-primary rounded-xl h-11">
                                                <PackagePlus className="w-4 h-4 mr-2" /> Дари вещ
                                            </Button>
                                        </Link>
                                        <Link to="/need" onClick={() => setIsOpen(false)}>
                                            <Button variant="outline" className="w-full border-orange-200 text-orange-600 rounded-xl h-11">
                                                <HandHeart className="w-4 h-4 mr-2" /> Поискай помощ
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="outline" className="w-full rounded-xl h-11">
                                                <LogIn className="w-4 h-4 mr-2" /> Вход
                                            </Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full bg-gradient-primary rounded-xl h-11">
                                                <UserPlus className="w-4 h-4 mr-2" /> Регистрация
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
}
