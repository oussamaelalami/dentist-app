"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/#testimonials", label: "Testimonials" },
    { href: "/#contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
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

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a href="tel:+212600000000" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <Phone className="h-4 w-4" />
            <span>+212 600 000 000</span>
          </a>
          <Button asChild>
            <Link href="/appointment">Book Appointment</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="container mx-auto flex flex-col gap-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <a href="tel:+212600000000" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+212 600 000 000</span>
            </a>
            <Button asChild className="w-full">
              <Link href="/appointment" onClick={() => setIsOpen(false)}>
                Book Appointment
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
