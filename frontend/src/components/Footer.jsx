import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-ink/80 backdrop-blur-xl">
      <div className="section py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center text-emerald-deep font-display font-bold text-xl">A</div>
            <div className="font-display text-xl">Aurum <span className="gold-text">Estates</span></div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Curating the world's most extraordinary residences for discerning clientele since 2010.
          </p>
          <div className="flex gap-3 mt-5">
            {[FiInstagram, FiTwitter, FiFacebook, FiLinkedin].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition">
                <I />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-gold uppercase tracking-[0.2em] text-xs mb-4">Explore</h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li><Link to="/" className="hover:text-gold">Home</Link></li>
            <li><Link to="/properties" className="hover:text-gold">Properties</Link></li>
            <li><Link to="/add" className="hover:text-gold">List Property</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold uppercase tracking-[0.2em] text-xs mb-4">Services</h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>Private Sales</li>
            <li>Luxury Rentals</li>
            <li>Investment Advisory</li>
            <li>Property Management</li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold uppercase tracking-[0.2em] text-xs mb-4">Contact</h4>
          <ul className="space-y-3 text-white/70 text-sm">
            <li className="flex items-start gap-3"><FiMapPin className="text-gold mt-1" /> 12 Park Lane, Mayfair, London</li>
            <li className="flex items-center gap-3"><FiPhone className="text-gold" /> +44 20 7946 0000</li>
            <li className="flex items-center gap-3"><FiMail className="text-gold" /> hello@aurumestates.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Aurum Estates. All rights reserved.
      </div>
    </footer>
  );
}
