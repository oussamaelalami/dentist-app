import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary-foreground"
                >
                  <path d="M12 5.5c-1.5-2-4-2.5-6-1.5s-3 3.5-2.5 6c.5 2.5 3 6 8.5 11 5.5-5 8-8.5 8.5-11 .5-2.5-1-5-2.5-6s-4.5-.5-6 1.5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">Dr. Kabbage</span>
                <span className="text-xs text-muted-foreground">Med Hamza</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Providing exceptional dental care with a gentle touch. Your smile is our priority.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/#services", label: "Services" },
                { href: "/#testimonials", label: "Testimonials" },
                { href: "/appointment", label: "Book Appointment" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Our Services</h3>
            <ul className="space-y-3">
              {[
                "General Dentistry",
                "Teeth Whitening",
                "Dental Implants",
                "Orthodontics",
                "Cosmetic Dentistry",
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-muted-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">
                  123 Medical Center Blvd,<br />Casablanca, Morocco
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+212600000000" className="text-sm text-muted-foreground hover:text-primary">
                  +212 600 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:contact@drkabbage.ma" className="text-sm text-muted-foreground hover:text-primary">
                  contact@drkabbage.ma
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Mon - Fri: 9:00 AM - 6:00 PM<br />
                  Sat: 9:00 AM - 1:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dr. Kabbage Med Hamza. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
