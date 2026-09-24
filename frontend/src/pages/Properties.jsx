import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { getProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import { GridSkeleton } from "../components/Loader";

const CATEGORY_TABS = [
  { id: "", label: "All Estates", icon: "✨" },
  { id: "residential", label: "Residences & Mansions", icon: "🏰" },
  { id: "land", label: "Land, Plots & Islands", icon: "🏝️" },
  { id: "commercial", label: "Commercial Estates", icon: "🏢" },
];

const GROUPED_TYPES = {
  "Residential Properties": ["Villa", "Apartment", "House", "Penthouse", "Mansion", "Townhouse", "Studio"],
  "Land & Plots": ["Land", "Plot", "Vineyard", "Private Island", "Farm Land", "Commercial Land"],
  "Commercial & Hospitality": ["Commercial Building", "Boutique Hotel", "Office Space", "Warehouse"],
};

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    type: searchParams.get("type") || "",
    status: searchParams.get("status") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    location: searchParams.get("location") || "",
  });
  const [sort, setSort] = useState("newest");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.location) params.location = filters.location;
      if (sort) params.sort = sort;
      const data = await getProperties(params);
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const sp = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) sp[k] = v;
    });
    setSearchParams(sp, { replace: true });
    // eslint-disable-next-line
  }, [filters]);

  const filteredSorted = useMemo(() => {
    let list = [...items];
    if (filters.location) {
      const rx = filters.location.toLowerCase();
      list = list.filter((p) => p.location?.toLowerCase().includes(rx));
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "beds-desc":
        list.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0));
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [items, filters.location, sort]);

  const update = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const clear = () =>
    setFilters({
      q: "",
      category: "",
      type: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      location: "",
    });

  const activeCount = Object.entries(filters).filter(([k, v]) => k !== "category" && Boolean(v)).length;

  // Dynamic header based on category
  const getHeaderInfo = () => {
    switch (filters.category) {
      case "land":
        return {
          title: "Land, Plots & Islands",
          desc: "Private islands, vineyard estates, coastal development plots, and agricultural holdings.",
        };
      case "commercial":
        return {
          title: "Commercial & Hospitality",
          desc: "Iconic towers, boutique luxury hotels, and premier corporate headquarters.",
        };
      case "residential":
        return {
          title: "Luxury Residences",
          desc: "Private villas, penthouses, historic townhouses, and architectural masterpieces.",
        };
      default:
        return {
          title: "Our Collection",
          desc: `Browse ${items.length} curated luxury residences, land holdings, and commercial estates.`,
        };
    }
  };

  const header = getHeaderInfo();

  return (
    <div className="section py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="divider-gold mb-4" />
        <h1 className="text-4xl md:text-5xl">
          {header.title.split(" ")[0]}{" "}
          <span className="gold-text italic">
            {header.title.split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-white/60 mt-2">{header.desc}</p>
      </motion.div>

      {/* SEPARATE CATEGORY BROWSING TABS */}
      <div className="flex flex-wrap gap-2.5 mb-8 p-1.5 glass rounded-2xl border border-gold/30">
        {CATEGORY_TABS.map((tab) => {
          const isActive = filters.category === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => update("category", tab.id)}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-gold-gradient text-emerald-deep shadow-gold font-bold"
                  : "text-white/70 hover:text-gold hover:bg-white/5"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search bar + Sort + Filter toggle */}
      <div className="glass p-4 flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 px-3 bg-white/5 border border-white/10 rounded-xl">
          <FiSearch className="text-gold" />
          <input
            value={filters.q}
            onChange={(e) => update("q", e.target.value)}
            placeholder="Search by title, location, estate type, or description…"
            className="bg-transparent w-full py-3 outline-none placeholder-white/40"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-luxe md:w-56"
        >
          <option value="newest" className="bg-[#0b120f] text-white">Newest First</option>
          <option value="price-asc" className="bg-[#0b120f] text-white">Price: Low to High</option>
          <option value="price-desc" className="bg-[#0b120f] text-white">Price: High to Low</option>
          <option value="beds-desc" className="bg-[#0b120f] text-white">Most Bedrooms</option>
        </select>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-ghost relative whitespace-nowrap"
        >
          <FiFilter /> Filters{" "}
          {activeCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-emerald-deep text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-gold p-6 mb-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div>
            <label className="label-luxe">Location / Region</label>
            <input
              className="input-luxe"
              placeholder="e.g. Bahamas or Napa Valley"
              value={filters.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </div>
          <div>
            <label className="label-luxe">Specific Estate Type</label>
            <select
              className="input-luxe"
              value={filters.type}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="" className="bg-[#0b120f] text-white">Any Estate Type</option>
              {Object.entries(GROUPED_TYPES).map(([group, types]) => (
                <optgroup key={group} label={group} className="bg-[#0b120f] text-gold">
                  {types.map((t) => (
                    <option key={t} value={t} className="bg-[#0b120f] text-white">
                      {t}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="label-luxe">Offering Status</label>
            <select
              className="input-luxe"
              value={filters.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="" className="bg-[#0b120f] text-white">Any Status</option>
              <option value="sale" className="bg-[#0b120f] text-white">For Sale / Acquisition</option>
              <option value="rent" className="bg-[#0b120f] text-white">For Rent / Lease</option>
            </select>
          </div>
          <div>
            <label className="label-luxe">Min Bedrooms (Residences)</label>
            <select
              className="input-luxe"
              value={filters.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
            >
              <option value="" className="bg-[#0b120f] text-white">Any</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n} className="bg-[#0b120f] text-white">
                  {n}+ Beds
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-luxe">Min Price (USD)</label>
            <input
              type="number"
              className="input-luxe"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => update("minPrice", e.target.value)}
            />
          </div>
          <div>
            <label className="label-luxe">Max Price (USD)</label>
            <input
              type="number"
              className="input-luxe"
              placeholder="∞"
              value={filters.maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
            />
          </div>
          <div className="lg:col-span-2 flex items-end">
            <button onClick={clear} className="btn-ghost w-full">
              <FiX /> Reset All Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Results Grid */}
      {loading ? (
        <GridSkeleton count={9} />
      ) : error ? (
        <div className="glass-gold p-10 text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <button onClick={fetchData} className="btn-outline">
            Retry
          </button>
        </div>
      ) : filteredSorted.length === 0 ? (
        <div className="glass p-16 text-center">
          <p className="text-white/60 mb-4">No estates match your selected criteria.</p>
          <button onClick={clear} className="btn-outline">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSorted.map((p, i) => (
            <PropertyCard key={p._id} property={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
