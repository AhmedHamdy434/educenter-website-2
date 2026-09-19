import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import { Pricing } from "@/features/landing/components/Pricing";
import { Testimonials } from "@/features/landing/components/Testimonials";
import { CTA } from "@/features/landing/components/CTA";
import { ContactUs } from "@/features/landing/components/ContactUs";
import { Suspense } from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow">
        <Hero />
        <Suspense>
          <Features />
          <Pricing />
          <Testimonials />
          <CTA />
          <ContactUs />
        </Suspense>
      </main>
    </div>
  );
}
