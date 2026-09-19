import Link from "next/link";
import { GraduationCap, MessageCircle, Send } from "lucide-react";

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full bg-secondary/30 border-t border-border pt-16 pb-12" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Column 1: Brand details */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary border border-border">
                <GraduationCap className="size-6 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                EduCenter
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              المنصة المتكاملة الرائدة في إدارة السناتر التعليمية والمجموعات الدراسية. نساعدك على تنظيم عملك، متابعة طلابك، وتنمية أعمالك بكفاءة وسهولة.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-foreground text-sm">المنصة</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="#hero" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#features" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  المميزات
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  باقات الاشتراك
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  آراء العملاء
                </a>
              </li>
              <li>
                <a href="#contact" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-foreground text-sm">الدعم الفني</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            © {new Date().getFullYear()} EduCenter. جميع الحقوق محفوظة.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="قناة يوتيوب"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              <Youtube className="size-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="حساب إكس (تويتر سابقاً)"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              <Send className="size-4 rotate-135" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="حساب إنستغرام"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل عبر واتساب"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
