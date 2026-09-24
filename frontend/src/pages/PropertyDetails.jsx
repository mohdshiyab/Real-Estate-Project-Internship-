import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin, FiPhone, FiMail, FiArrowLeft, FiEdit2, FiTrash2, FiCheck,
  FiCalendar, FiHeart, FiBriefcase, FiNavigation, FiExternalLink, FiLoader,
} from "react-icons/fi";
import { LuBed, LuBath, LuRuler } from "react-icons/lu";
import { toast } from "react-toastify";
import { getProperty, getProperties, deleteProperty } from "../services/propertyService";
import { Spinner } from "../components/Loader";
import PropertyCard from "../components/PropertyCard";
import ConfirmModal from "../components/ConfirmModal";
import InquiryModal from "../components/InquiryModal";
import { useAuth } from "../context/AuthContext";
import { formatPrice, formatDate, calculateDistanceKm } from "../utils/format";

const fallback = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=80";
const AMENITIES = ["Private Pool", "Smart Home", "Concierge", "Wine Cellar", "Home Cinema", "Garden", "Sea View", "Garage"];

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  // GPS & Distance calculation state
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [userLocation, setUserLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [calculatingDist, setCalculatingDist] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getProperty(id)
      .then((data) => {
        if (!alive) return;
        setP(data);
        if (data.latitude && data.longitude) {
          setCoords({ lat: data.latitude, lng: data.longitude });
        } else if (data.location) {
          // Dynamic geocoding fallback for properties with location text
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.location)}`)
            .then((r) => r.json())
            .then((res) => {
              if (alive && res && res[0]) {
                setCoords({ lat: parseFloat(res[0].lat), lng: parseFloat(res[0].lon) });
              }
            })
            .catch(() => {});
        }
        return getProperties({ type: data.propertyType });
      })
      .then((list) => {
        if (alive && list) setRelated(list.filter((x) => x._id !== id).slice(0, 3));
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  const calculateDistance = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    if (!coords.lat || !coords.lng) {
      toast.error("Property coordinates are not yet available for distance calculation.");
      return;
    }

    setCalculatingDist(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });
        const dist = calculateDistanceKm(uLat, uLng, coords.lat, coords.lng);
        setDistanceKm(dist);
        setCalculatingDist(false);
        toast.success(`Distance calculated: ${dist} km from your current location`);
      },
      (err) => {
        setCalculatingDist(false);
        let msg = "Could not access your location";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Please allow location access in your browser to calculate distance.";
        }
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProperty(id);
      toast.success("Property deleted successfully");
      navigate("/properties");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
      setConfirm(false);
    }
  };

  if (loading) return <Spinner className="min-h-[60vh]" />;
  if (error || !p) return (
    <div className="section py-20 text-center">
      <h2 className="text-3xl mb-4">Property not found</h2>
      <p className="text-white/60 mb-6">{error}</p>
      <Link to="/properties" className="btn-outline"><FiArrowLeft /> Back to Properties</Link>
    </div>
  );

  const ownerId = p.owner?._id || p.owner;
  const currentUserId = user?._id || user?.id;
  const isOwner = Boolean(currentUserId && ownerId && currentUserId.toString() === ownerId.toString());

  const sellerName = p.owner?.name || "Aurum Concierge";
  const sellerAgency = p.owner?.agency || "Private Client Advisor";
  const sellerPhone = p.contactNumber || p.owner?.phone || "+1 (555) 019-8833";
  const sellerEmail = p.owner?.email || "concierge@aurumestates.com";

  const mapLat = coords.lat;
  const mapLng = coords.lng;

  return (
    <div className="section py-10">
      <Link to="/properties" className="inline-flex items-center gap-2 text-white/60 hover:text-gold mb-6 text-sm">
        <FiArrowLeft /> Back to Collection
      </Link>

      {/* Hero image + meta */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative h-[60vh] rounded-3xl overflow-hidden glass">
          <img src={p.image || fallback} onError={(e)=>e.currentTarget.src=fallback} alt={p.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-gold-gradient text-emerald-deep font-semibold">For {p.status === "rent" ? "Rent" : "Sale"}</span>
            <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] glass-gold text-gold">{p.propertyType}</span>
          </div>
        </div>
        <div className="glass-gold p-7 flex flex-col">
          <h1 className="font-display text-3xl mb-2">{p.title}</h1>
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <FiMapPin className="text-gold" /> {p.location}
          </div>
          <div className="text-4xl font-display gold-text mb-6">
            {formatPrice(p.price)}
            {p.status === "rent" && <span className="text-base text-white/50 font-sans">/mo</span>}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(p.estateCategory === "land" || ["Land", "Plot", "Vineyard", "Private Island", "Farm Land", "Commercial Land"].includes(p.propertyType)
              ? [
                  { icon: LuRuler, label: "Land Area", val: `${p.area} ${p.landAreaUnit || "acres"}` },
                  { icon: FiCompass, label: "Zoning", val: p.zoning || "Prime Land" },
                  { icon: FiMapPin, label: "Estate Type", val: p.propertyType },
                ]
              : p.estateCategory === "commercial" || ["Commercial Building", "Boutique Hotel", "Office Space", "Warehouse"].includes(p.propertyType)
              ? [
                  { icon: LuRuler, label: "Total Area", val: `${p.area} ft²` },
                  { icon: FiCompass, label: "Zoning", val: p.zoning || "Commercial" },
                  { icon: FiBriefcase, label: "Asset Type", val: p.propertyType },
                ]
              : [
                  { icon: LuBed, label: "Beds", val: p.bedrooms },
                  { icon: LuBath, label: "Baths", val: p.bathrooms },
                  { icon: LuRuler, label: "Area", val: `${p.area} ft²` },
                ]
            ).map((s, i) => (
              <div key={i} className="glass p-4 text-center">
                <s.icon className="text-gold text-xl mx-auto mb-1" />
                <div className="text-sm md:text-base font-display truncate" title={s.val}>{s.val}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-white/50 flex items-center gap-2 mb-6">
            <FiCalendar /> Listed {formatDate(p.createdAt)}
          </div>

          {/* Action buttons: Owner gets Edit/Delete, Customers get "I'm Interested" */}
          <div className="mt-auto">
            {isOwner ? (
              <div className="flex gap-2">
                <Link to={`/edit/${p._id}`} className="btn-ghost flex-1 text-center"><FiEdit2 /> Edit</Link>
                <button onClick={() => setConfirm(true)} className="px-5 py-2.5 rounded-full border border-red-400/40 text-red-300 hover:bg-red-500 hover:text-white transition">
                  <FiTrash2 className="inline mr-2" />Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => setInquiryOpen(true)}
                className="btn-gold w-full text-sm"
              >
                <FiHeart className="text-base" /> I'm Interested • Inquire
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Description + amenities + agent */}
      <div className="grid lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-7">
            <h2 className="font-display text-2xl mb-3">About this Residence</h2>
            <p className="text-white/70 leading-relaxed whitespace-pre-line">
              {p.description || "An exceptional offering in a sought-after location, this residence embodies the pinnacle of luxury living."}
            </p>
          </div>
          <div className="glass p-7">
            <h2 className="font-display text-2xl mb-5">Amenities</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {AMENITIES.map((a) => (
                <div key={a} className="flex items-center gap-3 text-white/80">
                  <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                    <FiCheck className="text-gold text-sm" />
                  </span>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* LOCATION, INTERACTIVE MAP & DISTANCE CALCULATOR */}
          <div className="glass-gold p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-1">
                  Geography & Navigation
                </div>
                <h2 className="font-display text-2xl flex items-center gap-2">
                  <FiMapPin className="text-gold" /> {p.location}
                </h2>
                {mapLat && mapLng && (
                  <p className="text-xs text-white/50 mt-1">
                    GPS Coordinates: {mapLat.toFixed(4)}°, {mapLng.toFixed(4)}°
                  </p>
                )}
              </div>

              {/* Distance Action Button */}
              <div>
                <button
                  onClick={calculateDistance}
                  disabled={calculatingDist}
                  className="btn-gold !py-2.5 !px-5 text-xs whitespace-nowrap shadow-md disabled:opacity-60"
                >
                  {calculatingDist ? (
                    <>
                      <FiLoader className="animate-spin" /> Locating You...
                    </>
                  ) : (
                    <>
                      <FiNavigation /> Calculate Distance from My Place
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Calculated Distance Display */}
            {distanceKm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-gold/15 border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-gradient text-emerald-deep font-bold flex items-center justify-center text-lg shadow">
                    <FiNavigation />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gold font-semibold">
                      Live Distance Calculated
                    </div>
                    <div className="text-xl font-display text-white">
                      <span className="gold-text font-bold text-2xl">{distanceKm} km</span> away from your current place
                    </div>
                  </div>
                </div>

                {userLocation && mapLat && mapLng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${mapLat},${mapLng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost !py-2 !px-4 text-xs inline-flex items-center gap-1.5"
                  >
                    Open Directions <FiExternalLink />
                  </a>
                )}
              </motion.div>
            )}

            {/* Map Frame */}
            {mapLat && mapLng ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-gold/30 h-80 bg-ink/50 shadow-inner">
                  <iframe
                    title={`Map showing ${p.title}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.02}%2C${mapLat - 0.02}%2C${mapLng + 0.02}%2C${mapLat + 0.02}&layer=mapnik&marker=${mapLat}%2C${mapLng}`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white/50 px-1">
                  <span>Interactive OpenStreetMap view</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapLat},${mapLng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline inline-flex items-center gap-1"
                  >
                    View in Google Maps <FiExternalLink />
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass p-8 text-center rounded-2xl border border-white/10">
                <FiMapPin className="text-gold text-2xl mx-auto mb-2" />
                <p className="text-white/70 text-sm mb-3">Viewing map for {p.location}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline !py-2 !px-4 text-xs"
                >
                  Search on Google Maps <FiExternalLink />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Dealer / Seller details */}
        <aside className="glass-gold p-7 h-fit sticky top-24">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center text-emerald-deep font-display text-xl font-bold">
              {sellerName[0]}
            </div>
            <div>
              <div className="font-display text-lg">{sellerName}</div>
              <div className="text-xs text-gold/80 flex items-center gap-1">
                <FiBriefcase /> {sellerAgency}
              </div>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <a href={`tel:${sellerPhone}`} className="flex items-center gap-3 text-white/80 hover:text-gold">
              <FiPhone className="text-gold" /> {sellerPhone}
            </a>
            <a href={`mailto:${sellerEmail}`} className="flex items-center gap-3 text-white/80 hover:text-gold">
              <FiMail className="text-gold" /> {sellerEmail}
            </a>
          </div>

          {!isOwner && (
            <button
              onClick={() => setInquiryOpen(true)}
              className="btn-gold w-full mt-6"
            >
              Request Private Viewing
            </button>
          )}
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="divider-gold mb-4" />
          <h2 className="text-3xl mb-6">Similar <span className="gold-text italic">Residences</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r, i) => <PropertyCard key={r._id} property={r} index={i} />)}
          </div>
        </section>
      )}

      {/* Modals */}
      <ConfirmModal
        open={confirm}
        title="Delete this property?"
        message="This action cannot be undone."
        onCancel={() => setConfirm(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <InquiryModal
        open={inquiryOpen}
        property={p}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}
