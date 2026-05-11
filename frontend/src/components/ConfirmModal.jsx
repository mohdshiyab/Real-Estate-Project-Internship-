import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmModal({ open, title = "Are you sure?", message, onConfirm, onCancel, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-gold max-w-md w-full p-8 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
              <FiAlertTriangle className="text-gold text-2xl" />
            </div>
            <h3 className="font-display text-2xl mb-2">{title}</h3>
            <p className="text-white/70 mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={onCancel} className="btn-ghost" disabled={loading}>Cancel</button>
              <button onClick={onConfirm} disabled={loading}
                className="px-6 py-3 rounded-full bg-red-500/90 hover:bg-red-500 text-white font-semibold transition disabled:opacity-50">
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
