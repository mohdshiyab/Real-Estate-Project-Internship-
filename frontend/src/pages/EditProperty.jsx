import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PropertyForm from "../components/PropertyForm";
import { Spinner } from "../components/Loader";
import { getProperty, updateProperty } from "../services/propertyService";
import { useAuth } from "../context/AuthContext";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSeller } = useAuth();
  const [initial, setInitial] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/edit/${id}`);
      return;
    }

    getProperty(id)
      .then((data) => {
        // Verify owner permissions if property has an owner
        const ownerId = data.owner?._id || data.owner;
        const currentUserId = user._id || user.id;
        if (ownerId && currentUserId && ownerId.toString() !== currentUserId.toString()) {
          toast.error("You are not authorized to edit this listing");
          navigate(`/properties/${id}`);
          return;
        }
        setInitial(data);
      })
      .catch((e) => {
        toast.error(e.message);
        navigate("/properties");
      });
  }, [id, user, navigate]);

  const handle = async (data) => {
    setSubmitting(true);
    try {
      await updateProperty(id, data);
      toast.success("Property updated successfully");
      navigate(`/properties/${id}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!initial) return <Spinner className="min-h-[60vh]" />;

  return (
    <div className="section py-12 max-w-4xl">
      <div className="divider-gold mb-4" />
      <h1 className="text-4xl md:text-5xl mb-2">Edit <span className="gold-text italic">Listing</span></h1>
      <p className="text-white/60 mb-8">Update the details of your property.</p>
      <PropertyForm initial={initial} onSubmit={handle} submitting={submitting} submitLabel="Save Changes" />
    </div>
  );
}
