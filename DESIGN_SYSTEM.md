# SwiftPay Design System

## Overview

SwiftPay uses a modern Juspay-inspired vibrant fintech design system with an electric blue primary, purple secondary, and warm orange accents. The design prioritizes clarity, accessibility, and premium feel.

---

## Color Palette

### Primary Colors

**Electric Blue (Primary)**
- Light Mode: `oklch(0.50 0.18 260)`
- Dark Mode: `oklch(0.60 0.18 260)`
- Purpose: CTA buttons, active states, primary UI elements
- RGB: ~#0052D4 (approximation)

**Purple/Violet (Secondary)**
- Light Mode: `oklch(0.62 0.16 290)`
- Dark Mode: `oklch(0.68 0.16 290)`
- Purpose: Gradients, secondary actions, premium accents
- RGB: ~#7C3AED (approximation)

**Warm Orange/Pink (Accent)**
- Light Mode: `oklch(0.65 0.19 35)`
- Dark Mode: `oklch(0.70 0.19 35)`
- Purpose: Highlights, success states, special attention
- RGB: ~#FF6B35 (approximation)

### Neutral Colors

**Background**
- Light: `oklch(0.985 0.002 0)` - Off-white
- Dark: `oklch(0.10 0.02 270)` - Deep navy

**Foreground**
- Light: `oklch(0.12 0.02 270)` - Dark navy
- Dark: `oklch(0.96 0.01 0)` - Off-white

**Sidebar**
- Light: `oklch(0.08 0.03 270)` - Very dark navy
- Dark: `oklch(0.08 0.03 270)` - Same

### Status Colors

| Status | Color | Purpose |
|--------|-------|---------|
| Success | `oklch(0.60 0.16 150)` | Approved, completed |
| Warning | `oklch(0.72 0.18 60)` | Caution, pending |
| Destructive | `oklch(0.58 0.25 25)` | Error, delete, deny |
| Info | `oklch(0.50 0.18 260)` | Information, routing |

---

## Component Styling

### Buttons

**Primary Button**
```tsx
className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90"
```

**Secondary Button**
```tsx
className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90"
```

**Gradient Button (Featured)**
```tsx
className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium shadow-lg"
```

### Cards

All cards use:
- Border: `border border-border` (light gray)
- Rounded: `rounded-2xl` or `rounded-3xl` for featured
- Shadow: `shadow-xl shadow-primary/5` for depth
- Padding: `p-4 md:p-6` (responsive)

```tsx
className="bg-card border border-border rounded-2xl p-4 md:p-6 space-y-5"
```

### Input Fields

Modern input styling with electric blue focus ring:
```tsx
className="bg-muted border border-border/50 rounded-2xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
```

### Sidebar Navigation

**Active Item**
- Gradient background: `bg-gradient-to-r from-primary to-secondary`
- Text color: `text-white`
- Shadow: `shadow-lg shadow-primary/20`
- Rounded: `rounded-lg`

**Hover Item**
- Background: `bg-sidebar-accent/50`
- Smooth transition: `transition-all duration-200`

### Typography

**Heading**
- Gradient text: `bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`
- Font weight: `font-bold`
- Sizes: `text-lg` (sm), `text-2xl` (lg)

**Label**
- Font weight: `font-bold`
- Size: `text-xs`
- Color: `text-muted-foreground`
- Case: `uppercase tracking-wider`

---

## Design Tokens in CSS

All design tokens are defined in `/src/styles/globals.css` using CSS custom properties:

```css
:root {
  --primary: oklch(0.50 0.18 260);
  --secondary: oklch(0.62 0.16 290);
  --accent: oklch(0.65 0.19 35);
  --success: oklch(0.60 0.16 150);
  --warning: oklch(0.72 0.18 60);
  --destructive: oklch(0.58 0.25 25);
  --info: oklch(0.50 0.18 260);
  /* ... more tokens ... */
}

.dark {
  /* Dark mode overrides */
}
```

---

## Responsive Design

All components use Tailwind breakpoints:

| Breakpoint | Width | Prefix |
|-----------|-------|--------|
| Mobile | < 640px | (none) |
| Small | 640px | `sm:` |
| Medium | 768px | `md:` |
| Large | 1024px | `lg:` |

**Example responsive styling:**
```tsx
className="text-sm md:text-base lg:text-lg p-4 md:p-6 lg:p-8"
```

---

## Shadows & Depth

- **Card shadow:** `shadow-xl shadow-primary/5` - subtle depth
- **Button shadow:** `shadow-lg shadow-primary/20` - prominent depth
- **Logo shadow:** `shadow-lg` - standard depth

---

## Border Radius

- Standard: `rounded-lg` (0.5rem)
- Cards: `rounded-2xl` (0.75rem)
- Featured: `rounded-3xl` (0.75rem)

---

## Spacing Scale

Uses Tailwind spacing scale (rem-based):
- `p-4` = 1rem padding
- `p-6` = 1.5rem padding
- `p-8` = 2rem padding
- `gap-3` = 0.75rem gap
- `space-y-5` = 1.25rem vertical spacing

---

## Theme Switching

Dark mode is applied with the `.dark` class on the `<html>` element:

```html
<html class="dark">
```

CSS automatically switches to dark mode tokens defined in `.dark { ... }`

---

## Implementation Checklist

When building new components:

- [ ] Use design tokens from `/src/styles/globals.css`
- [ ] Apply responsive classes (sm:, md:, lg:)
- [ ] Use gradient buttons for primary actions
- [ ] Apply shadows to cards for depth
- [ ] Use border-border for dividers
- [ ] Test in both light and dark modes
- [ ] Ensure WCAG AA contrast compliance
- [ ] Use rounded-2xl for cards, rounded-lg for buttons

---

## Color Reference

For quick reference when coding:

| Element | Light Mode | Dark Mode | CSS Variable |
|---------|-----------|-----------|--------------|
| Primary | #0052D4 | #1A7EFF | --primary |
| Secondary | #7C3AED | #9F7AEA | --secondary |
| Accent | #FF6B35 | #FF8B5D | --accent |
| Success | #3BA55D | #4FD77D | --success |
| Warning | #FFAD00 | #FFD700 | --warning |
| Destructive | #D32F2F | #E53935 | --destructive |
| Background | #FAFAFA | #1A1A1F | --background |

---

## Files to Reference

- **Global styles:** `/src/styles/globals.css`
- **Sidebar:** `/src/components/swiftpay/sidebar-nav.tsx`
- **Send Money Widget:** `/src/components/swiftpay/send-money-widget.tsx`
- **Topbar:** `/src/components/swiftpay/topbar.tsx`
- **UI Components:** `/src/components/ui/*`

---

## Future Enhancements

Potential design improvements:
- Additional gradient combinations for different UI contexts
- More detailed dark mode refinements
- Animation/transition guidelines
- Accessibility audit for color contrast
- Component library documentation
