import Link from "next/link";
import Image from "next/image";
import { Star, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/common/motion-wrapper";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32"
    >
      {/* Dynamic Background Glow Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%+2rem)] aspect-1155/678 w-144.5 -translate-x-1/2 -translate-y-1/2 rotate-30 bg-linear-to-br from-primary via-emerald-600/30 to-accent opacity-15 sm:left-[calc(50%+2rem)] sm:w-6xl"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8 text-right">
          {/* Right Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            {/* Top Pill / Badge */}
            <FadeIn direction="down" duration={0.5}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-foreground text-xs sm:text-sm font-semibold shadow-none">
                <Star className="size-4 text-accent fill-accent" />
                <span className="text-primary font-bold">نظام متكامل لإدارة مركز التعليم</span>
              </div>
            </FadeIn>

            {/* Main Headline */}
            <FadeIn direction="up" delay={0.1} duration={0.6}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.2] tracking-tight">
                إدارة أذكى لمركزك...{" "}
                <br />
                <span className="text-primary">تعليم أفضل</span> لطلابك
              </h1>
            </FadeIn>

            {/* Sub-headline description */}
            <FadeIn direction="up" delay={0.2} duration={0.6}>
              <p className="text-muted-foreground text-base sm:text-lg max-w-lg leading-relaxed font-medium">
                تخلص من الفوضى الورقية وإدارة المركز بالطرق التقليدية. منصة إيديو سنتر تمنحك تحكماً شاملاً في المجموعات، الحضور، الدرجات، والمدفوعات بكل سلاسة.
              </p>
            </FadeIn>

            {/* Action Buttons (CTAs) */}
            <FadeIn direction="up" delay={0.3} duration={0.6}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild variant="brand" size="brandXl" className="font-bold shadow-none">
                  <Link href="#pricing" className="flex items-center gap-2">
                    <span>ابدأ الآن مجاناً</span>
                    <ArrowLeft className="size-4 stroke-[2.5] rotate-180" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="brandXl"
                  className="border-border hover:bg-muted text-foreground font-semibold gap-2 shadow-none"
                >
                  <a href="#features" className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-secondary text-primary">
                      <Play className="size-3 fill-primary translate-x-[-0.5px]" />
                    </div>
                    <span>شاهد كيف يعمل</span>
                  </a>
                </Button>
              </div>
            </FadeIn>

            {/* Social Proof / Avatars */}
            <FadeIn direction="up" delay={0.4} duration={0.6}>
              <div className="flex items-center gap-4 pt-4 border-t border-border mt-2">
                <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                  <div className="relative size-10 rounded-full border-2 border-card overflow-hidden bg-secondary">
                    <Image src="/images/avatar-ahmed.png" alt="User Avatar 1" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="relative size-10 rounded-full border-2 border-card overflow-hidden bg-secondary">
                    <Image src="/images/avatar-sara.png" alt="User Avatar 2" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="relative size-10 rounded-full border-2 border-card overflow-hidden bg-secondary">
                    <Image src="/images/avatar-mohammed.png" alt="User Avatar 3" fill sizes="40px" className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[14px] font-bold text-foreground">أكثر من +10,000 مركز تعليمي</span>
                  <span className="text-xs text-muted-foreground font-medium">يثقون بنا حول الوطن العربي</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Left Column: Hero Dashboard Image */}
          <div className="lg:col-span-5 relative">
            <FadeIn direction="left" delay={0.2} duration={0.8}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glow */}
                <div className="absolute inset-0 m-auto w-[85%] h-[85%] rounded-full bg-secondary/80 -z-10 animate-pulse duration-8000" />
                {/* Main Hero Image Frame */}
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
                  <Image
                    src="/images/hero-student.png"
                    alt="منصة EduCenter للتعليم والمراكز التعليمية"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
