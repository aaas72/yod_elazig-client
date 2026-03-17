"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { motion, useMotionValue } from "framer-motion";

interface FaqDocumentModalProps {
  isOpen: boolean;
  title: string;
  image: string;
  onClose: () => void;
}

const FaqDocumentModal: React.FC<FaqDocumentModalProps> = ({ isOpen, title, image, onClose }) => {
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [scaleDisplay, setScaleDisplay] = useState(1);

  useEffect(() => {
    const unsubscribe = scale.on("change", (v) => setScaleDisplay(v));
    return unsubscribe;
  }, [scale]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      scale.set(1);
      x.set(0);
      y.set(0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    const cur = scale.get();
    const next = Math.min(cur + 0.5, 5);
    const ratio = next / cur;
    x.set(x.get() * ratio);
    y.set(y.get() * ratio);
    scale.set(next);
  };

  const handleZoomOut = () => {
    const cur = scale.get();
    const next = Math.max(cur - 0.5, 1);
    if (next === 1) { x.set(0); y.set(0); }
    else {
      const ratio = next / cur;
      x.set(x.get() * ratio);
      y.set(y.get() * ratio);
    }
    scale.set(next);
  };

  const handleReset = () => { scale.set(1); x.set(0); y.set(0); };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center" dir="ltr">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm z-10">
        <p className="text-white text-sm font-medium truncate max-w-[60%]">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">{Math.round(scaleDisplay * 100)}%</span>
          <button onClick={handleZoomOut} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ZoomOut size={18} />
          </button>
          <button onClick={handleZoomIn} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ZoomIn size={18} />
          </button>
          <button onClick={handleReset} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <RotateCcw size={18} />
          </button>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="overflow-hidden w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
        <motion.img
          src={image}
          alt={title}
          style={{ scale, x, y }}
          drag
          dragMomentum={false}
          className="max-w-[90vw] max-h-[85vh] object-contain select-none"
        />
      </div>
    </div>
  );
};

export default FaqDocumentModal;
