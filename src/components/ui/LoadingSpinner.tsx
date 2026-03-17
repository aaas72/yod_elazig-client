"use client";

export default function LoadingSpinner({ size = "md", fullScreen = false }: { size?: "sm" | "md" | "lg"; fullScreen?: boolean }) {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };
  const spinner = (
    <div className={`${sizes[size]} border-4 border-red-200 border-t-red-600 rounded-full animate-spin`} />
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white  z-50">
        {spinner}
      </div>
    );
  }
  return <div className="flex items-center justify-center">{spinner}</div>;
}
