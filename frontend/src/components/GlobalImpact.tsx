import {Card} from "@/components/ui/card";
import {Droplet, Cloud, HeartHandshake, Zap, Globe2} from "lucide-react";
import {motion} from "framer-motion";

export default function GlobalImpact() {
    return (
        <section id="impact" className="py-20 lg:py-28 relative overflow-hidden bg-muted/30">
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>

            <div className="container relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft mb-4">
                        <Globe2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium">Общо въздействие</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">Какво постигнахме заедно</h2>
                    <p className="text-muted-foreground text-lg">Всяко малко действие има значение. Вижте реалния ефект върху града ни и природата, постигнат благодарение на общността в Пулсът на Доброто.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5, delay: 0}}>
                        <Card className="p-6 text-center shadow-soft border-2 hover:border-emerald-500/50 transition-colors h-full flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                <Cloud className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div className="text-4xl font-black text-emerald-600 mb-2">1.2 т</div>
                            <p className="text-muted-foreground font-medium">Спестени CO2 емисии</p>
                        </Card>
                    </motion.div>

                    <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5, delay: 0.1}}>
                        <Card className="p-6 text-center shadow-soft border-2 hover:border-blue-500/50 transition-colors h-full flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                <Droplet className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-4xl font-black text-blue-600 mb-2">45 000 л</div>
                            <p className="text-muted-foreground font-medium">Спасена питейна вода</p>
                        </Card>
                    </motion.div>

                    <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5, delay: 0.2}}>
                        <Card className="p-6 text-center shadow-soft border-2 hover:border-orange-500/50 transition-colors h-full flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                                <HeartHandshake className="w-8 h-8 text-orange-600" />
                            </div>
                            <div className="text-4xl font-black text-orange-600 mb-2">342</div>
                            <p className="text-muted-foreground font-medium">Разменени вещи</p>
                        </Card>
                    </motion.div>

                    <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5, delay: 0.3}}>
                        <Card className="p-6 text-center shadow-soft border-2 hover:border-indigo-500/50 transition-colors h-full flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                                <Zap className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div className="text-4xl font-black text-indigo-600 mb-2">1280 ч.</div>
                            <p className="text-muted-foreground font-medium">Дарен доброволен труд</p>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
