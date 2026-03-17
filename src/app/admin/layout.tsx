import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم - اتحاد الطلاب اليمنيين",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
