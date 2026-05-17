import {MapPin, Utensils, ShoppingBag, Coffee, Star, ArrowRight, Leaf, Heart} from "lucide-react";
import {Link} from "react-router-dom";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

const PARTNERS = [
    {
        id: 1,
        name: "Пекарна 'Занаят'",
        category: "Пекарна",
        icon: Coffee,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
        description: "Всяка вечер след 19:30 ч. предоставяме всички останали пресни печива на социалния патронаж.",
        badges: ["Zero Waste", "Локален Герой"],
        location: "ул. Александровска",
        contribution: "Над 500 кг спасена храна",
    },
    {
        id: 2,
        name: "Бистро 'Вкусът'",
        category: "Ресторант",
        icon: Utensils,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
        description: "Меню 'Подари обяд': можете да платите висящ обяд, който ще бъде даден на човек в нужда.",
        badges: ["Социална грижа"],
        location: "ж.к. Лазур",
        contribution: "200+ раздадени обяда",
    },
    {
        id: 3,
        name: "Еко-маркет 'Чисто'",
        category: "Магазин",
        icon: ShoppingBag,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
        description: "Дарява продукти пред изтичане на срок на годност (напълно безопасни) на фондация 'Светлина'.",
        badges: ["Еко", "Zero Waste"],
        location: "бул. Демокрация",
        contribution: "Нулев хранителен отпадък",
    },
    {
        id: 4,
        name: "Сладкарница 'Мечта'",
        category: "Сладкарница",
        icon: Coffee,
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop",
        description: "Всеки уикенд провежда детски работилници за сираци и отделя част от приходите за каузи.",
        badges: ["Деца", "Образование"],
        location: "Морска градина",
        contribution: "10+ подкрепени деца",
    },
];

export default function Partners() {
    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>



            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="container max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200">
                        <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        <span className="text-sm font-bold text-emerald-800">Локални партньори</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
                        Бизнеси, които имат <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">сърце</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">Подкрепете каузите ни, като изберете местата, които правят добро заедно с нас! От спасяване на храна до висящи обяди – те са истински герои в нашия град.</p>
                </div>
            </section>

            {/* Partners Grid */}
            <section className="container max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {PARTNERS.map((partner) => {
                        const Icon = partner.icon;
                        return (
                            <Card key={partner.id} className="overflow-hidden border-2 rounded-3xl hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group bg-white">
                                <div className="relative h-56 overflow-hidden">
                                    <img src={partner.image} alt={partner.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {partner.badges.map((b) => (
                                            <Badge key={b} className="bg-white/90 text-slate-800 hover:bg-white border-0 shadow-sm backdrop-blur-sm">
                                                {b}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center gap-2 text-emerald-300 mb-1">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-xs font-semibold tracking-wider uppercase">{partner.category}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">{partner.name}</h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <p className="text-slate-600 leading-relaxed min-h-[3rem]">{partner.description}</p>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                {partner.location}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                                                <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                                                {partner.contribution}
                                            </div>
                                        </div>

                                        <Button variant="outline" className="rounded-xl border-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                                            Виж на картата
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Call to action for businesses */}
                <div className="mt-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold">Имаш бизнес? Стани герой!</h2>
                        <p className="text-emerald-100 text-lg">Присъедини се към общността. Дарявай излишна храна, организирай каузи или стани спонсор.</p>
                        <Button size="lg" className="bg-white text-emerald-700 hover:bg-slate-100 rounded-xl font-bold px-8 h-14 mt-4">
                            Свържи се с нас <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
