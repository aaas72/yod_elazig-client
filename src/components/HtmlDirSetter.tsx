"use client";

import { useEffect } from "react";

export default function HtmlDirSetter({ lang, dir }: { lang: string; dir: "rtl" | "ltr" }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return null;
}
