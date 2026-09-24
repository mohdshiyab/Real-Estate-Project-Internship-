import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSave,
  FiX,
  FiNavigation,
  FiMapPin,
  FiCheckCircle,
  FiLoader,
  FiLayers,
  FiCompass,
} from "react-icons/fi";
import { toast } from "react-toastify";

export const ESTATE_CATEGORIES = [
  {
    id: "residential",
    label: "Residential Estates",
    icon: "🏰",
    desc: "Villas, Penthouses, Mansions & Townhouses",
  },
  {
    id: "land",
    label: "Land, Plots & Islands",
    icon: "🏝️",
    desc: "Private Islands, Vineyards, Plots & Farmland",
  },
  {
    id: "commercial",
    label: "Commercial & Hospitality",
    icon: "🏢",
    desc: "Towers, Boutique Hotels & Office Spaces",
  },
];

export const CATEGORY_TYPES = {
  residential: ["Villa", "Apartment", "House", "Penthouse", "Mansion", "Townhouse", "Studio"],
  land: ["Land", "Plot", "Vineyard", "Private Island", "Farm Land", "Commercial Land"],
  commercial: ["Commercial Building", "Boutique Hotel", "Office Space", "Warehouse"],
};

const empty = {
  title: "",
  description: "",
  price: "",
  location: "",
  estateCategory: "residential",
  propertyType: "Villa",
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  landAreaUnit: "sq ft",
  zoning: "",
  status: "sale",
  image: "",
  contactNumber: "",
  latitude: "",
  longitude: "",
};

