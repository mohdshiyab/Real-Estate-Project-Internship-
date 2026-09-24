import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiHome, FiCompass } from "react-icons/fi";
import { LuBed, LuBath, LuRuler } from "react-icons/lu";
import { formatPrice } from "../utils/format";

const fallback =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80";

const LAND_TYPES = ["Land", "Plot", "Vineyard", "Private Island", "Farm Land", "Commercial Land"];

export default function PropertyCard({ property, index = 0 }) {
  const p = property;
  const isLand = p.estateCategory === "land" || LAND_TYPES.includes(p.propertyType);
  const isCommercial = p.estateCategory === "commercial" || ["Commercial Building", "Boutique Hotel", "Office Space", "Warehouse"].includes(p.propertyType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
      className="group glass overflow-hidden hover:border-gold/40 hover:shadow-emerald transition-all duration-500"
    >
      <Link to={`/properties/${p._id}`} className="block">
        <div className="relative h-60 overflow-hidden">
          <img
            src={p.image || fallback}
            onError={(e) => (e.currentTarget.src = fallback)}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-gold-gradient text-emerald-deep font-semibold">
            For {p.status === "rent" ? "Rent" : "Sale"}
          </span>
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] glass-gold text-gold">
            {p.propertyType}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl mb-1 line-clamp-1 group-hover:text-gold transition">
            {p.title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/60 text-sm mb-4">
            <FiMapPin className="text-gold" /> <span className="line-clamp-1">{p.location}</span>
          </div>

          {/* Conditional Specs: Land vs Commercial vs Residential */}
          <div className="flex items-center justify-between text-xs text-white/70 border-y border-white/10 py-3">
            {isLand ? (
              <>
                <span className="flex items-center gap-1.5 text-gold">
                  <FiCompass /> Land Estate
                </span>
                <span className="flex items-center gap-1.5">
                  <LuRuler className="text-gold" /> {p.area} {p.landAreaUnit || "acres"}
                </span>
                <span className="truncate max-w-[120px] text-white/50">
                  {p.zoning || "Prime Land"}
                </span>
              </>
            ) : isCommercial ? (
              <>
                <span className="flex items-center gap-1.5 text-gold">
                  🏢 Commercial
                </span>
                <span className="flex items-center gap-1.5">
                  <LuRuler className="text-gold" /> {p.area} sq ft
                </span>
                <span className="truncate max-w-[120px] text-white/50">
                  {p.zoning || "Commercial Use"}
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5">
                  <LuBed className="text-gold" /> {p.bedrooms} Beds
                </span>
                <span className="flex items-center gap-1.5">
                  <LuBath className="text-gold" /> {p.bathrooms} Baths
                </span>
                <span className="flex items-center gap-1.5">
                  <LuRuler className="text-gold" /> {p.area} ft²
                </span>
              </>
            )}
          </div>

          <div className="flex items-end justify-between mt-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                {isLand ? "Acquisition Price" : "Price"}
              </div>
              <div className="text-2xl font-display gold-text">
                {formatPrice(p.price)}
                {p.status === "rent" && <span className="text-sm text-white/50 font-sans">/mo</span>}
              </div>
            </div>
            <span className="btn-ghost !py-1.5 !px-4 text-xs">
              <FiHome /> View
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
