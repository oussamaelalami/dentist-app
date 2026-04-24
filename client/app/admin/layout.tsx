"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { tokenManager } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CalendarDays, Settings, LogOut, Stethoscope } from "lucide-react"

const navLinks = [
  { href: "/admin/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/appointments",  label: "Appointments",  icon: CalendarDays },
  { href: "/admin/services",      label: "Services",      icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  const [mounted, setMounted] = useState(false)
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    setMounted(true)

    if (!isLoginPage && !tokenManager.isAuthenticated()) {
      router.replace("/admin/login")
      return
    }

    const admin = tokenManager.getAdmin()
    if (admin?.name) setAdminName(admin.name)
  }, [isLoginPage, router])

  const handleLogout = () => {
    tokenManager.logout()
    router.push("/admin/login")
  }

  if (isLoginPage) return <>{children}</>

  if (!mounted || !tokenManager.isAuthenticated()) return null

  const currentLabel = navLinks.find((l) => l.href === pathname)?.label ?? "Admin"

  return (
    <div className="flex h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r bg-card">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold leading-tight text-foreground">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t px-3 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6">
          <p className="text-sm font-medium text-foreground">{currentLabel}</p>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{adminName || "Admin"}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {adminName ? adminName[0].toUpperCase() : "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
