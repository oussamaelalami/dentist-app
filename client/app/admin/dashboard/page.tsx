"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchWithAuth } from "@/lib/auth"
import { API_BASE_URL } from "@/lib/config"
import { CalendarDays, Clock, CheckCircle, XCircle, Stethoscope } from "lucide-react"

interface Appointment {
  id: number
  status: string
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
  services: number
}

const statCards = (s: Stats) => [
  {
    label: "Total Appointments",
    value: s.total,
    icon: CalendarDays,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Pending",
    value: s.pending,
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Approved",
    value: s.approved,
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Rejected",
    value: s.rejected,
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Services",
    value: s.services,
    icon: Stethoscope,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [apptRes, servicesRes] = await Promise.all([
          fetchWithAuth("${API_BASE_URL}/admin/appointments"),
          fetch("${API_BASE_URL}/services"),
        ])

        if (!apptRes.ok) throw new Error("Failed to load appointments")
        if (!servicesRes.ok) throw new Error("Failed to load services")

        const appointments: Appointment[] = await apptRes.json()
        const services: unknown[] = await servicesRes.json()

        setStats({
          total: appointments.length,
          pending: appointments.filter((a) => a.status === "booked").length,
          approved: appointments.filter((a) => a.status === "approved").length,
          rejected: appointments.filter((a) => a.status === "rejected").length,
          services: services.length,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    }

    load()
  }, [])

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">Summary of clinic activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats
          ? statCards(stats).map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                  </CardTitle>
                  <div className={`rounded-md p-2 ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{value}</p>
                </CardContent>
              </Card>
            ))
          : Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}
