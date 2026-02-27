import React, { useState, useEffect } from "react";
import { resolveImage } from "@/utils/resolveImage";

const FALLBACK_IMG = "/imgs/HeroImgs/main-bg.jpg";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  layout?: "fill" | "fixed" | "intrinsic" | "responsive";
  objectFit?: React.CSSProperties["objectFit"];
  fill?: boolean;
  priority?: boolean;
  quality?: number | string;
  placeholder?: string;
  blurDataURL?: string;
  loader?: any;
  unoptimized?: boolean;
}

const Image = ({
  src,
  alt,
  className,
  fill,
  layout,
  objectFit,
  priority,
  quality,
  placeholder,
  blurDataURL,
  loader,
  unoptimized,
  style: styleProp,
  ...props
}: ImageProps) => {
  const style: React.CSSProperties = { ...styleProp };

  if (fill || layout === "fill") {
    style.position = "absolute";
    style.top = 0;
    style.left = 0;
    style.width = "100%";
    style.height = "100%";
    style.objectFit = objectFit || "cover";
  } else if (objectFit) {
    style.objectFit = objectFit;
  }

  // use options object to pass fallback explicitly
  const resolved = resolveImage(src as string, { fallback: FALLBACK_IMG });
  const [imgSrc, setImgSrc] = useState(resolved);

  useEffect(() => {
    setImgSrc(resolveImage(src as string, { fallback: FALLBACK_IMG }));
  }, [src]);

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMG) {
      setImgSrc(FALLBACK_IMG);
    }
  };

  return (
    <img src={imgSrc} alt={alt} className={className} style={style} onError={handleError} {...props} />
  );
};

export default Image;
