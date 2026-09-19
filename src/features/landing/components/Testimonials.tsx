import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { FadeIn, HoverCard } from "@/components/common/motion-wrapper";

export function Testimonials() {
  const testimonials = [
    {
      name: "أحمد محمود",
      role: "مدير سنتر التفوق التعليمي",
      content:
        "منصة EduCenter غيرت شكل الإدارة تماماً في المركز. كنا نضيع ساعات طويلة في كشوف الغياب والتحصيل اليدوي، والآن كل شيء يتم بضغطة زر واحدة وبدقة متناهية.",
      rating: 5,
      avatar: "/images/avatar-ahmed.png",
    },
    {
      name: "سارة عبد الرحمن",
      role: "معلمة فيزياء للمرحلة الثانوية",
      content:
        "أفضل ما في المنصة هو السهولة والتنظيم العالي. أستطيع تسجيل درجات الامتحانات الشهرية ومتابعة حضور كل طالب في مجموعاتي ومشاركة النتائج مع أولياء الأمور بسهولة.",
      rating: 5,
      avatar: "/images/avatar-sara.png",
    },
    {
      name: "محمد كمال",
      role: "مؤسس أكاديمية المعرفة",
      content:
        "التقارير المالية وإحصائيات الطلاب وفرت علينا مجهود محاسبي ضخم. خدمة العملاء والدعم الفني سريع جداً ومتعاون لأقصى درجة. أنصح كل صاحب مركز بتجربتها.",
      rating: 5,
      avatar: "/images/avatar-mohammed.png",
    },
  ];

  return (
    <section
      id="testimonials"
      className="w-full bg-secondary/20 py-20 border-t border-border"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            ماذا يقول عملاؤنا عنا؟
          </h2>
          <div className="h-1 w-16 bg-accent rounded-full mx-auto" />
          <p className="text-muted-foreground text-base leading-relaxed font-medium">
            تجارب حقيقية من مديري مراكز ومعلمين وثقوا في منظومة EduCenter لتطوير وإدارة أعمالهم.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => {
            return (
              <FadeIn key={index} direction="up" delay={index * 0.15} duration={0.6}>
                <HoverCard className="group flex flex-col justify-between p-8 bg-card border border-border rounded-2xl shadow-none hover:border-primary/40 transition-all duration-300 h-full">
                  {/* Quote Icon & Stars */}
                  <div>
                    <div className="text-primary/20 mb-6 group-hover:text-primary/40 transition-colors">
                      <Quote className="size-8 stroke-[1.5]" />
                    </div>

                    {/* Content */}
                    <p className="text-foreground text-[14px] leading-relaxed mb-8 text-right font-medium">
                      &quot;{item.content}&quot;
                    </p>
                  </div>

                  {/* Author Meta */}
                  <div className="flex items-center gap-3.5 pt-6 border-t border-border mt-auto">
                    <div className="relative size-12 rounded-full overflow-hidden bg-secondary border-2 border-border">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-bold text-foreground text-sm">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium mt-0.5">
                        {item.role}
                      </span>
                      {/* Rating Stars */}
                      <div className="flex items-center gap-0.5 mt-1.5">
                        {[...Array(item.rating)].map((_, rIndex) => (
                          <Star
                            key={rIndex}
                            className="size-3 text-accent fill-accent"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </HoverCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
