import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend, FiCheckCircle, FiLogIn, FiPhone, FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { submitInquiry } from "../services/inquiryService";
import { formatPrice } from "../utils/format";

export default function InquiryModal({ open, property, onClose, onSuccess }) {
  const { user } = useAuth();
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState(
    `Hello, I am interested in "${property?.title}". Please connect with me to share more details or arrange a private viewing.`
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await submitInquiry({
        propertyId: property._id,
        phone,
        message,
      });
      toast.success("Interest registered! The seller has been notified.");
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to submit inquiry");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 backdrop-blur-md p-4 overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-gold max-w-lg w-full p-6 sm:p-8 relative my-8"
        >
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-white/50 hover:text-gold transition text-xl"
            aria-label="Close"
          >
            <FiX />
          </button>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-gold text-3xl" />
              </div>
              <h3 className="font-display text-2xl mb-2">Inquiry Sent Successfully</h3>
              <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
                Your interest has been shared with the property seller. They will reach out to you directly via email or phone.
              </p>
              <button onClick={handleClose} className="btn-gold">
                Done
              </button>
            </div>
          ) : !user ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto mb-4">
                <FiLogIn className="text-gold text-2xl" />
              </div>
              <h3 className="font-display text-2xl mb-2">Sign In to Inquire</h3>
              <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
                Please sign in to register your interest for <span className="text-gold font-medium">"{property.title}"</span>. The seller will receive your verified profile and contact details directly in their dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={`/login?redirect=/properties/${property._id}`}
                  onClick={handleClose}
                  className="btn-gold"
                >
                  Sign In
                </Link>
                <Link
                  to={`/register?role=buyer&redirect=/properties/${property._id}`}
                  onClick={handleClose}
                  className="btn-outline"
                >
                  Create Buyer Account
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-gold/20 pb-4 mb-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-1">
                  Express Interest
                </div>
                <h3 className="font-display text-2xl">{property.title}</h3>
                <div className="text-gold font-medium mt-1">
                  {formatPrice(property.price)}
                  {property.status === "rent" && <span className="text-xs text-white/50">/mo</span>}
                  <span className="text-white/50 text-xs ml-3">• {property.location}</span>
                </div>
              </div>

              <div>
                <label className="label-luxe">Your Details</label>
                <div className="glass p-3 text-sm text-white/80 space-y-1">
                  <div>
                    <span className="text-white/50">Name:</span> {user.name}
                  </div>
                  <div>
                    <span className="text-white/50">Email:</span> {user.email}
                  </div>
                </div>
              </div>

              <div>
                <label className="label-luxe flex items-center gap-1">
                  <FiPhone /> Contact Phone Number
                </label>
                <input
                  type="tel"
                  className="input-luxe"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="label-luxe flex items-center gap-1">
                  <FiMessageSquare /> Message to Seller
                </label>
                <textarea
                  rows={4}
                  className="input-luxe resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the seller your preferred viewing times, questions, or timeline..."
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button type="button" onClick={handleClose} className="btn-ghost" disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold" disabled={loading}>
                  <FiSend /> {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
