"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { AuthProvider, useAuth } from "@/lib/auth/AuthProvider";
import AuthLoadingScreen from "@/components/admin/AuthLoadingScreen";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // The middleware already gates access to this layout server-side, so this
  // spinner only ever appears briefly — e.g. right after a client-side
  // navigation, or if the session is still being confirmed with Supabase.
  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 px-5 py-8 md:px-10 md:py-12">{children}</main>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
