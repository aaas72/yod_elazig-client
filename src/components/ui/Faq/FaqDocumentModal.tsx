import React, { useEffect, useState, useRef } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { motion, useMotionValue } from "framer-motion";

interface FaqDocumentModalProps {
  isOpen: boolean;
  title: string;
  image: string;
  onClose: () => void;
}

const FaqDocumentModal: React.FC<FaqDocumentModalProps> = ({
  isOpen,
  title,
  image,
  onClose,
}) => {
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [scaleDisplay, setScaleDisplay] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

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
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    const oldScale = scale.get();
    const newScale = Math.min(oldScale + 0.5, 5);
    const ratio = newScale / oldScale;
    
    // Zoom from center (x, y are relative to center)
    x.set(x.get() * ratio);
    y.set(y.get() * ratio);
    scale.set(newScale);
  };

  const handleZoomOut = () => {
    const oldScale = scale.get();
    const newScale = Math.max(oldScale - 0.5, 1);
    const ratio = newScale / oldScale;

    if (newScale === 1) {
      x.set(0);
      y.set(0);
    } else {
      x.set(x.get() * ratio);
      y.set(y.get() * ratio);
    }
    scale.set(newScale);
  };

  const handleReset = () => {
    scale.set(1);
    x.set(0);
    y.set(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Mouse position relative to center of the container
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const oldScale = scale.get();
    const oldX = x.get();
    const oldY = y.get();

    const delta = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(oldScale + delta, 1), 5);

    if (newScale === oldScale) return;

    if (newScale === 1) {
      x.set(0);
      y.set(0);
      scale.set(1);
      return;
    }

    const ratio = newScale / oldScale;

    // Calculate new position to keep the point under mouse fixed
    // newX = mouseX - (mouseX - oldX) * ratio
    const newX = mouseX - (mouseX - oldX) * ratio;
    const newY = mouseY - (mouseY - oldY) * ratio;

    scale.set(newScale);
    x.set(newX);
    y.set(newY);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-auto h-auto max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border-2 border-red-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 gap-4">
          <h3 className="font-semibold text-gray-900 truncate flex-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              disabled={scaleDisplay <= 1}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium w-12 text-center text-gray-600">
              {Math.round(scaleDisplay * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scaleDisplay >= 5}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div
          ref={containerRef}
          onWheel={handleWheel}
          className="p-4 overflow-hidden flex items-center justify-center bg-gray-50 cursor-grab active:cursor-grabbing relative min-h-[200px]"
        >
          <motion.img
            src={image}
            alt={title}
            drag
            style={{ scale, x, y }}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-sm origin-center"
          />
        </div>
      </div>
    </div>
  );
};

export default FaqDocumentModal;
