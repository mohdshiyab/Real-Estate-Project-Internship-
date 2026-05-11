import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="section py-32 text-center">
      <div className="font-display text-8xl gold-text mb-4">404</div>
      <h1 className="text-3xl mb-3">This address doesn't exist</h1>
      <p className="text-white/60 mb-8">The page you're looking for has been moved or never existed.</p>
      <Link to="/" className="btn-gold">Return Home</Link>
    </div>
  );
}
