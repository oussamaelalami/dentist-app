import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Shield, Award } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="inline-flex items-center gap-2">
              <Award className="h-3 w-3" />
              <span>Trusted by 5000+ Patients</span>
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Your Smile,{" "}
                <span className="text-primary">Our Passion</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                Experience world-class dental care with Dr. Kabbage Med Hamza. 
                We combine advanced technology with a gentle, personalized approach 
                to give you the perfect smile you deserve.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="text-base">
                <Link href="/appointment">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="#services">View Our Services</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              {[
                { icon: CheckCircle, text: "15+ Years Experience" },
                { icon: Shield, text: "Safe & Sterile" },
                { icon: Award, text: "Certified Expert" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative mx-auto lg:mx-0">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 lg:max-w-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full">
                  {/* Decorative Elements */}
                  <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/20" />
                  <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/10" />
                  
                  {/* Central Icon */}
                  <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-16 w-16 text-primary-foreground"
                    >
                      <path d="M12 5.5c-1.5-2-4-2.5-6-1.5s-3 3.5-2.5 6c.5 2.5 3 6 8.5 11 5.5-5 8-8.5 8.5-11 .5-2.5-1-5-2.5-6s-4.5-.5-6 1.5z" />
                    </svg>
                  </div>

                  {/* Floating Cards */}
                  <div className="absolute left-4 top-8 rounded-xl bg-card p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">5000+</p>
                        <p className="text-xs text-muted-foreground">Happy Patients</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-12 right-4 rounded-xl bg-card p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Top Rated</p>
                        <p className="text-xs text-muted-foreground">Dental Clinic</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
