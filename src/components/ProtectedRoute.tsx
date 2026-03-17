"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { hasPageAccess } from "@/constants/permissions";
import AccessDenied from "@/components/admin/AccessDenied";

interface ProtectedRouteProps {
  children: React.ReactNode;
  path?: string;
}

export default function ProtectedRoute({ children, path = "/admin" }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!hasPageAccess(user?.role, path)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
