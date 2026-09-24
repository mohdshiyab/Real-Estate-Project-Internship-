import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCompass,
  FiCalendar,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiMapPin,
  FiBookmark,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getBuyerInquiries } from "../services/inquiryService";
import { Spinner } from "../components/Loader";
import { formatPrice, formatDate } from "../utils/format";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/buyer/dashboard");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getBuyerInquiries();
        setInquiries(data || []);
      } catch (err) {
        toast.error(err.message || "Failed to load inquiries");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  if (loading) return <Spinner className="min-h-[70vh]" />;

  return (
    <div className="section py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-gold p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.25em] mb-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              Customer / Buyer Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-display">
              Welcome, <span className="gold-text italic">{user?.name}</span>
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Track your property inquiries and follow up with private dealers.
            </p>
          </div>

          <Link to="/properties" className="btn-gold !py-3">
            <FiCompass /> Explore All Properties
          </Link>
        </div>
      </motion.div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display">My Property Inquiries ({inquiries.length})</h2>
          <p className="text-white/60 text-xs mt-1">Residences you've requested viewings or info for</p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="glass-gold p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4 text-gold text-2xl">
            <FiBookmark />
          </div>
          <h3 className="font-display text-2xl mb-2">No inquiries submitted yet</h3>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
            Explore our curated luxury residences and click "Request Private Viewing" or "I'm Interested" on any listing to connect with dealers.
          </p>
          <Link to="/properties" className="btn-gold">
            Browse Luxury Collection <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {inquiries.map((inq) => {
            const p = inq.property;
            const seller = inq.seller;
            return (
              <motion.div
                key={inq._id}
                layout
                className="glass overflow-hidden flex flex-col border border-white/10 hover:border-gold/40 transition-all"
              >
                {p ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-gold-gradient text-emerald-deep font-semibold">
                        For {p.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider glass-gold text-gold">
                        {p.propertyType}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 bg-white/5 flex items-center justify-center text-white/50 text-sm">
                    Listing no longer available
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {p && (
                    <>
                      <h3 className="font-display text-xl mb-1 line-clamp-1">{p.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-white/60 mb-2">
                        <FiMapPin className="text-gold" /> {p.location}
                      </div>
                      <div className="font-display text-2xl gold-text mb-4">
                        {formatPrice(p.price)}
                        {p.status === "rent" && <span className="text-xs text-white/50 font-sans">/mo</span>}
                      </div>
                    </>
                  )}

                  <div className="glass p-3.5 rounded-xl text-xs text-white/80 italic mb-4">
                    "{inq.message}"
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/50 py-2 border-t border-white/10 mb-4">
                    <span className="flex items-center gap-1">
                      <FiCalendar /> Inquired: {formatDate(inq.createdAt)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 ${
                        inq.status === "contacted"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-400/20 text-amber-300"
                      }`}
                    >
                      {inq.status === "contacted" ? <FiCheckCircle /> : <FiClock />}
                      {inq.status === "contacted" ? "Dealer Contacted You" : "Under Review"}
                    </span>
                  </div>

                  {seller && (
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] uppercase text-gold">Dealer Contact</div>
                        <div className="font-medium text-white/90">{seller.name}</div>
                      </div>
                      <div className="flex gap-2">
                        {seller.email && (
                          <a
                            href={`mailto:${seller.email}`}
                            className="p-2 rounded-full glass hover:text-gold transition"
                            title="Email Dealer"
                          >
                            <FiMail />
                          </a>
                        )}
                        {(seller.phone || p?.contactNumber) && (
                          <a
                            href={`tel:${seller.phone || p?.contactNumber}`}
                            className="p-2 rounded-full glass text-gold hover:scale-110 transition"
                            title="Call Dealer"
                          >
                            <FiPhone />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {p && (
                    <Link
                      to={`/properties/${p._id}`}
                      className="btn-outline !py-2 text-xs w-full text-center mt-4"
                    >
                      View Full Listing
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
