import {ArrowLeft} from "lucide-react";
import {Link} from "react-router-dom";
import CommunityEvents from "@/components/CommunityEvents";

const Events = () => {
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border">
                <div className="container flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
                        <ArrowLeft className="w-4 h-4" /> Назад към началото
                    </Link>
                    <span className="font-extrabold text-xl tracking-tight hidden sm:block">Пулсът на Доброто Събития</span>
                    <div className="w-[100px]"></div> {/* Spacer for balance */}
                </div>
            </header>

            <main className="py-8">
                <CommunityEvents />
            </main>
        </div>
    );
};

export default Events;
