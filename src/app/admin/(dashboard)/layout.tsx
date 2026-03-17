"use client";

import AdminProviders from "@/components/admin/AdminProviders";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminProviders>
  );
}
