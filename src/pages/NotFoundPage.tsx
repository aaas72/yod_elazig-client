import { Link } from "react-router-dom";
import { useNotFoundData } from "@/hooks/useNotFoundData";
import FadeIn from "@/components/animations/FadeIn";

export default function NotFound() {
  const notFoundData = useNotFoundData();

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-red-900 via-red-800 to-red-900 text-white">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <FadeIn direction="up" className="w-full max-w-5xl">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex justify-center md:justify-start">
              <img
                src="/pattrens/404.svg"
                alt=""
                className="block w-xl md:max-w-3xl h-auto"
              />
            </div>
            <div className="text-center md:text-start">
              <h1 className="text-2xl md:text-3xl font-bold leading-none">
                {notFoundData.title}
              </h1>
              <p className="text-base md:text-lg text-white/80 mt-3 mb-8">
                {notFoundData.message}
              </p>
              <Link
                to="/"
                className="px-8 py-3 rounded-full bg-white text-red-900 font-semibold hover:bg-white/90 transition-colors"
              >
                {notFoundData.buttonText}
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
