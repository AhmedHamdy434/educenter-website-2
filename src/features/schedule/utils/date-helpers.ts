export const ARABIC_WEEKDAYS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
] as const;

export const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
] as const;

/**
 * الحصول على تاريخ اليوم الحالي بصيغة YYYY-MM-DD بتوقيت القاهرة
 */
export function getCairoTodayString(): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(new Date());
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  return `${map.year}-${map.month}-${map.day}`;
}

/**
 * الحصول على الشهر الحالي بصيغة YYYY-MM بتوقيت القاهرة
 */
export function getCairoCurrentMonth(): string {
  const todayStr = getCairoTodayString();
  return todayStr.slice(0, 7);
}

/**
 * تنسيق الشهر بالعربية (مثال: أكتوبر 2026)
 */
export function formatMonthArabic(yearMonth: string): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const monthName = ARABIC_MONTHS[monthIndex] || '';
  return `${monthName} ${year}`;
}

/**
 * حساب الشهر التالي بصيغة YYYY-MM
 */
export function getNextMonth(yearMonth: string): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) + 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * حساب الشهر السابق بصيغة YYYY-MM
 */
export function getPrevMonth(yearMonth: string): string {
  const [yearStr, monthStr] = yearMonth.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) - 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * تحويل الساعة والدقيقة إلى توقيت 12 ساعة بالعربية (مثال: 04:30 م)
 */
export function formatHourMinuteArabic(hour: number, minute: number): string {
  const period = hour >= 12 ? 'م' : 'ص';
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const minuteStr = String(minute).padStart(2, '0');
  const hourStr = String(hour12).padStart(2, '0');
  return `${hourStr}:${minuteStr} ${period}`;
}

/**
 * تنسيق تاريخ كامل بالعربية (مثال: السبت، 31 أكتوبر)
 */
export function formatDateArabic(dateStr: string): string {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const date = new Date(Date.UTC(year, monthIndex, day));
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dayOfWeekIndex = date.getUTCDay();
  // تحويل إلى الأيام العربية حيث 6 = السبت (0)، 0 = الأحد (1)، 1 = الإثنين (2)، ...
  const saturdayIndexMap: Record<number, string> = {
    6: 'السبت',
    0: 'الأحد',
    1: 'الإثنين',
    2: 'الثلاثاء',
    3: 'الأربعاء',
    4: 'الخميس',
    5: 'الجمعة',
  };

  const dayName = saturdayIndexMap[dayOfWeekIndex] || '';
  const monthName = ARABIC_MONTHS[monthIndex] || '';

  return `${dayName}، ${day} ${monthName}`;
}

