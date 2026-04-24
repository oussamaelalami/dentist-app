import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Patient since 2019",
    content: "Dr. Kabbage transformed my smile completely. The entire team made me feel comfortable throughout my treatment. I couldn't be happier with the results!",
    rating: 5,
  },
  {
    name: "Ahmed K.",
    role: "Patient since 2021",
    content: "The best dental experience I've ever had. Professional, gentle, and the clinic is state-of-the-art. Highly recommend for anyone looking for quality dental care.",
    rating: 5,
  },
  {
    name: "Fatima B.",
    role: "Patient since 2020",
    content: "I used to be terrified of dentists, but Dr. Kabbage's gentle approach changed everything. Now I actually look forward to my appointments!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-secondary/30 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">Testimonials</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            What Our Patients Say
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Don&apos;t just take our word for it. Here&apos;s what our patients have to say about their experience with us.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="relative overflow-hidden bg-card">
              <CardContent className="p-6">
                <Quote className="mb-4 h-8 w-8 text-primary/20" />
                
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="mb-6 text-muted-foreground leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
