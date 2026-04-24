"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Mail, Phone, Stethoscope, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { API_BASE_URL } from "@/lib/config"

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

interface Service {
  id: number
  name: string
}

export function AppointmentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  })

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`)
        if (!response.ok) throw new Error("Failed to load services")
        const data = await response.json()
        setServices(data)
      } catch (err) {
        console.error("Error fetching services:", err)
      }
    }
    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required")
      return
    }
    if (!formData.email || !formData.phone) {
      setError("Email and phone number are required")
      return
    }
    if (!formData.service) {
      setError("Please select a service")
      return
    }
    if (!formData.date) {
      setError("Please select a date")
      return
    }
    if (!formData.time) {
      setError("Please select a time")
      return
    }

    setIsLoading(true)

    try {
      const convertTo24Hour = (time: string) => {
        const [timeOnly, meridiem] = time.split(" ")
        let [hours, minutes] = timeOnly.split(":").map(Number)
        if (meridiem === "PM" && hours !== 12) hours += 12
        else if (meridiem === "AM" && hours === 12) hours = 0
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
      }

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          service_id: parseInt(formData.service),
          date: formData.date,
          time: convertTo24Hour(formData.time),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to book appointment")
      }

      const patientName = `${formData.firstName} ${formData.lastName}`
      const serviceName =
        services.find((s) => s.id.toString() === formData.service)?.name ?? "N/A"

      const message =
        `Hello Doctor, I would like to confirm my appointment:\n\n` +
        `Name: ${patientName}\n` +
        `Phone: ${formData.phone}\n` +
        `Service: ${serviceName}\n` +
        `Date: ${formData.date}\n` +
        `Time: ${formData.time}`

      window.location.href = `https://wa.me/212665919550?text=${encodeURIComponent(message)}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
        <CardDescription>
          Please fill out the form below with your details and preferred appointment time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="h-4 w-4 text-primary" />
              Personal Information
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              Contact Information
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+212 600 000 000"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Stethoscope className="h-4 w-4 text-primary" />
              Service Required
            </h4>
            <div className="space-y-2">
              <Label htmlFor="service">Select Service</Label>
              <Select
                value={formData.service}
                onValueChange={(value) => setFormData({ ...formData, service: value })}
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              Preferred Date & Time
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData({ ...formData, time: value })}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        <span className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {time}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Notes (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your dental concerns or any special requirements..."
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Booking..." : "Request Appointment"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By submitting this form, you agree to our privacy policy. 
            We&apos;ll contact you to confirm your appointment.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
