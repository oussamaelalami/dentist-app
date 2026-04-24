"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Trash2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/auth"
import { API_BASE_URL } from "@/lib/config"

interface Appointment {
  id: number
  patient_name: string
  phone: string
  service_id: number
  date: string
  time: string
  status: string
}

interface Service {
  id: number
  name: string
}

type ActionState = { id: number; action: "approve" | "reject" | "delete" } | null

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "booked":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          Pending
        </Badge>
      )
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Approved
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          Rejected
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<ActionState>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/services`).then((r) => r.json()),
      fetchWithAuth(`${API_BASE_URL}/admin/appointments`).then((r) => {
        if (!r.ok)
          throw new Error(
            r.status === 401
              ? "Unauthorized — please log in again"
              : "Failed to load appointments"
          )
        return r.json()
      }),
    ])
      .then(([servicesData, appointmentsData]) => {
        setServices(servicesData)
        setAppointments(appointmentsData ?? [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const getServiceName = (id: number) =>
    services.find((s) => s.id === id)?.name ?? "Unknown"

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    setActionLoading({ id, action: status === "approved" ? "approve" : "reject" })
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/admin/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update appointment")
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setActionLoading({ id: deleteId, action: "delete" })
    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/admin/appointments/${deleteId}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error("Failed to delete appointment")
      setAppointments((prev) => prev.filter((a) => a.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setActionLoading(null)
    }
  }

  const isDeleting = actionLoading?.action === "delete"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Appointments</h2>
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Loading…"
            : `${appointments.length} appointment${appointments.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Patient</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No appointments yet.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((apt) => {
                  const isActing = actionLoading?.id === apt.id
                  return (
                    <TableRow key={apt.id}>
                      <TableCell className="pl-4 font-medium text-foreground">
                        {apt.patient_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {apt.phone}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getServiceName(apt.service_id)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {apt.date} · {apt.time}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={apt.status} />
                      </TableCell>
                      <TableCell className="pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-green-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-30"
                            disabled={isActing || apt.status === "approved"}
                            onClick={() => updateStatus(apt.id, "approved")}
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                            disabled={isActing || apt.status === "rejected"}
                            onClick={() => updateStatus(apt.id, "rejected")}
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                            disabled={isActing}
                            onClick={() => setDeleteId(apt.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove the appointment. This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
