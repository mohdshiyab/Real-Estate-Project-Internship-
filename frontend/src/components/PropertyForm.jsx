import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSave, FiX } from "react-icons/fi";

const TYPES = ["Villa", "Apartment", "House", "Penthouse", "Studio", "Land"];

const empty = {
  title: "", description: "", price: "", location: "",
  propertyType: "Villa", bedrooms: 0, bathrooms: 0, area: 0,
  status: "sale", image: "", contactNumber: "",
};

export default function PropertyForm({ initial, onSubmit, submitting, submitLabel = "Save Property" }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm({ ...empty, ...initial });
  }, [initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.length > 200) e.title = "Max 200 characters";
    if (!form.location.trim()) e.location = "Location is required";
    if (form.price === "" || isNaN(form.price) || Number(form.price) < 0) e.price = "Valid price required";
    if (form.image && !/^https?:\/\//.test(form.image)) e.image = "Must be a valid URL";
    if (form.description && form.description.length > 4000) e.description = "Max 4000 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: Number(form.area) || 0,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      onSubmit={submit} className="glass-gold p-8 space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="label-luxe">Title *</label>
          <input className="input-luxe" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Hilltop Villa with Private Vineyard" />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="label-luxe">Location *</label>
          <input className="input-luxe" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, Country" />
          {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
        </div>
        <div>
          <label className="label-luxe">Price (USD) *</label>
          <input type="number" min="0" className="input-luxe" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" />
          {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="label-luxe">Property Type</label>
          <select className="input-luxe" value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label-luxe">Status</label>
          <select className="input-luxe" value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
        <div>
          <label className="label-luxe">Bedrooms</label>
          <input type="number" min="0" className="input-luxe" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
        </div>
        <div>
          <label className="label-luxe">Bathrooms</label>
          <input type="number" min="0" className="input-luxe" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
        </div>
        <div>
          <label className="label-luxe">Area (sq ft)</label>
          <input type="number" min="0" className="input-luxe" value={form.area} onChange={(e) => set("area", e.target.value)} />
        </div>
        <div>
          <label className="label-luxe">Contact Number</label>
          <input className="input-luxe" value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} placeholder="+1 555 0123" />
        </div>
        <div className="md:col-span-2">
          <label className="label-luxe">Image URL</label>
          <input className="input-luxe" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" />
          {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
          {form.image && !errors.image && (
            <img src={form.image} alt="preview" className="mt-3 w-full h-48 object-cover rounded-xl border border-gold/20" />
          )}
        </div>
        <div className="md:col-span-2">
          <label className="label-luxe">Description</label>
          <textarea rows={5} className="input-luxe resize-none" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell the story of this residence…" />
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-gold/20">
        <button type="button" onClick={() => window.history.back()} className="btn-ghost"><FiX /> Cancel</button>
        <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-60">
          <FiSave /> {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </motion.form>
  );
}
