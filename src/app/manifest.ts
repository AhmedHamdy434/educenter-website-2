import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EduCenter | منصة إدارة المراكز التعليمية",
    short_name: "EduCenter",
    description: "نظام شامل ومتكامل لإدارة السناتر والمراكز التعليمية والدروس الخصوصية.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6EC",
    theme_color: "#18362E",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
