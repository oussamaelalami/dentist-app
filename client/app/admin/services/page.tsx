"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { fetchWithAuth } from "@/lib/auth"
import { API_BASE_URL } from "@/lib/config"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
}

interface FormState {
  name: string
  description: string
  price: string
  duration: string
}

const emptyForm: FormState = { name: "", description: "", price: "", duration: "" }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Service | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    fetch("${API_BASE_URL}/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(() => setError("Failed to load services"))
      .finally(() => setLoading(false))
  }, [])

  const openAdd = () => {
    setEditTarget(null)
    setForm(emptyForm)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditTarget(service)
    setForm({
      name: service.name,
      description: service.description ?? "",
      price: service.price.toString(),
      duration: service.duration?.toString() ?? "",
    })
    setFormError(null)
    setFormOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      setFormError("Name and price are required")
      return
    }

    setSaving(true)
    setFormError(null)

    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      duration: form.duration ? Number(form.duration) : 30,
    }

    try {
      if (editTarget) {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/admin/services/${editTarget.id}`,
          { method: "PUT", body: JSON.stringify(body) }
        )
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to update")
        }
        setServices((prev) =>
          prev.map((s) => (s.id === editTarget.id ? { ...s, ...body } : s))
        )
      } else {
        const res = await fetchWithAuth("${API_BASE_URL}/admin/services", {
          method: "POST",
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to create")
        }
        const created: Service = await res.json()
        setServices((prev) => [...prev, created])
      }
      setFormOpen(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setDeleting(true)
    setDeleteError(null)

    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/admin/services/${deleteId}`,
        { method: "DELETE" }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete")
      }
      setServices((prev) => prev.filter((s) => s.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Services</h2>
          <p className="text-sm text-muted-foreground">
            {services.length} service{services.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
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
                <TableHead className="pl-4">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No services yet. Add your first one.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="pl-4 font-medium text-foreground">
                      {service.name}
                    </TableCell>
                    <TableCell className="max-w-xs text-muted-foreground">
                      <span className="block truncate">
                        {service.description || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground">
                      ${service.price}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {service.duration ?? 30} min
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            setDeleteError(null)
                            setDeleteId(service.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {formError && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {formError}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="svc-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="svc-name"
                placeholder="e.g. Teeth Whitening"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="svc-desc">Description</Label>
              <Input
                id="svc-desc"
                placeholder="Short description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="svc-price">
                  Price ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="svc-price"
                  type="number"
                  min={0}
                  placeholder="150"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-duration">Duration (min)</Label>
                <Input
                  id="svc-duration"
                  type="number"
                  min={5}
                  placeholder="30"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editTarget ? "Save Changes" : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This will permanently remove the service. Existing appointments linked
            to it will remain in the database.
          </p>

          {deleteError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {deleteError}
            </p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
