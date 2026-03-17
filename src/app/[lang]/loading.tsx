export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-700 rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
}
