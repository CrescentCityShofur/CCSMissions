import { Zap, Wind, Droplets, Phone, Mail, MapPin, ShieldCheck, Sun, Leaf, Globe } from "lucide-react";
import VoiceConsultation from "@/components/VoiceConsultation";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto pt-20">
          <p className="text-xs tracking-[0.5em] text-gold/70 uppercase mb-6 font-montserrat">
            Coalition for Community Sustainability
          </p>
          <h1 className="font-cinzel text-5xl md:text-7xl gold-shimmer uppercase tracking-wider leading-tight mb-8">
            CCS Missions
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            Empowering Louisiana toward energy self-sufficiency through expert
            on-site consultations in solar, wind, and water purification.
          </p>

          <div className="flex flex-col items-center gap-6">
            <VoiceConsultation />

            <div className="flex items-center gap-2 text-gold/50 text-xs tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure voice-activated booking</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gold/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-cinzel text-3xl md:text-4xl text-center gold-shimmer uppercase tracking-widest mb-16">
            Our Missions
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sun,
                title: "Solar Power",
                desc: "Custom solar array design and installation guidance tailored to Louisiana's climate and your energy needs.",
              },
              {
                icon: Wind,
                title: "Wind Energy",
                desc: "Feasibility studies and micro-wind turbine solutions for residential and community-scale generation.",
              },
              {
                icon: Droplets,
                title: "Water Purification",
                desc: "On-site water quality assessment and purification system recommendations for clean, reliable water.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="glass-panel p-8 text-center hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 group"
              >
                <service.icon className="w-12 h-12 text-gold mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-cinzel text-xl text-gold mb-4 uppercase tracking-wider">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-cinzel text-3xl md:text-4xl gold-shimmer uppercase tracking-widest mb-16">
            Our Commitment
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Energy Independence", desc: "Reducing reliance on fragile grids through localized, renewable solutions." },
              { icon: Leaf, title: "Sustainability", desc: "Every mission is designed to last decades with minimal environmental impact." },
              { icon: Globe, title: "Community First", desc: "We serve Louisiana communities with on-the-ground expertise and ongoing support." },
            ].map((value) => (
              <div key={value.title} className="space-y-4">
                <value.icon className="w-10 h-10 text-gold mx-auto" />
                <h3 className="font-cinzel text-lg text-gold uppercase tracking-wider">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto glass-panel p-12 text-center">
          <h2 className="font-cinzel text-3xl gold-shimmer uppercase tracking-widest mb-8">
            Get In Touch
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Ready to begin your energy mission? Use the voice assistant above or
            reach us directly through the channels below.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold" />
              <span>(504) 555-0142</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gold" />
              <span>missions@ccs-nola.org</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gold" />
              <span>New Orleans, LA</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative py-8 px-6 text-center border-t border-gold/10">
        <p className="text-xs text-gray-500 tracking-widest uppercase">
          Coalition for Community Sustainability — New Orleans, Louisiana
        </p>
      </footer>
    </main>
  );
}
