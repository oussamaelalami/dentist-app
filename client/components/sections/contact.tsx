import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: "+212 600 000 000",
    action: "tel:+212600000000",
  },
  {
    icon: Mail,
    title: "Email",
    details: "contact@drkabbage.ma",
    action: "mailto:contact@drkabbage.ma",
  },
  {
    icon: MapPin,
    title: "Location",
    details: "123 Medical Center Blvd, Casablanca, Morocco",
    action: "https://maps.google.com",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: "Mon-Fri: 9AM-6PM | Sat: 9AM-1PM",
    action: null,
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">Contact Us</p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                Ready to Transform Your Smile?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Take the first step towards a healthier, more beautiful smile. 
                Contact us today to schedule your consultation or appointment.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((item) => (
                <Card key={item.title} className="bg-secondary/50">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      {item.action ? (
                        <a href={item.action} className="text-sm text-muted-foreground hover:text-primary">
                          {item.details}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.details}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button size="lg" asChild>
              <Link href="/appointment">
                Book Your Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Right Content - Map Placeholder */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary lg:aspect-[4/3]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <p className="mb-2 font-semibold text-foreground">Visit Our Clinic</p>
                <p className="text-sm text-muted-foreground">123 Medical Center Blvd</p>
                <p className="text-sm text-muted-foreground">Casablanca, Morocco</p>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute left-4 top-4 h-24 w-24 rounded-full border-2 border-dashed border-primary/20" />
            <div className="absolute bottom-4 right-4 h-32 w-32 rounded-full border-2 border-dashed border-primary/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
