---
name: Institutional Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#DC2626'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  background-light: '#F8FAFC'
  background-dark: '#020617'
  surface-dark: '#0F172A'
  success: '#16A34A'
  success-dark: '#4ADE80'
  error-dark: '#F87171'
  border-subtle: '#E2E8F0'
  border-dark: '#1E293B'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  table-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is built upon a foundation of institutional trust, corporate clarity, and analytical rigor. Drawing inspiration from high-end financial consulting aesthetics, the visual language is defined by a "Kaku & Solid" philosophy—utilizing rigid structural order, heavy color blocks, and high-contrast surfaces.

The style is **Corporate / Modern** with a lean towards **Minimalism**. It avoids playful elements like soft gradients or large rounded corners in favor of crisp lines, intentional whitespace, and a dual-tone palette that feels both authoritative and high-performance. The interface should evoke the feeling of an elite financial terminal: stable, precise, and absolute in its command over data.

## Colors

The palette is anchored by "McKinsey Slate" (`#0F172A`) for primary actions and "Royal Blue" (`#2563EB`) for interactive highlights. 

- **Light Mode:** Uses a crisp Slate-50 foundation with solid White surfaces for containers. High-contrast Slate-900 text ensures legibility.
- **Dark Mode:** Transitions to a deep Obsidian (`#020617`) canvas with Slate-900 surfaces.
- **Functional Colors:** Inflow (Success) and Outflow (Error) colors are strictly enforced for financial data. Inflow uses emerald tones, while Outflow uses vibrant reds, adjusted for AA accessibility in both light and dark modes.
- **Interactions:** Use Blue-600 for active states and navigation links.

## Typography

This design system utilizes a sophisticated dual-font strategy:

1.  **Editorial Serif (Source Serif 4):** Reserved for large headings, brand signatures, and primary financial totals. This lends a traditional, "Wall Street Journal" intellectual weight to the data. Use tight letter-spacing for large currency figures.
2.  **Systematic Sans (Inter):** Used for all functional UI elements including navigation, forms, and dense table data. It provides the necessary clarity for high-density information.

**Hierarchy Rules:**
- All financial balances over 24px must use the Serif font.
- Labels for inputs and table headers must use the `label-caps` style with increased letter spacing for maximum scannability.
- Financial figures in tables should be right-aligned and use the `table-data` style.

## Layout & Spacing

The system follows a **Fluid Grid** approach within a fixed maximum container width.

- **Grid Model:** 12-column system for desktop, 1-column for mobile. Metric cards typically span 4 columns (3-up) on desktop and 12 columns (1-up) on mobile.
- **Layout Rhythm:** A strict 4px/8px baseline grid is used. Sections should be separated by `stack-lg` (32px) to maintain a breathable, premium feel.
- **Sidebars:** The desktop navigation is a fixed 256px (`w-64`) left pane. Content area is independently scrollable with a fixed header of 64px (`h-16`).
- **Responsive Reflow:** Multi-column tables must transition to "Card View" on screens smaller than 768px.

## Elevation & Depth

To maintain the "McKinsey Style," depth is conveyed primarily through **Tonal Layers** and **Low-contrast Outlines** rather than heavy shadows.

- **Surface Tiers:** Use the background color for the page and White (Light) or Slate-900 (Dark) for cards. This 1-tier elevation is sufficient for most content.
- **Borders:** Use 1px solid borders (`slate-200` in Light, `slate-800` in Dark) to define container boundaries.
- **Shadows:** Use a singular, very subtle "Ambient Shadow" (`shadow-sm`) for cards to lift them slightly off the background.
- **Modals:** Use a `backdrop-blur-sm` (4px) with a semi-transparent Slate-900/50 overlay to focus user attention, paired with a `shadow-2xl` for the modal container.

## Shapes

The shape language balances the "stiff" corporate feel with modern dashboard conventions.

- **Primary Components:** Buttons and Input fields use a standard **8px (rounded-lg)** radius. This keeps them feeling structural and solid.
- **Containers:** Dashboard cards and modals use a softer **16px (rounded-2xl)** radius to provide a premium, modern frame for financial data.
- **Interactive States:** Fully rounded "pill" shapes (9999px) are reserved exclusively for status indicators (chips) and icon button hover states.

## Components

### Buttons
- **Primary:** Solid background (`slate-900` Light / `slate-50` Dark), white/slate-900 text, 40px height, 8px radius. Medium weight, tracking-wide.
- **Secondary:** Transparent background with 1px border. Hover effect should be a subtle gray background swap.
- **Ghost:** No border or background. Used for secondary navigation actions.

### Input Fields
- **Standard:** 38px height, solid border, 8px radius. Focus state shifts border color to `slate-400` (Light) or `slate-600` (Dark) with no outer glow.
- **Currency Input:** Must include a fixed "Rp" or "$" prefix within the input field, left-aligned, with the value text indented.

### Cards
- White background, 16px radius, 1px subtle border, 24px internal padding. 
- Titles within cards must use `label-caps`.

### Chips / Status Pills
- Compact height (24px), fully rounded, low-opacity background with high-contrast text. For example, a success chip should use a very pale green background with dark green text.

### Navigation Items
- Vertical sidebar links should have a 40px height. The active state uses a solid Royal Blue background with a very subtle blue glow shadow to denote focus.

### Lists & Tables
- Table rows use a 1px border-bottom for separation. Headers use the Serif font at a small size or `label-caps` for a professional, institutional look.