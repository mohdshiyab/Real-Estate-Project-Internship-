import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch, FiArrowRight, FiAward, FiShield, FiTrendingUp, FiKey, FiStar,
} from "react-icons/fi";
import { getProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import { GridSkeleton } from "../components/Loader";

const HERO_BG =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2000&q=80";

const services = [
  { icon: FiKey, title: "Private Sales", desc: "Bespoke acquisition of off-market trophy residences." },
  { icon: FiShield, title: "Wealth Protection", desc: "Tax-optimized structures for global property portfolios." },
  { icon: FiTrendingUp, title: "Investment Advisory", desc: "Data-driven insights for high-yield estates." },
  { icon: FiAward, title: "White-Glove Service", desc: "A dedicated concierge from search to settlement." },
];

const stats = [
  { value: "1,200+", label: "Properties Sold" },
  { value: "$4.8B", label: "Transaction Volume" },
  { value: "38", label: "Countries Served" },
  { value: "98%", label: "Client Satisfaction" },
];

const testimonials = [
  { name: "Isabella Moreau", role: "Collector, Paris", text: "Aurum found us a Belle Époque townhouse before it ever hit the market. Unmatched discretion." },
  { name: "Rajeev Khanna", role: "Founder, Singapore", text: "Their advisory team turned our Mayfair acquisition into a textbook investment. Truly first-class." },
  { name: "Sofia Aguilar", role: "Architect, Madrid", text: "Every detail curated. Aurum doesn't sell homes — they sell a lifestyle." },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProperties()
      .then((d) => setFeatured(d.slice(0, 6)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/properties${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="section relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 glass-gold px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-gold mb-6">
              <FiStar /> Curated Since 2010
            </span>
            <h1 className="text-5xl md:text-7xl leading-[1.05] mb-6">
              Where <span className="gold-text italic">extraordinary</span><br />
              residences find their owners.
            </h1>
            <p className="text-lg text-white/75 max-w-xl mb-10">
              A discreet collection of villas, penthouses and historic estates curated for the world's most discerning collectors.
            </p>

            <form onSubmit={onSearch} className="glass-gold p-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <FiSearch className="text-gold text-lg shrink-0" />
                <input
                  value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by location, type, or keyword…"
                  className="bg-transparent w-full py-3 outline-none placeholder-white/40"
                />
              </div>
              <button type="submit" className="btn-gold !py-3">
                Search <FiArrowRight />
              </button>
            </form>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/properties" className="btn-outline">Browse Collection</Link>
              <Link to="/add" className="btn-ghost">List Your Property <FiArrowRight /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="section -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 glass-gold divide-x divide-y md:divide-y-0 divide-gold/20 overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} className="p-8 text-center"
            >
              <div className="font-display text-3xl md:text-4xl gold-text">{s.value}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/60 mt-2">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="section py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="divider-gold mb-4" />
            <h2 className="text-4xl md:text-5xl">Featured <span className="gold-text italic">Residences</span></h2>
            <p className="text-white/60 mt-3 max-w-lg">Hand-picked listings from our private portfolio.</p>
          </div>
          <Link to="/properties" className="btn-outline">View All <FiArrowRight /></Link>
        </div>
        {loading ? <GridSkeleton /> : featured.length === 0 ? (
          <div className="glass p-12 text-center text-white/60">
            No properties yet. <Link to="/add" className="text-gold underline">List the first one</Link>.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section className="section py-24">
        <div className="text-center mb-14">
          <div className="divider-gold mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl">Bespoke <span className="gold-text italic">Services</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass p-7 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-gradient border border-gold/30 flex items-center justify-center mb-5">
                <s.icon className="text-2xl text-gold" />
              </div>
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section py-24">
        <div className="text-center mb-14">
          <div className="divider-gold mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl">Voices of <span className="gold-text italic">Trust</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass p-8 relative"
            >
              <div className="text-gold text-5xl font-display absolute -top-2 left-6 opacity-40">"</div>
              <p className="text-white/80 italic leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-emerald-deep font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-gold/80">{t.role}</div>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section py-24">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-gradient border border-gold/30 p-12 md:p-16 text-center">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-emerald-glow/30 blur-3xl" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl mb-4">Ready to find your <span className="gold-text italic">forever address?</span></h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">Let our private team craft a portfolio aligned with your vision.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/properties" className="btn-gold">Explore Properties</Link>
              <Link to="/add" className="btn-outline">List Your Estate</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
