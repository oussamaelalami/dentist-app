"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${API_BASE_URL}/services`)
        if (!response.ok) throw new Error("Failed to load services")
        const data = await response.json()
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching services:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchServices()
  }, [])
  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">Our Services</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Comprehensive Dental Care Solutions
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            From routine checkups to advanced procedures, we offer a full range of dental services 
            to keep your smile healthy and beautiful.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))
          ) : services.length > 0 ? (
            // Services cards
            services.map((service) => (
              <Card 
                key={service.id} 
                className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {service.duration && `${service.duration} min`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    {service.description || "Professional dental service"}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    ${service.price}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            // No services message
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No services available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
