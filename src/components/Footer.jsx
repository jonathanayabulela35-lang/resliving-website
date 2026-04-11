import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Get Started", path: "/get-started" },
  ],
  Company: [
    { label: "About", path: "/how-it-works" },
    { label: "Contact", path: "/contact" },
  ],
  Support: [
    { label: "Manager Login", path: "/manager-login" },
    { label: "Contact Us", path: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Res<span className="text-destructive">Living</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Simplifying student accommodation management with smart technology, secure access, and seamless communication.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4 text-white/80">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} ResLiving. All rights reserved.
            </p>
            <p className="text-sm text-white/40">
              Students & Security use the mobile app · Managers use this website
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}