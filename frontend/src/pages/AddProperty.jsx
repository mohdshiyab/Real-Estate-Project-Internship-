import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropertyForm from "../components/PropertyForm";
import { createProperty } from "../services/propertyService";

export default function AddProperty() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handle = async (data) => {
    setSubmitting(true);
    try {
      const created = await createProperty(data);
      toast.success("Property listed successfully");
      navigate(`/properties/${created._id}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section py-12 max-w-4xl">
      <div className="divider-gold mb-4" />
      <h1 className="text-4xl md:text-5xl mb-2">List a <span className="gold-text italic">New Residence</span></h1>
      <p className="text-white/60 mb-8">Add your luxury property to the Aurum Estates collection.</p>
      <PropertyForm onSubmit={handle} submitting={submitting} submitLabel="Publish Listing" />
    </div>
  );
}
