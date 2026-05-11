// Seed script — populates MongoDB with sample properties
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Property = require("./models/Property");

const SEED = [
  {
    title: "Emerald Bay Infinity Villa",
    description: "Architectural masterpiece overlooking the bay. Floor-to-ceiling glass, private infinity pool, and a 200m² rooftop terrace finished in travertine.",
    price: 4850000, location: "Malibu, California", propertyType: "Villa",
    bedrooms: 6, bathrooms: 7, area: 8200, status: "sale",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+1 (310) 555-0142",
  },
  {
    title: "The Gold Leaf Penthouse",
    description: "Crowning a landmark tower, this duplex penthouse offers 360° skyline views, private elevator, bespoke gold-leaf interiors.",
    price: 12500, location: "Manhattan, New York", propertyType: "Penthouse",
    bedrooms: 4, bathrooms: 5, area: 5400, status: "rent",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+1 (212) 555-0199",
  },
  {
    title: "Casa Verde Modern Retreat",
    description: "Serene hillside retreat hidden in tropical gardens. Open-plan living, organic stone finishes, 25m lap pool.",
    price: 1980000, location: "Tulum, Mexico", propertyType: "House",
    bedrooms: 5, bathrooms: 5, area: 4600, status: "sale",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+52 984 555 0177",
  },
  {
    title: "Belgravia Townhouse",
    description: "Grade II listed Georgian townhouse, restored with contemporary craftsmanship. Private mews garage and walled garden.",
    price: 9200000, location: "Belgravia, London", propertyType: "House",
    bedrooms: 5, bathrooms: 4, area: 6100, status: "sale",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+44 20 7555 0118",
  },
  {
    title: "Sky Loft Apartment",
    description: "Sun-drenched loft on the 42nd floor with double-height ceilings and panoramic park views.",
    price: 8400, location: "Chicago, Illinois", propertyType: "Apartment",
    bedrooms: 3, bathrooms: 3, area: 2800, status: "rent",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+1 (312) 555-0144",
  },
  {
    title: "Côte d'Azur Estate",
    description: "Mediterranean stone estate with vineyards, olive groves, and a private path to the cove below.",
    price: 14800000, location: "Saint-Tropez, France", propertyType: "Villa",
    bedrooms: 8, bathrooms: 9, area: 11200, status: "sale",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+33 4 94 55 01 88",
  },
];

(async () => {
  await connectDB();
  await Property.deleteMany({});
  await Property.insertMany(SEED);
  console.log(`✅ Seeded ${SEED.length} properties`);
  await mongoose.disconnect();
})();
