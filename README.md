# 🏰 Aurum Estates — Luxury Real Estate & Multi-Estate Platform

A full-stack, enterprise-grade **Real Estate & Land Estate Platform** built with **React, Node.js, Express, MongoDB Atlas, and Tailwind CSS**. 

Aurum Estates caters to both **Dealers / Sellers** looking to list exclusive residences, land plots, private islands, and commercial properties, and **Buyers / Customers** looking to browse, filter by criteria (e.g. price low to high), inspect live GPS maps, calculate travel distance in kilometers, and submit private viewing inquiries.

📂 **GitHub Repository:** [https://github.com/mohdshiyab/Real-Estate-Project-Internship-](https://github.com/mohdshiyab/Real-Estate-Project-Internship-)

🌐 **Live Application (Frontend):** [https://real-estate-project-internship.vercel.app](https://real-estate-project-internship.vercel.app)

🚀 **Live API (Backend):** [https://aurum-estates-api.onrender.com](https://aurum-estates-api.onrender.com)

---

## ✨ Core Features & Workflows

### 1. 👥 Role-Based Authentication & Workflows
- **Seller / Dealer Portal**:
  - Secure registration & sign-in as a verified Dealer / Seller.
  - **Private Seller Dashboard (`/seller/dashboard`)**:
    - **Isolated Listings**: Sellers view and manage **only their own listed properties**.
    - **Customer Inquiries & Leads**: Real-time tracking of every customer who showed interest in their properties, including customer name, verified email, direct phone number, custom viewing requests, and timestamp.
    - **Lead Status Management**: Toggle inquiry status between *"Needs Contact"* and *"Contacted"*, with 1-click call and email buttons.
- **Buyer / Customer Experience**:
  - Secure registration & sign-in as a Buyer / Customer.
  - **Full Portfolio Access**: Browse all luxury residences, plots, islands, and commercial estates.
  - **Dynamic Requirement Filtering & Sorting**: Sort by *Price: Low to High*, *Price: High to Low*, *Newest*, or *Most Bedrooms*, plus location, estate category, price range, and bedrooms.
  - **Express Interest / Private Viewing Inquiries**: Submit 1-click inquiries on any property to notify the dealer immediately.
  - **Buyer Dashboard (`/buyer/dashboard`)**: Track all submitted inquiries with the assigned dealer's contact information.

---

### 2. 🏝️ Multi-Estate Support (Residences, Land, Islands & Commercial)
The platform supports all types of real estate, with dedicated sections for listing and browsing:
- **🏰 Luxury Residences**: Villas, Mansions, Penthouses, Historic Townhouses, Waterfront Houses, and Apartments.
- **🏝️ Land, Plots & Islands**: Oceanfront Development Plots, Private Islands, Viticultural Vineyards & Wine Estates, Farmland & Agricultural Holdings, and Commercial Land.
  - *Adaptive Land Specifications*: Automatically switches to Land Area (Acres, Sq Ft, Hectares, Sq Metres) and Zoning / Land Use, removing irrelevant bedroom/bathroom requirements.
- **🏢 Commercial & Hospitality**: Landmark Towers, Boutique Resorts & Luxury Hotels, Corporate Office Spaces, and Warehouses.

---

### 3. 📍 GPS Location Capture & Real-Time Distance Calculator
- **GPS Coordinates Capture for Sellers**:
  - When listing an estate, sellers can click **"📍 Use Current GPS Location"** to pinpoint exact coordinates using the browser's Geolocation API.
  - Includes **automatic reverse geocoding** (via OpenStreetMap) to suggest city, state, and country.
- **Interactive Map & Distance in Kilometers for Buyers**:
  - **Interactive Map**: Live OpenStreetMap frame centered on the property with custom pin markers.
  - **Real-Time Distance Calculator**: Buyers can click **"Calculate Distance from My Place"** to compute the exact distance between their current location and the property in **kilometers (km)** using the **Haversine formula**.
  - **Turn-by-Turn Navigation**: Direct Google Maps directions link from the customer's coordinates to the estate.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Axios, React Router v6, React Toastify, React Icons, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB Atlas / Mongoose, JWT (jsonwebtoken), bcryptjs, CORS, Morgan, dotenv |
| **Mapping & Location** | HTML5 Geolocation API, OpenStreetMap Embed, Nominatim Reverse Geocoding, Haversine Distance Formula |

---

## 📁 Project Structure

```text
Real-Estate-Project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with DNS resolver fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   ├── inquiryController.js  # Customer interest & seller lead management
│   │   └── propertyController.js # Multi-estate CRUD, filtering & ownership
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── models/
│   │   ├── Inquiry.js            # Buyer inquiry & lead tracking schema
│   │   ├── Property.js           # Multi-estate schema (residential, land, commercial, GPS)
│   │   └── User.js               # Seller & Buyer user schema with bcrypt hashing
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   ├── inquiryRoutes.js      # /api/inquiries/*
│   │   └── propertyRoutes.js     # /api/properties/*
│   ├── seed.js                   # Demo data seeder (properties, dealer, buyer, inquiries)
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx  # Deletion confirmation modal
│   │   │   ├── Footer.jsx        # Luxury footer
│   │   │   ├── InquiryModal.jsx  # Customer viewing request modal
│   │   │   ├── Loader.jsx        # Skeletons & loading spinners
│   │   │   ├── Navbar.jsx        # Role-aware responsive navigation bar
│   │   │   ├── PropertyCard.jsx  # Adaptive estate card (Residences vs. Land)
│   │   │   └── PropertyForm.jsx  # Multi-category listing form with GPS capture
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user authentication & role state
│   │   ├── pages/
│   │   │   ├── AddProperty.jsx   # Seller-only property listing page
│   │   │   ├── BuyerDashboard.jsx# Customer inquiries & dealer contact tracker
│   │   │   ├── EditProperty.jsx  # Owner-restricted property edit page
│   │   │   ├── Home.jsx          # Luxury landing page with portfolio categories
│   │   │   ├── Login.jsx         # Sign in with 1-click demo logins
│   │   │   ├── NotFound.jsx      # 404 page
│   │   │   ├── Properties.jsx    # Collection with category tabs, filters & sorting
│   │   │   ├── PropertyDetails.jsx # Details, interactive map & distance in km
│   │   │   └── Register.jsx      # Role selection (Seller/Dealer vs. Buyer)
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with JWT bearer interceptor
│   │   │   ├── authService.js    # Auth API methods
│   │   │   ├── inquiryService.js # Inquiries API methods
│   │   │   └── propertyService.js# Property API methods
│   │   ├── utils/
│   │   │   └── format.js         # Price, date & Haversine distance utilities
│   │   ├── App.jsx               # Routes & AuthProvider
│   │   ├── index.css             # Luxury gold & emerald theme styles
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mohdshiyab/Real-Estate-Project-Internship-.git
cd Real-Estate-Project-Internship-
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure your `backend/.env` file:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.1nxgtjt.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=aurum_estates_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Seed the database with sample properties, private islands, vineyards, demo accounts, and inquiries:

```bash
npm run seed
```

Start the backend development server:

```bash
npm run dev
```

Server runs on: **`http://localhost:5001`**

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
```

Configure your `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend Vite dev server:

```bash
npm run dev
```

App runs on: **`http://localhost:5173`**

---

## 🔑 Demo Accounts for Instant Testing

You can use the 1-click demo login buttons on the **Sign In** page (`/login`) or enter:

| Persona | Role | Email | Password | Access & Capabilities |
|---|---|---|---|---|
| **Alexander Vance** | **Seller / Dealer** | `dealer@aurumestates.com` | `password123` | Lists estates, accesses Seller Dashboard (`/seller/dashboard`), sees only his listings & manages customer inquiries with contact details |
| **Sophia Sterling** | **Buyer / Customer** | `buyer@aurumestates.com` | `password123` | Browses all estates, filters by price/type/category, calculates distance in km & tracks viewing inquiries in Buyer Dashboard (`/buyer/dashboard`) |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new Seller or Buyer.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Get current user profile (Protected).

### Properties (`/api/properties`)
- `GET /api/properties` — Browse all estates (Supports: `category`, `type`, `status`, `minPrice`, `maxPrice`, `bedrooms`, `location`, `sort`).
- `GET /api/properties/my-listings` — Returns only properties owned by logged-in seller (Protected, Seller only).
- `GET /api/properties/:id` — Get full property details with owner info.
- `POST /api/properties` — Create property with GPS coordinates & category (Protected, Seller only).
- `PUT /api/properties/:id` — Update property (Protected, Owner only).
- `DELETE /api/properties/:id` — Delete property (Protected, Owner only).

### Inquiries & Leads (`/api/inquiries`)
- `POST /api/inquiries` — Buyer registers interest / requests private viewing (Protected).
- `GET /api/inquiries/seller` — Seller fetches all interested customers for their listings (Protected, Seller only).
- `GET /api/inquiries/buyer` — Buyer fetches their submitted inquiries and dealer contacts (Protected).
- `PATCH /api/inquiries/:id/status` — Seller updates status (`pending` / `contacted` / `closed`) (Protected, Seller only).

---

## 🔒 Security Best Practices
- **Password Protection**: Salted and hashed using `bcryptjs` before database persistence.
- **JWT Protection**: Stateless authorization with bearer tokens attached via Axios request interceptors.
- **Route Authorization**: Server-side role validation prevents buyers from creating/deleting listings and prevents sellers from tampering with other dealers' estates.
- **Git Security**: Sensitive `.env` files are kept strictly untracked by `.gitignore`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
