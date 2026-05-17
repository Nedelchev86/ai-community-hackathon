import {ArrowLeft} from "lucide-react";
import {Link} from "react-router-dom";
import CommunityEvents from "@/components/CommunityEvents";

const Events = () => {
    return (
        <div className="min-h-screen bg-background">


            <main className="py-8">
                <CommunityEvents />
            </main>
        </div>
    );
};

export default Events;
