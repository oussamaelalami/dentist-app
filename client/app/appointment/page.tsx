import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AppointmentForm } from "@/components/appointment-form"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Clock, MapPin, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Book Appointment | Dr. Kabbage Med Hamza",
  description: "Schedule your dental appointment with Dr. Kabbage Med Hamza. Easy online booking for all dental services.",
}

const benefits = [
  {
    icon: Shield,
    title: "Safe & Sterile Environment",
    description: "State-of-the-art sterilization and safety protocols",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Appointments available 6 days a week",
  },
  {
    icon: Phone,
    title: "24/7 Emergency Line",
    description: "Urgent dental care when you need it",
  },
  {
    icon: MapPin,
    title: "Central Location",
    description: "Easy access with ample parking",
  },
]

export default function AppointmentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">Book Online</p>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
                Schedule Your Appointment
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Take the first step towards a healthier smile. Fill out the form below 
                and we&apos;ll confirm your appointment shortly.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-5">
              {/* Form */}
              <div className="lg:col-span-3">
                <AppointmentForm />
              </div>

              {/* Sidebar */}
              <div className="space-y-6 lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="bg-primary p-6">
                    <h3 className="text-lg font-semibold text-primary-foreground">Why Choose Us?</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {benefits.map((benefit) => (
                        <div key={benefit.title} className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <benefit.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{benefit.title}</p>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-semibold text-foreground">Need Help?</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      If you have any questions or prefer to book by phone, don&apos;t hesitate to contact us.
                    </p>
                    <a 
                      href="tel:+212600000000" 
                      className="flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      +212 600 000 000
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
