import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getMyProperties, deleteProperty } from "../services/propertyService";
import { getSellerInquiries, updateInquiryStatus } from "../services/inquiryService";
import { Spinner } from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";
import { formatPrice, formatDate } from "../utils/format";

export default function SellerDashboard() {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("properties"); // 'properties' | 'inquiries'

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isSeller) {
      navigate("/login?redirect=/seller/dashboard");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [propsData, inqData] = await Promise.all([
          getMyProperties(),
          getSellerInquiries(),
        ]);
        setProperties(propsData || []);
        setInquiries(inqData || []);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isSeller, navigate]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProperty(deleteId);
      setProperties((prev) => prev.filter((p) => p._id !== deleteId));
      toast.success("Property removed successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete property");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const toggleInquiryStatus = async (inquiryId, currentStatus) => {
    const nextStatus = currentStatus === "contacted" ? "pending" : "contacted";
    try {
      await updateInquiryStatus(inquiryId, nextStatus);
      setInquiries((prev) =>
        prev.map((inq) =>
          inq._id === inquiryId ? { ...inq, status: nextStatus } : inq
        )
      );
      toast.success(
        nextStatus === "contacted"
          ? "Marked as contacted"
          : "Reverted to pending"
      );
    } catch (err) {
      toast.error(err.message || "Failed to update inquiry status");
    }
  };

  if (loading) return <Spinner className="min-h-[70vh]" />;

  const totalValue = properties.reduce((acc, p) => acc + (p.price || 0), 0);
  const pendingInquiriesCount = inquiries.filter((i) => i.status === "pending").length;

  return (
    <div className="section py-10">
      {/* Dashboard Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-gold p-8 mb-8 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.25em] mb-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Dealer / Seller Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-display">
              Welcome back, <span className="gold-text italic">{user?.name}</span>
            </h1>
            <p className="text-white/60 text-sm mt-1">
              {user?.agency ? `${user.agency} • ` : ""}
              Manage your private portfolio and customer inquiries in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/add" className="btn-gold !py-3">
              <FiPlus /> List New Property
            </Link>
          </div>
        </div>

        {/* Stats Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gold/20">
          <div className="glass p-4 text-center">
            <div className="text-gold text-sm uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <FiHome /> My Listings
            </div>
            <div className="font-display text-2xl md:text-3xl">{properties.length}</div>
          </div>

          <div className="glass p-4 text-center">
            <div className="text-gold text-sm uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <FiUsers /> Interested Buyers
            </div>
            <div className="font-display text-2xl md:text-3xl">{inquiries.length}</div>
          </div>

          <div className="glass p-4 text-center">
            <div className="text-gold text-sm uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <FiClock /> Needs Follow-Up
            </div>
            <div className="font-display text-2xl md:text-3xl text-amber-400">
              {pendingInquiriesCount}
            </div>
          </div>

          <div className="glass p-4 text-center">
            <div className="text-gold text-sm uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <FiDollarSign /> Portfolio Value
            </div>
            <div className="font-display text-xl md:text-2xl gold-text truncate">
              {formatPrice(totalValue)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs navigation */}
      <div className="flex border-b border-white/10 mb-8 gap-4">
        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-4 px-2 text-sm uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === "properties"
              ? "border-gold text-gold"
              : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          <FiHome /> My Listed Properties ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-4 px-2 text-sm uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition relative ${
            activeTab === "inquiries"
              ? "border-gold text-gold"
              : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          <FiUsers /> Interested Customers ({inquiries.length})
          {pendingInquiriesCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gold text-emerald-deep text-[10px] font-bold flex items-center justify-center">
              {pendingInquiriesCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: SELLER'S LISTED PROPERTIES ONLY */}
      {activeTab === "properties" && (
        <div>
          {properties.length === 0 ? (
            <div className="glass-gold p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4 text-gold text-2xl">
                <FiHome />
              </div>
              <h3 className="font-display text-2xl mb-2">No properties listed yet</h3>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
                You haven't listed any residences under your dealer account yet. Add your first property to start connecting with interested buyers.
              </p>
              <Link to="/add" className="btn-gold">
                <FiPlus /> List Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => {
                const propInquiries = inquiries.filter(
                  (i) => i.property?._id === p._id || i.property === p._id
                );
                return (
                  <motion.div
                    key={p._id}
                    layout
                    className="glass overflow-hidden flex flex-col group hover:border-gold/50 transition-all duration-300"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-gold-gradient text-emerald-deep font-semibold">
                          For {p.status}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider glass-gold text-gold">
                          {p.propertyType}
                        </span>
                      </div>
                      {propInquiries.length > 0 && (
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-deep/90 border border-gold/40 text-gold text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                          <FiUsers /> {propInquiries.length} interested
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-display text-xl mb-1 line-clamp-1">{p.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-white/60 mb-3">
                        <FiMapPin className="text-gold" /> {p.location}
                      </div>

                      <div className="font-display text-2xl gold-text mb-4">
                        {formatPrice(p.price)}
                        {p.status === "rent" && <span className="text-xs text-white/50 font-sans">/mo</span>}
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/50 py-2 border-t border-white/10 mb-4">
                        <span>{p.bedrooms || 0} Beds • {p.bathrooms || 0} Baths</span>
                        <span>{p.area || 0} sq ft</span>
                      </div>

                      <div className="mt-auto flex items-center gap-2 pt-2 border-t border-white/10">
                        <Link
                          to={`/properties/${p._id}`}
                          className="btn-ghost !py-2 !px-3 text-xs flex-1 text-center"
                          title="View on site"
                        >
                          <FiEye /> View
                        </Link>
                        <Link
                          to={`/edit/${p._id}`}
                          className="btn-ghost !py-2 !px-3 text-xs flex-1 text-center text-gold"
                          title="Edit listing"
                        >
                          <FiEdit2 /> Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-2.5 rounded-full border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white transition"
                          title="Delete listing"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CUSTOMERS WHO ARE INTERESTED IN SELLER'S PROPERTIES */}
      {activeTab === "inquiries" && (
        <div>
          {inquiries.length === 0 ? (
            <div className="glass-gold p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4 text-gold text-2xl">
                <FiUsers />
              </div>
              <h3 className="font-display text-2xl mb-2">No inquiries yet</h3>
              <p className="text-white/60 text-sm max-w-md mx-auto">
                When customers view your listed residences and click "Request Private Viewing / I'm Interested", their contact details and inquiry will appear directly here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => {
                const prop = inq.property;
                const isPending = inq.status === "pending";
                return (
                  <motion.div
                    key={inq._id}
                    layout
                    className={`glass p-6 rounded-2xl border transition-all ${
                      isPending ? "border-gold/40 bg-gold/5" : "border-white/10"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Customer Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold-gradient text-emerald-deep font-bold flex items-center justify-center text-sm shadow">
                            {inq.buyerName?.[0] || "C"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-lg">{inq.buyerName}</h4>
                              <span
                                className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold ${
                                  isPending
                                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                }`}
                              >
                                {isPending ? "Needs Contact" : "Contacted"}
                              </span>
                            </div>
                            <div className="text-xs text-white/50 flex items-center gap-3 mt-0.5">
                              <span className="flex items-center gap-1">
                                <FiCalendar /> {formatDate(inq.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Customer contact buttons */}
                        <div className="flex flex-wrap gap-4 text-sm text-white/80">
                          <a
                            href={`mailto:${inq.buyerEmail}`}
                            className="inline-flex items-center gap-1.5 hover:text-gold transition text-xs"
                          >
                            <FiMail className="text-gold" /> {inq.buyerEmail}
                          </a>
                          {inq.buyerPhone && (
                            <a
                              href={`tel:${inq.buyerPhone}`}
                              className="inline-flex items-center gap-1.5 hover:text-gold transition text-xs"
                            >
                              <FiPhone className="text-gold" /> {inq.buyerPhone}
                            </a>
                          )}
                        </div>

                        {/* Message */}
                        <div className="glass p-3.5 rounded-xl text-sm text-white/80 italic border border-white/5">
                          "{inq.message}"
                        </div>
                      </div>

                      {/* Right: Target Property & Actions */}
                      <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                        {prop ? (
                          <div className="mb-4">
                            <div className="text-[10px] uppercase tracking-wider text-gold mb-1">
                              Interested Residence
                            </div>
                            <Link
                              to={`/properties/${prop._id}`}
                              className="group flex items-center gap-3 hover:text-gold transition"
                            >
                              <img
                                src={prop.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200"}
                                alt={prop.title}
                                className="w-14 h-14 object-cover rounded-lg border border-gold/20"
                              />
                              <div className="min-w-0">
                                <div className="font-semibold text-sm truncate group-hover:text-gold">
                                  {prop.title}
                                </div>
                                <div className="text-xs text-gold">{formatPrice(prop.price)}</div>
                                <div className="text-[11px] text-white/50 truncate">{prop.location}</div>
                              </div>
                            </Link>
                          </div>
                        ) : (
                          <div className="text-xs text-white/50 mb-4">Property archived</div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleInquiryStatus(inq._id, inq.status)}
                            className={`flex-1 !py-2 !px-3 text-xs rounded-full border transition flex items-center justify-center gap-1.5 font-medium ${
                              isPending
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                                : "bg-white/5 text-white/70 border-white/20 hover:text-white"
                            }`}
                          >
                            <FiCheckCircle />
                            {isPending ? "Mark Contacted" : "Reopen Inquiry"}
                          </button>
                          {inq.buyerPhone && (
                            <a
                              href={`tel:${inq.buyerPhone}`}
                              className="btn-gold !py-2 !px-4 text-xs"
                              title="Call Customer"
                            >
                              <FiPhone /> Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Remove this listing?"
        message="This will permanently delete this property from Aurum Estates."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
