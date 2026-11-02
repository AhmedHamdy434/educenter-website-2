/**
 * Date and time helper utilities strictly scoped to Africa/Cairo.
 * Consolidated into shared `@/utils/time`. Re-exported here for feature backward-compatibility.
 */
export {
  getCairoTodayDateString,
  formatCairoDate,
  formatCairoDateTime,
  formatTime as formatTimeArabic,
} from '@/utils/time';
