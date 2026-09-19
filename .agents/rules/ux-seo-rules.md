---
trigger: always_on
---

# UX, SEO, and Accessibility Rules & Coding Standards

This document defines the mandatory UI/UX styling, Accessibility (WCAG 2.2 AA), and SEO standards for the **EduCenter SaaS** project. Every developer and AI assistant must follow these rules without exception.

---

## 1. Styling (Tailwind CSS)
*   **Utility First**: Use Tailwind classes exclusively. No custom inline styles.
*   **Design Tokens**: Reference color variables (e.g., `text-primary`) rather than hardcoding hex/rgb values.
*   **Conditional Classes**: Always merge conditional Tailwind classes using the `cn()` utility.

---

## 2. Performance Optimization
*   Use Next.js `<Image />` with defined sizes.
*   Lazy-load massive components using `next/dynamic`.
*   Optimize renders using `useMemo` and `useCallback` for expensive operations.

---

## 3. Accessibility (WCAG 2.2 AA)
*   **Standards**: Follow WCAG 2.2 Level AA guidelines.
*   **Semantic HTML**: Use semantic HTML first (`header`, `main`, `nav`, `section`, `article`, `aside`, `footer`, etc.). Never use clickable divs when a native element (`button`, `a`, `input`) is appropriate.
*   **Keyboard Navigation**: Every interactive element must be fully keyboard accessible, preserving visible focus indicators (never remove focus outlines unless replaced with an accessible alternative). Ensure logical tab order.
*   **ARIA**: Use proper ARIA attributes only when semantic HTML is insufficient.
*   **Form Controls**: Every form control must have an associated label. Inputs must expose validation errors using accessible techniques (`aria-invalid`, `aria-describedby`, live regions where appropriate).
*   **Media**: Every image must include meaningful `alt` text. Decorative images should use `alt=""`. Icon-only buttons must include an accessible name (`aria-label`).
*   **Headings**: Headings must follow a logical hierarchy (H1 → H2 → H3).
*   **Contrast**: Use sufficient color contrast (minimum WCAG AA). Never rely on color alone to convey meaning.
*   **Motion**: Respect reduced motion preferences (`prefers-reduced-motion`).
*   **Dialogs & Popovers**: All dialogs, sheets, dropdowns, and popovers must properly manage focus and keyboard interactions.
*   **Tables**: Tables must include proper headers and captions when needed.
*   **Announcements**: Loading states and dynamic content should be announced appropriately for screen readers.
*   **Tooling**: Avoid accessibility violations detected by Lighthouse or axe-core.

---

## 4. SEO & Next.js App Router Rules
*   **Metadata API**: Always use the Metadata API. Every page must have unique metadata (optimized title and meta description, canonical URLs, Open Graph, and Twitter metadata). Use `metadataBase` configuration.
*   **Rendering**: Prefer static rendering whenever possible. Use `generateMetadata()` for dynamic pages and `generateStaticParams()` when applicable. Prefer Server Components where possible for content pages. Ensure important content is server-rendered.
*   **Heading & Crawling**: Use meaningful heading hierarchy with a single H1 per page. Ensure pages are crawlable and descriptive URLs are generated.
*   **Structured Data**: Include structured data (JSON-LD) whenever applicable (Article, Product, Organization, Breadcrumb, FAQ, etc.).
*   **Linking**: Use internal linking where appropriate. Avoid duplicate content.
*   **SEO Assets**: Generate `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and Open Graph images when appropriate.
*   **Breadcrumbs & Pagination**: Implement breadcrumbs when applicable and add pagination metadata for paginated pages.
*   **Image & Font Optimization**: Optimize images using Next.js `<Image />` with defined sizes. Lazy load non-critical images. Optimize fonts using `next/font`.
*   **Web Vitals**: Minimize layout shifts (CLS), keep JS bundles as small as possible, and prioritize Core Web Vitals (LCP, CLS, INP).
*   **Caching**: Use proper caching and revalidation strategies.
*   **Hydration**: Avoid hydration mismatches. Never hide important content behind client-side rendering unless necessary.

---

## 5. Next.js & Code Quality Rules
*   **Server Components**: Prefer Server Components by default. Only use Client Components when interaction is required.
*   **Optimization**: Use Suspense where beneficial, and dynamic imports for heavy client-side features. Keep layouts reusable. Optimize rendering performance and avoid unnecessary re-renders.
*   **Code Quality**: Accessibility and SEO are not optional. If a requested implementation violates accessibility or SEO best practices, implement the closest accessible alternative and explain why.
*   **Lighthouse Targets**:
    - Accessibility: 100
    - SEO: 100
    - Best Practices: 100
    - Performance: as high as reasonably achievable.
