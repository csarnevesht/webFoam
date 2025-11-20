1. Overall Vibe

Style:

Clean, calm, slightly “engineering SaaS” look.

Lots of negative space, subtle borders, soft shadows.

Minimal color; a primary accent and one warning color.

Recommended palette (you can tweak):

Background: #0B1120 (deep slate/navy) for the shell around the canvas

Canvas background: #0F172A or #020617 slightly lighter/darker than shell

Panels / Cards: #020617 or #111827 with subtle border #1F2937

Primary accent: #3B82F6 (blue-500)

Secondary accent: #22C55E (green-500) for “safe / ready” states

Text main: #E5E7EB / #F9FAFB (near white)

Muted text: #9CA3AF

Typography:

Font family: Inter, SF Pro, or system-ui

Title: 18–20px, semi-bold

Panel headings: 14–16px, medium

Body text: 13–14px, regular

2. Layout Structure

Top-level layout: three zones

Top Bar (fixed at top) – brand, file actions, prominent “Generate Path” button.

Left Sidebar (tools) – vertical tool buttons with icons and labels.

Center Canvas – large, dark area for the 2D view.

Right Sidebar (panels) – collapsible cards: Contours, Path Optimization, Machine & G-code.

Visually:

+-------------------------------------------------------------------------------------+
| FoamCut Web              [Import] [Save]                    [Generate Path ▷]       |
|  subtle gradient bar, shadow, logo icon on the left                                  |
+------------+--------------------------------------------------------+---------------+
| Tools      |                                                        | Contours      |
| (vertical) |                  Canvas / Viewport                     | Path Opt      |
|            |                                                        | Machine       |
+------------+--------------------------------------------------------+---------------+

3. Top Bar – Detailed

Look:

Height ~56px.

Background: subtle gradient from-slate-900 to-slate-950.

Bottom border: 1px solid #1F2937.

Slight shadow (shadow-sm).

Content (left → right):

Left:

Small logo mark (simple rounded square with blue border).

Product name: FoamCut Web in semi-bold.

Tiny “Beta” pill in soft primary: bg-blue-500/10 text-blue-300 text-[11px] rounded-full px-2.

Center:

“File” / “View” / “Help” as subtle text buttons.

Right:

Ghost button: Import SVG (icon: upload).

Ghost button: Export G-code (icon: file-code).

Primary button: Generate Path (icon: lightning / play).

Blue background, white text, slightly larger.

Example Tailwind-ish mental model:

<div className="h-14 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 flex items-center px-4">
  {/* logo + title */}
  {/* menu */}
  {/* actions */}
</div>

4. Left Toolbar (Tools)

Look:

Width ~80–96px.

Background: bg-slate-950.

Right border: border-r border-slate-800.

Icons centered, labels underneath, all in a vertical stack.

Buttons:

Each tool = a tall pill:

40×40px icon button (rounded-full / rounded-xl).

Underneath a tiny label (11–12px, muted).

Default state: bg-slate-900, hover: bg-slate-800.
Active tool: bg-slate-800/80 border border-blue-500/60 shadow-sm.

Buttons:

Select (arrow)

Pan (hand)

Line

Polyline

Text (“T”)

Transform (move/rotate)

Delete (trash)

This feels like Figma-ish tools but darker.

5. Center Canvas

Look:

Fills all remaining horizontal space between sidebars.

Background: bg-slate-950.

Inside that, the actual draw area is a centered “panel”:

Slightly lighter bg-slate-900.

Rounded corners (rounded-xl).

Border border border-slate-800.

Shadow shadow-lg shadow-black/40.

Add:

A subtle grid (thin lines, extremely low opacity).

Crosshair at origin.

Coordinate display in bottom right: X: 123.4, Y: 56.7 in small monospaced text.

Overlay elements:

Contours: thin stroke (stroke-slate-200)

Optimized path: thicker, bright (stroke-blue-400)

Start point: small green circle with glow (fill-emerald-400 drop-shadow)

Entry points: small blue dots

Think CAD viewport in dark mode, but flatter and more minimal.

6. Right Sidebar Panels

Right pane is ~320px wide, scrollable, with stacked cards.

6.1 Sidebar Container

Background: bg-slate-950.

Border-left: border-l border-slate-800.

Padding: 12–16px.

Scroll: overflow-y-auto with custom thin scrollbar.

6.2 Each Panel Card

Container:

bg-slate-900 rounded-xl border border-slate-800 mb-3 p-3.5

Panel header: flex row with title and collapse chevron.

Title: 13–14px text-slate-100 font-medium.

Small description text in text-slate-400 text-xs.

Panel 1: Contours

Title: Contours

Little badge: “7” (number of contours).

Inside:

Toggle:

[x] Show raw shapes

[x] Show cutting path

List (chips or rows):

Each contour:
C3 · OUTER · Island A (monospace ID + small tag)

Click row → highlight in canvas (row background bg-slate-800/60).

Panel 2: Path Optimization

Title: Path Optimization

Description: “Control sampling and penalty parameters for the continuous path engine.”

Controls:

Slider: Samples per contour

Value with bubble: 64

Slider / input: Crossing penalty λ

Input + slider, e.g., 1.5

Two toggles (switch-style):

Cut holes before outer (on by default)

Optimize island order (TSP) (on)

Button row:

Recompute Path (blue outline button)

Reset (ghost button)

Info area:

Total path length: 485.2 units

Contours: 7 (3 islands, 4 holes)

Panel 3: Machine & G-code

Title: Machine & G-code

Controls:

Units:

segmented control: [ mm ] [ inch ]

Kerf:

number input + “mm” label

Scale:

“Design units → mm” numeric input

Feedrate:

numeric input

Origin:

radio group:

(●) Bottom-left

( ) Center

( ) Custom

If Custom: show a hint:

Click anywhere in the canvas to set a custom origin.

G-code export:

Primary button: Export G-code

Extra: smaller “Preview” link showing character count and 1st line, e.g.:

G21 · G90 · 322 lines

7. Polished Visual Touches

To make it feel “professional / premium”:

Soft shadows:

Avoid big blur; use subtle drop shadows: shadow-[0_10px_40px_rgba(0,0,0,0.6)] on main canvas card.

Micro-animations:

Hover on buttons: scale up to 1.03, subtle shadow intensification.

Panel collapse/expand: 200ms height + opacity.

Icons:

Use consistent icon set (Lucide, Heroicons) at 16px or 18px.

Monospace where technical:

For coordinates, G-code preview, IDs: use font-mono text-xs.

8. Optional: A Sample “Hero” Bar

If you want a little more “product-y” feeling:

Under the top bar, add a thin info stripe:

[⚡]  Last path: 485.2 units · 7 contours · 0 self-intersections  [View details]


Styled as a pill: bg-blue-500/10 text-blue-200 text-xs rounded-full px-3 py-1.
