// Seed script — populates MongoDB with sample properties, demo seller, demo buyer, and inquiries
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Property = require("./models/Property");
const User = require("./models/User");
const Inquiry = require("./models/Inquiry");

const SEED = [
  {
    title: "Emerald Bay Infinity Villa",
    description: "Architectural masterpiece overlooking the bay. Floor-to-ceiling glass, private infinity pool, and a 200m² rooftop terrace finished in travertine.",
    price: 4850000, location: "Malibu, California", propertyType: "Villa",
    latitude: 34.0259, longitude: -118.7798,
    bedrooms: 6, bathrooms: 7, area: 8200, status: "sale",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+1 (310) 555-0142",
  },
  {
    title: "The Gold Leaf Penthouse",
    description: "Crowning a landmark tower, this duplex penthouse offers 360° skyline views, private elevator, bespoke gold-leaf interiors.",
    price: 12500, location: "Manhattan, New York", propertyType: "Penthouse",
    latitude: 40.7831, longitude: -73.9712,
    bedrooms: 4, bathrooms: 5, area: 5400, status: "rent",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+1 (212) 555-0199",
  },
  {
    title: "Casa Verde Modern Retreat",
    description: "Serene hillside retreat hidden in tropical gardens. Open-plan living, organic stone finishes, 25m lap pool.",
    price: 1980000, location: "Tulum, Mexico", propertyType: "House",
    latitude: 20.2114, longitude: -87.4654,
    bedrooms: 5, bathrooms: 5, area: 4600, status: "sale",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+52 984 555 0177",
  },
  {
    title: "Belgravia Townhouse",
    description: "Grade II listed Georgian townhouse, restored with contemporary craftsmanship. Private mews garage and walled garden.",
    price: 9200000, location: "Belgravia, London", propertyType: "House",
    latitude: 51.4981, longitude: -0.1558,
    bedrooms: 5, bathrooms: 4, area: 6100, status: "sale",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+44 20 7555 0118",
  },
  {
    title: "Sky Loft Apartment",
    description: "Sun-drenched loft on the 42nd floor with double-height ceilings and panoramic park views.",
    price: 8400, location: "Chicago, Illinois", propertyType: "Apartment",
    latitude: 41.8781, longitude: -87.6298,
    bedrooms: 3, bathrooms: 3, area: 2800, status: "rent",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+1 (312) 555-0144",
  },
  {
    title: "Côte d'Azur Estate",
    description: "Mediterranean stone estate with vineyards, olive groves, and a private path to the cove below.",
    price: 14800000, location: "Saint-Tropez, France", propertyType: "Villa",
    estateCategory: "residential",
    latitude: 43.2677, longitude: 6.6407,
    bedrooms: 8, bathrooms: 9, area: 11200, status: "sale",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+33 4 94 55 01 88",
  },
  {
    title: "Isla Serena Private Island",
    description: "Unrivalled 45-acre private island sanctuary in the Exumas with three white sand beaches, natural deep-water anchorage, and approved plans for a luxury eco-compound.",
    price: 18500000, location: "Exuma Cays, Bahamas", propertyType: "Private Island",
    estateCategory: "land",
    area: 45, landAreaUnit: "acres", zoning: "Private Island / Luxury Resort",
    status: "sale",
    latitude: 24.3167, longitude: -76.5833,
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+1 (242) 555-0191",
  },
  {
    title: "Valle d'Oro Vineyard & Wine Estate",
    description: "World-class 85-acre viticultural estate featuring 42 planted acres of prized Cabernet Sauvignon, organic certified soils, and underground barrel aging caves.",
    price: 12800000, location: "Napa Valley, California", propertyType: "Vineyard",
    estateCategory: "land",
    area: 85, landAreaUnit: "acres", zoning: "Agricultural / Viticulture",
    status: "sale",
    latitude: 38.2975, longitude: -122.2869,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+1 (707) 555-0177",
  },
  {
    title: "Costa Smeralda Oceanfront Plot",
    description: "Breathtaking 12,000 sq m oceanfront development land perched above turquoise Mediterranean waters. Architectural permits secured for a signature cliffside residence.",
    price: 6200000, location: "Porto Cervo, Sardinia, Italy", propertyType: "Plot",
    estateCategory: "land",
    area: 12000, landAreaUnit: "sq m", zoning: "Residential Prime",
    status: "sale",
    latitude: 41.1352, longitude: 9.5338,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+39 0789 555 012",
  },
  {
    title: "The Grand Luminary Commercial Tower",
    description: "Flagship commercial tower located in the heart of Downtown. Triple-height glass atrium, LEED Platinum certification, and high-yield institutional tenancy.",
    price: 42000000, location: "Downtown Dubai, UAE", propertyType: "Commercial Building",
    estateCategory: "commercial",
    area: 65000, landAreaUnit: "sq ft", zoning: "Commercial / High-Rise",
    status: "sale",
    latitude: 25.1972, longitude: 55.2744,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    contactNumber: "+971 4 555 0148",
  },
];

(async () => {
  try {
    await connectDB();

    // 1. Create or get Demo Seller & Buyer
    let seller = await User.findOne({ email: "dealer@aurumestates.com" });
    if (!seller) {
      seller = await User.create({
        name: "Alexander Vance",
        email: "dealer@aurumestates.com",
        password: "password123",
        role: "seller",
        phone: "+1 (555) 019-8833",
        agency: "Vance Luxury Properties",
      });
      console.log("👤 Created demo seller: dealer@aurumestates.com / password123");
    }

    let buyer = await User.findOne({ email: "buyer@aurumestates.com" });
    if (!buyer) {
      buyer = await User.create({
        name: "Sophia Sterling",
        email: "buyer@aurumestates.com",
        password: "password123",
        role: "buyer",
        phone: "+1 (555) 392-1144",
      });
      console.log("👤 Created demo buyer: buyer@aurumestates.com / password123");
    }

    // 2. Clear old demo properties and attach owner
    await Property.deleteMany({});
    const propertiesWithOwner = SEED.map((p) => ({
      ...p,
      owner: seller._id,
    }));
    const createdProps = await Property.insertMany(propertiesWithOwner);
    console.log(`✅ Seeded ${createdProps.length} properties assigned to demo seller`);

    // 3. Clear and seed sample inquiries
    await Inquiry.deleteMany({});
    await Inquiry.create([
      {
        property: createdProps[0]._id,
        seller: seller._id,
        buyer: buyer._id,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        buyerPhone: buyer.phone,
        message: "Hello Alexander, I am extremely interested in the Emerald Bay Villa. Can we schedule a private VIP tour this Saturday?",
        status: "pending",
      },
      {
        property: createdProps[1]._id,
        seller: seller._id,
        buyer: buyer._id,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        buyerPhone: buyer.phone,
        message: "Inquiring about lease terms and concierge services for The Gold Leaf Penthouse.",
        status: "contacted",
      },
    ]);
    console.log("📬 Seeded 2 sample inquiries for seller dashboard");

    await mongoose.disconnect();
    console.log("✨ Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
})();
