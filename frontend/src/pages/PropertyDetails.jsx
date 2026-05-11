import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin, FiPhone, FiMail, FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiCalendar,
} from "react-icons/fi";
import { LuBed, LuBath, LuRuler } from "react-icons/lu";
import { toast } from "react-toastify";
import { getProperty, getProperties, deleteProperty } from "../services/propertyService";
import { Spinner } from "../components/Loader";
import PropertyCard from "../components/PropertyCard";
import ConfirmModal from "../components/ConfirmModal";
import { formatPrice, formatDate } from "../utils/format";

const fallback = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=80";
const AMENITIES = ["Private Pool", "Smart Home", "Concierge", "Wine Cellar", "Home Cinema", "Garden", "Sea View", "Garage"];

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getProperty(id)
      .then((data) => {
        if (!alive) return;
        setP(data);
        return getProperties({ type: data.propertyType });
      })
      .then((list) => {
        if (alive && list) setRelated(list.filter((x) => x._id !== id).slice(0, 3));
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

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
            {[
              { icon: LuBed, label: "Beds", val: p.bedrooms },
              { icon: LuBath, label: "Baths", val: p.bathrooms },
              { icon: LuRuler, label: "Area", val: `${p.area} ft²` },
            ].map((s, i) => (
              <div key={i} className="glass p-4 text-center">
                <s.icon className="text-gold text-xl mx-auto mb-1" />
                <div className="text-lg font-display">{s.val}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-white/50 flex items-center gap-2 mb-6">
            <FiCalendar /> Listed {formatDate(p.createdAt)}
          </div>
          <div className="flex gap-2 mt-auto">
            <Link to={`/edit/${p._id}`} className="btn-ghost flex-1"><FiEdit2 /> Edit</Link>
            <button onClick={() => setConfirm(true)} className="px-5 py-2.5 rounded-full border border-red-400/40 text-red-300 hover:bg-red-500 hover:text-white transition">
              <FiTrash2 className="inline mr-2" />Delete
            </button>
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
        </div>

        <aside className="glass-gold p-7 h-fit sticky top-24">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center text-emerald-deep font-display text-xl font-bold">A</div>
            <div>
              <div className="font-display text-lg">Aurum Concierge</div>
              <div className="text-xs text-gold/80">Private Client Advisor</div>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <a href={`tel:${p.contactNumber || "+442079460000"}`} className="flex items-center gap-3 text-white/80 hover:text-gold">
              <FiPhone className="text-gold" /> {p.contactNumber || "+44 20 7946 0000"}
            </a>
            <a href="mailto:hello@aurumestates.com" className="flex items-center gap-3 text-white/80 hover:text-gold">
              <FiMail className="text-gold" /> hello@aurumestates.com
            </a>
          </div>
          <button className="btn-gold w-full mt-6">Request Private Viewing</button>
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

      <ConfirmModal
        open={confirm}
        title="Delete this property?"
        message="This action cannot be undone."
        onCancel={() => setConfirm(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
