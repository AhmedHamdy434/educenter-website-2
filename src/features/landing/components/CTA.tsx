import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/common/motion-wrapper";

export function CTA() {
  return (
    <section className="w-full py-16 md:py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up" duration={0.6}>
          <div className="relative w-full bg-primary text-primary-foreground rounded-3xl md:rounded-[2.5rem] overflow-hidden px-8 py-14 md:p-16 lg:p-20 shadow-none border border-primary/20">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-xs border border-white/10">
                <Sparkles className="size-3.5" />
                <span>ابدأ مجاناً اليوم</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2]">
                جاهز لنقل مركزك التعليمي إلى مستوى جديد من الاحترافية؟
              </h2>

              {/* Description */}
              <p className="text-primary-foreground/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
                انضم الآن لمئات المراكز التعليمية التي تعتمد على منصة EduCenter لتنظيم عملها وتوفير الوقت والجهد.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  variant="brandWhite"
                  size="brandXl"
                  className="font-bold rounded-xl"
                >
                  <Link href="#pricing" className="flex items-center gap-2">
                    <span>ابدأ تجربتك المجانية</span>
                    <ArrowLeft className="size-4 stroke-[2.5] rotate-180" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="brandXl"
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white font-semibold rounded-xl bg-transparent"
                >
                  <a href="#contact">تحدث مع المبيعات</a>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
