import { Heart, PackagePlus, Search, MapPin, MessageCircle, Leaf, Users, Recycle, Sparkles, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImg from "@/assets/hero-donate.jpg";
import DonationMap from "@/components/DonationMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-primary grid place-items-center shadow-soft">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-lg">Дари, не изхвърляй</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-smooth">Как работи</a>
            <a href="#map" className="hover:text-foreground transition-smooth">Карта</a>
            <a href="#impact" className="hover:text-foreground transition-smooth">Ефект</a>
            <a href="#community" className="hover:text-foreground transition-smooth">Общност</a>
          </nav>
          <Button variant="default" className="bg-gradient-primary hover:opacity-90 shadow-soft">
            Започни
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Социална мрежа за полезност</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Дари вещ.<br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Подари живот.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Платформа, която свързва дарители с хора в нужда. По-малко отпадъци, повече солидарност — започваме от Бургас.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-soft text-base h-12 px-6">
                <PackagePlus className="w-5 h-5" /> Дарявам вещ
              </Button>
              <Button size="lg" variant="outline" className="text-base h-12 px-6 border-2">
                <Search className="w-5 h-5" /> Търся вещ
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background" />
                ))}
              </div>
              <span>Над 500+ души вече се присъединиха</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-30" />
            <img
              src={heroImg}
              alt="Ръце, които си подават вещ — символ на дарителство"
              width={1536}
              height={1024}
              className="relative rounded-3xl shadow-soft w-full"
            />
            <Card className="absolute -bottom-6 -left-6 p-4 shadow-soft border-2 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent grid place-items-center">
                  <Leaf className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-bold">2,340 кг</div>
                  <div className="text-xs text-muted-foreground">спасени от боклука</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Как работи?</h2>
          <p className="text-muted-foreground text-lg">Три прости стъпки разделят една ненужна вещ от нов дом.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: PackagePlus, title: "Качи вещ", desc: "Снимка, категория и кратко описание. Готов си за минута.", num: "01" },
            { icon: MapPin, title: "Свържи се", desc: "Виж кой има нужда близо до теб или избери пункт за оставяне.", num: "02" },
            { icon: MessageCircle, title: "Дари с любов", desc: "Кратък чат, среща и една усмивка повече в света.", num: "03" },
          ].map((s, i) => (
            <Card key={i} className="p-8 border-2 hover:border-primary hover:shadow-soft transition-smooth group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-soft group-hover:scale-110 transition-smooth">
                  <s.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-5xl font-bold text-muted">{s.num}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <DonationMap />

      {/* Impact */}
      <section id="impact" className="bg-gradient-hero py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Ефект, който усещаш</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Всяка дарена вещ е по-малко боклук, по-малко производство и едно семейство с повече усмивки.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { v: "2.3т", l: "спасени" },
                  { v: "840", l: "дарения" },
                  { v: "12", l: "квартала" },
                ].map((s, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-card border border-border shadow-soft">
                    <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{s.v}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Leaf, t: "Екология", d: "По-малко отпадъци, по-малко производство, по-чист град." },
                { icon: Users, t: "Социално", d: "Реална помощ за семейства, които имат нужда." },
                { icon: Recycle, t: "Кръгова икономика", d: "Втори, трети и пети живот на всяка вещ." },
                { icon: Heart, t: "Общност", d: "Съседи, които си помагат — отново." },
              ].map((c, i) => (
                <Card key={i} className="p-6 border-2 hover:shadow-soft transition-smooth">
                  <c.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold mb-1">{c.t}</h3>
                  <p className="text-sm text-muted-foreground">{c.d}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section id="community" className="container py-20 lg:py-28">
        <Card className="relative overflow-hidden border-0 bg-gradient-primary p-12 lg:p-16 text-center shadow-glow">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-foreground/30 blur-2xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent/40 blur-2xl" />
          </div>
          <div className="relative max-w-2xl mx-auto text-primary-foreground">
            <Star className="w-12 h-12 mx-auto mb-4" fill="currentColor" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Стани част от движението</h2>
            <p className="text-lg opacity-90 mb-8">
              Започваме общност в Бургас. Дари първата си вещ или резервирай нещо, което ти трябва — без пари, само с добро.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" variant="secondary" className="h-12 px-6 text-base bg-card text-foreground hover:bg-card/90">
                Присъедини се <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-base bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Подкрепи проекта
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            <span>Дари, не изхвърляй · Бургас 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-smooth">Условия</a>
            <a href="#" className="hover:text-foreground transition-smooth">Контакти</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
