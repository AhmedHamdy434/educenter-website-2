import {
  Users,
  CalendarCheck,
  CreditCard,
  FileSpreadsheet,
  Award,
  ShieldCheck,
} from "lucide-react";
import { FadeIn, HoverCard } from "@/components/common/motion-wrapper";

export function Features() {
  const features = [
    {
      title: "إدارة المجموعات والطلاب",
      description:
        "تنظيم الطلاب داخل المجموعات الدراسية، متابعة السعة الاستيعابية، وتسجيل بيانات أولياء الأمور بسهولة.",
      icon: Users,
    },
    {
      title: "تسجيل الحضور والغياب الذكي",
      description:
        "كشوف حضور وغياب سريعة لكل حصة، مع إمكانية تدوين الملاحظات وإرسال إشعارات فورية.",
      icon: CalendarCheck,
    },
    {
      title: "تحصيل الاشتراكات والمدفوعات",
      description:
        "متابعة اشتراكات الطلاب الشهرية، معرفة المتأخرات بدقة، وإصدار إيصالات تحصيل فورية.",
      icon: CreditCard,
    },
    {
      title: "تقارير ونسب إحصائية دقيقة",
      description:
        "رسوم بيانية وتقارير تفصيلية عن أداء المركز، نسب الحضور، والإيرادات المالية في فترات زمنية محددة.",
      icon: FileSpreadsheet,
    },
    {
      title: "نظام الواجبات والاختبارات",
      description:
        "إدارة درجات الطلاب، تسجيل نتائج الامتحانات الشهرية، ومشاركة النتائج مع أولياء الأمور.",
      icon: Award,
    },
    {
      title: "صلاحيات وحماية متقدمة",
      description:
        "لوحات تحكم مخصصة لكل من مدير المركز، المعلم، والطالب، مع أمان تام وحفظ سحابي لبياناتك.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="features" className="w-full bg-secondary/30 py-20 border-y border-border" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary font-bold text-xs border border-border">
            <span>كل ما تحتاجه في مكان واحد</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            مميزات مصممة خصيصاً لتطوير مركزك
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed font-medium">
            صممنا EduCenter ليغطي كافة جوانب العمل اليومي داخل المراكز التعليمية لتوفير الوقت والجهد وزيادة الإنتاجية.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={index} direction="up" delay={index * 0.1} duration={0.5}>
                <HoverCard
                  className="group flex flex-col items-center text-center p-8 bg-card border border-border rounded-2xl shadow-none hover:border-primary/40 transition-all duration-300 h-full"
                >
                  <div
                    className="flex size-14 items-center justify-center rounded-2xl mb-6 bg-secondary text-primary border border-border transition-transform duration-300 group-hover:scale-105"
                  >
                    <Icon className="size-7 stroke-[1.75]" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </HoverCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