export default function PropertyForm({
  initial,
  onSubmit,
  submitting,
  submitLabel = "Save Property",
}) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [detectingGps, setDetectingGps] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(false);

  useEffect(() => {
    if (initial) {
      // Determine estateCategory if not explicitly defined
      let cat = initial.estateCategory;
      if (!cat) {
        if (CATEGORY_TYPES.land.includes(initial.propertyType)) cat = "land";
        else if (CATEGORY_TYPES.commercial.includes(initial.propertyType)) cat = "commercial";
        else cat = "residential";
      }

      setForm({
        ...empty,
        ...initial,
        estateCategory: cat,
        latitude: initial.latitude ?? "",
        longitude: initial.longitude ?? "",
        landAreaUnit: initial.landAreaUnit || (cat === "land" ? "acres" : "sq ft"),
      });
    }
  }, [initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCategoryChange = (catId) => {
    const defaultType = CATEGORY_TYPES[catId][0];
    const defaultUnit = catId === "land" ? "acres" : "sq ft";
    setForm((f) => ({
      ...f,
      estateCategory: catId,
      propertyType: defaultType,
      landAreaUnit: defaultUnit,
      bedrooms: catId === "land" ? 0 : f.bedrooms,
      bathrooms: catId === "land" ? 0 : f.bathrooms,
    }));
  };

  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        set("latitude", lat);
        set("longitude", lng);
        toast.success(`📍 GPS Captured: ${lat}, ${lng}`);

        // Reverse geocode fallback to suggest location name
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          if (data?.address) {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              "";
            const state = data.address.state || data.address.region || "";
            const country = data.address.country || "";
            const detectedPlace = [city, state, country].filter(Boolean).join(", ");
            if (detectedPlace && !form.location.trim()) {
              set("location", detectedPlace);
              toast.info(`Address auto-filled: ${detectedPlace}`);
            }
          }
        } catch {
          // Non-critical fallback
        }
        setDetectingGps(false);
      },
      (err) => {
        setDetectingGps(false);
        let msg = "Could not acquire GPS position";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow location access in your browser.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = "GPS location unavailable.";
        } else if (err.code === err.TIMEOUT) {
          msg = "Location request timed out.";
        }
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.length > 200) e.title = "Max 200 characters";
    if (!form.location.trim()) e.location = "Location is required";
    if (form.price === "" || isNaN(form.price) || Number(form.price) < 0)
      e.price = "Valid price required";
    if (form.image && !/^https?:\/\//.test(form.image)) e.image = "Must be a valid URL";
    if (form.description && form.description.length > 4000)
      e.description = "Max 4000 characters";
    if (
      form.latitude !== "" &&
      (isNaN(form.latitude) || form.latitude < -90 || form.latitude > 90)
    ) {
      e.latitude = "Latitude must be between -90 and 90";
    }
    if (
      form.longitude !== "" &&
      (isNaN(form.longitude) || form.longitude < -180 || form.longitude > 180)
    ) {
      e.longitude = "Longitude must be between -180 and 180";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      price: Number(form.price),
      bedrooms: form.estateCategory === "land" ? 0 : Number(form.bedrooms) || 0,
      bathrooms: form.estateCategory === "land" ? 0 : Number(form.bathrooms) || 0,
      area: Number(form.area) || 0,
      latitude: form.latitude !== "" ? Number(form.latitude) : null,
      longitude: form.longitude !== "" ? Number(form.longitude) : null,
    });
  };

  const isLand = form.estateCategory === "land";
  const isCommercial = form.estateCategory === "commercial";
  const hasCoords = form.latitude !== "" && form.longitude !== "";
  const currentTypes = CATEGORY_TYPES[form.estateCategory] || CATEGORY_TYPES.residential;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="glass-gold p-8 space-y-6"
    >
      {/* ESTATE CATEGORY SELECTOR */}
      <div className="glass p-5 rounded-2xl border border-gold/40">
        <label className="label-luxe flex items-center gap-1.5 mb-3">
          <FiLayers className="text-gold" /> Select Estate Category *
        </label>
        <div className="grid sm:grid-cols-3 gap-3">
          {ESTATE_CATEGORIES.map((cat) => {
            const isSelected = form.estateCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-gold/15 border-gold shadow-gold text-white"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-gold/40"
                }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="font-display font-semibold text-base mb-1">
                  {cat.label}
                </div>
                <div className="text-[11px] text-white/50 leading-tight">
                  {cat.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="label-luxe">Listing Title *</label>
          <input
            className="input-luxe"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder={
              isLand
                ? "e.g. 50-Acre Oceanfront Island with Natural Anchorage"
                : isCommercial
                ? "e.g. Landmark Downtown Office Tower"
                : "e.g. Hilltop Villa with Private Vineyard"
            }
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Location & GPS Section */}
        <div className="md:col-span-2 glass p-5 border border-gold/30 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="label-luxe !mb-0 flex items-center gap-1.5">
                <FiMapPin className="text-gold" /> Estate Location & GPS Coordinates *
              </label>
              <p className="text-white/60 text-xs mt-1">
                Pinpoint exact estate or land coordinates so buyers can calculate travel distance in kilometers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentGps}
              disabled={detectingGps}
              className="btn-gold !py-2 !px-4 text-xs whitespace-nowrap shadow-sm disabled:opacity-60"
            >
              {detectingGps ? (
                <>
                  <FiLoader className="animate-spin" /> Detecting GPS...
                </>
              ) : (
                <>
                  <FiNavigation /> Use Current GPS Location
                </>
              )}
            </button>
          </div>

          <div>
            <input
              className="input-luxe"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Exuma Cays, Bahamas or Napa Valley, California"
            />
            {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
          </div>

          {hasCoords && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-gold/10 border border-gold/30 text-xs">
              <span className="flex items-center gap-1.5 text-gold font-medium">
                <FiCheckCircle /> GPS Coordinates: {form.latitude}°, {form.longitude}°
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualCoords(!showManualCoords)}
                  className="text-white/70 hover:text-white underline text-[11px]"
                >
                  {showManualCoords ? "Hide Coordinates" : "Edit Coordinates"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    set("latitude", "");
                    set("longitude", "");
                  }}
                  className="text-red-400 hover:text-red-300 text-[11px]"
                >
                  Remove GPS
                </button>
              </div>
            </div>
          )}

          {(!hasCoords || showManualCoords) && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/50 block mb-1">
                  Latitude (-90 to 90)
                </label>
                <input
                  type="number"
                  step="any"
                  className="input-luxe text-xs py-2"
                  placeholder="e.g. 24.3167"
                  value={form.latitude}
                  onChange={(e) => set("latitude", e.target.value)}
                />
                {errors.latitude && <p className="text-red-400 text-xs mt-1">{errors.latitude}</p>}
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/50 block mb-1">
                  Longitude (-180 to 180)
                </label>
                <input
                  type="number"
                  step="any"
                  className="input-luxe text-xs py-2"
                  placeholder="e.g. -76.5833"
                  value={form.longitude}
                  onChange={(e) => set("longitude", e.target.value)}
                />
                {errors.longitude && <p className="text-red-400 text-xs mt-1">{errors.longitude}</p>}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="label-luxe">Price (USD) *</label>
          <input
            type="number"
            min="0"
            className="input-luxe"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="0"
          />
          {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="label-luxe">
            {isLand ? "Land / Plot Classification *" : "Estate Type *"}
          </label>
          <select
            className="input-luxe"
            value={form.propertyType}
            onChange={(e) => set("propertyType", e.target.value)}
          >
            {currentTypes.map((t) => (
              <option key={t} value={t} className="bg-[#0b120f] text-white py-1">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-luxe">Offering Status</label>
          <select
            className="input-luxe"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="sale" className="bg-[#0b120f] text-white">For Sale / Acquisition</option>
            <option value="rent" className="bg-[#0b120f] text-white">For Lease / Rent</option>
          </select>
        </div>

        {/* Area & Unit Section */}
        <div>
          <label className="label-luxe">
            {isLand ? "Total Land / Plot Size *" : "Total Area *"}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="any"
              className="input-luxe flex-1"
              value={form.area}
              onChange={(e) => set("area", e.target.value)}
              placeholder="0"
            />
            <select
              className="input-luxe w-32"
              value={form.landAreaUnit}
              onChange={(e) => set("landAreaUnit", e.target.value)}
            >
              <option value="acres" className="bg-[#0b120f] text-white">Acres</option>
              <option value="sq ft" className="bg-[#0b120f] text-white">Sq Ft</option>
              <option value="hectares" className="bg-[#0b120f] text-white">Hectares</option>
              <option value="sq m" className="bg-[#0b120f] text-white">Sq Metres</option>
            </select>
          </div>
        </div>

        {/* If NOT land, show Bedrooms & Bathrooms */}
        {!isLand ? (
          <>
            <div>
              <label className="label-luxe">Bedrooms</label>
              <input
                type="number"
                min="0"
                className="input-luxe"
                value={form.bedrooms}
                onChange={(e) => set("bedrooms", e.target.value)}
              />
            </div>
            <div>
              <label className="label-luxe">Bathrooms</label>
              <input
                type="number"
                min="0"
                className="input-luxe"
                value={form.bathrooms}
                onChange={(e) => set("bathrooms", e.target.value)}
              />
            </div>
          </>
        ) : (
          /* For Land: Show Zoning & Permitted Land Use */
          <div>
            <label className="label-luxe flex items-center gap-1">
              <FiCompass /> Zoning / Approved Land Use
            </label>
            <input
              className="input-luxe"
              value={form.zoning}
              onChange={(e) => set("zoning", e.target.value)}
              placeholder="e.g. Residential Luxury, Viticulture, Resort Zoned"
            />
          </div>
        )}

        <div>
          <label className="label-luxe">Contact Number</label>
          <input
            className="input-luxe"
            value={form.contactNumber}
            onChange={(e) => set("contactNumber", e.target.value)}
            placeholder="+1 555 0123"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label-luxe">Featured Image URL</label>
          <input
            className="input-luxe"
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://images.unsplash.com/…"
          />
          {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
          {form.image && !errors.image && (
            <img
              src={form.image}
              alt="preview"
              className="mt-3 w-full h-48 object-cover rounded-xl border border-gold/20"
            />
          )}
        </div>

        <div className="md:col-span-2">
          <label className="label-luxe">Estate Overview & Description</label>
          <textarea
            rows={5}
            className="input-luxe resize-none"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the topography, access, water rights, potential, or architectural elegance…"
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-gold/20">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-ghost"
        >
          <FiX /> Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-gold disabled:opacity-60"
        >
          <FiSave /> {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </motion.form>
  );
}
