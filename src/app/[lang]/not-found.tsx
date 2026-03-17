import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-700">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 mt-2 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة
        </p>
        <Link
          href="/ar"
          className="inline-block bg-red-700 text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
