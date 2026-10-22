import React, { useState } from 'react';

export default function TailwindUtilityInspector({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('utilities'); // 'utilities' | 'theory'

  if (!isOpen) return null;

  const utilityCategories = [
    {
      name: '1. Text Sizes',
      classes: 'text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl',
      description: 'Controls font size and relative line-height for visual hierarchy across titles, body, and micro-labels.',
      exampleCode: `<h3 className="text-xl font-bold">Paneer Tikka</h3>\n<p className="text-xs text-slate-500">320 kcal</p>`,
      demo: (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-xs text-slate-500">text-xs (12px)</span>
          <span className="text-sm text-slate-700">text-sm (14px)</span>
          <span className="text-base text-slate-900">text-base (16px)</span>
          <span className="text-xl font-bold text-orange-600">text-xl (20px)</span>
          <span className="text-2xl font-black text-slate-900">text-2xl (24px)</span>
        </div>
      ),
    },
    {
      name: '2. Background Colour',
      classes: 'bg-[#E8590C], bg-orange-500, bg-orange-50, bg-white, bg-slate-50, bg-emerald-600, bg-red-600, bg-amber-500',
      description: 'Sets background colors for cards, buttons, status indicators, and notification badges using HEX and Tailwind palettes.',
      exampleCode: `<button className="bg-[#E8590C] text-white">ADD</button>\n<div className="bg-orange-50 text-orange-800">Dine-in</div>`,
      demo: (
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold text-white bg-[#E8590C]">bg-[#E8590C]</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold text-white bg-slate-900">bg-slate-900</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold text-emerald-800 bg-emerald-100">bg-emerald-100</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold text-red-800 bg-red-100">bg-red-100</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold text-amber-800 bg-amber-100">bg-amber-100</span>
        </div>
      ),
    },
    {
      name: '3. Text Colour',
      classes: 'text-slate-900, text-slate-600, text-slate-400, text-white, text-[#E8590C], text-emerald-700, text-red-600',
      description: 'Defines foreground text colors establishing contrast ratio (>= 4.5:1) compliant with WCAG accessibility.',
      exampleCode: `<span className="text-[#E8590C]">BiteOrder</span>\n<span className="text-slate-500">Smoky char-grilled...</span>`,
      demo: (
        <div className="flex flex-wrap gap-3 font-bold text-sm">
          <span className="text-slate-900">text-slate-900</span>
          <span className="text-slate-500">text-slate-500</span>
          <span className="text-[#E8590C]">text-[#E8590C]</span>
          <span className="text-emerald-600">text-emerald-600</span>
          <span className="text-amber-500">text-amber-500</span>
        </div>
      ),
    },
    {
      name: '4. Font Weight',
      classes: 'font-normal (400), font-medium (500), font-semibold (600), font-bold (700), font-extrabold (800), font-black (900)',
      description: 'Controls typographic density to highlight key data points such as dish prices, labels, and descriptions.',
      exampleCode: `<span className="font-extrabold text-slate-900">₹260</span>\n<span className="font-normal text-slate-500">Description</span>`,
      demo: (
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="font-normal">font-normal</span>
          <span className="font-medium">font-medium</span>
          <span className="font-semibold text-orange-600">font-semibold</span>
          <span className="font-bold text-slate-900">font-bold</span>
          <span className="font-black text-slate-900">font-black</span>
        </div>
      ),
    },
    {
      name: '5. Text Alignment',
      classes: 'text-left, text-center, text-right, text-justify',
      description: 'Controls inline text alignment within containers such as headings, table badges, and numeric pricing.',
      exampleCode: `<div className="text-left">Dish Name</div>\n<div className="text-right">₹260.00</div>`,
      demo: (
        <div className="grid grid-cols-3 gap-2 w-full text-xs font-semibold p-2 bg-slate-100 rounded-lg">
          <div className="text-left bg-white p-1 rounded">text-left</div>
          <div className="text-center bg-white p-1 rounded">text-center</div>
          <div className="text-right bg-white p-1 rounded">text-right</div>
        </div>
      ),
    },
    {
      name: '6. Padding (Inner Spacing)',
      classes: 'p-4, p-6, px-4, py-2, py-0.5, px-2.5, pt-4, pb-2',
      description: 'Generates inner clearance inside card containers, buttons, and badges keeping content well away from edges.',
      exampleCode: `<div className="p-4 bg-white rounded-2xl">Card Body</div>\n<button className="px-4 py-2">Add</button>`,
      demo: (
        <div className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-800 border border-dashed border-orange-300 p-1 text-[11px] rounded">p-1</span>
          <span className="bg-orange-100 text-orange-800 border border-dashed border-orange-300 p-2 text-[11px] rounded">p-2</span>
          <span className="bg-orange-100 text-orange-800 border border-dashed border-orange-300 px-4 py-1.5 text-[11px] rounded">px-4 py-1.5</span>
        </div>
      ),
    },
    {
      name: '7. Margin (Outer Spacing)',
      classes: 'm-0, mt-1, mt-2, mt-3, mt-4, mb-2, mx-auto, ml-auto',
      description: 'Creates exterior separation between surrounding elements, separating headings from descriptions and cards from footers.',
      exampleCode: `<h3 className="mt-3.5">Title</h3>\n<p className="mt-2 mb-4">Desc</p>`,
      demo: (
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg text-xs">
          <div className="bg-slate-300 px-2 py-1 rounded">Box A</div>
          <div className="bg-orange-500 text-white px-2 py-1 rounded ml-4">ml-4 (Margin Left)</div>
        </div>
      ),
    },
    {
      name: '8. Width & Height',
      classes: 'w-full, w-auto, w-4, h-4, w-12, h-12, w-80, h-48, max-w-7xl, min-h-screen',
      description: 'Dictates physical dimensions of card images (h-48), brand icons (w-12 h-12), and page bounds (max-w-7xl).',
      exampleCode: `<img className="h-48 w-full object-cover" />\n<div className="w-4 h-4 rounded-full" />`,
      demo: (
        <div className="flex items-end gap-2">
          <div className="w-6 h-6 bg-orange-400 rounded text-[9px] text-white flex items-center justify-center">w-6</div>
          <div className="w-10 h-10 bg-orange-500 rounded text-[10px] text-white flex items-center justify-center">w-10</div>
          <div className="w-16 h-12 bg-orange-600 rounded text-xs text-white flex items-center justify-center font-bold">w-16 h-12</div>
        </div>
      ),
    },
    {
      name: '9. Borders',
      classes: 'border, border-2, border-slate-200, border-orange-500, border-dashed, border-t, border-b',
      description: 'Applies structural dividing boundaries around menu cards, dividers, and veg/non-veg identity marks.',
      exampleCode: `<div className="border border-slate-200 rounded-2xl">...</div>\n<div className="border-t border-slate-100">...</div>`,
      demo: (
        <div className="flex gap-2">
          <div className="border border-slate-400 p-2 rounded text-xs">border-slate-400</div>
          <div className="border-2 border-[#E8590C] p-2 rounded text-xs font-bold text-orange-600">border-2 orange</div>
          <div className="border-2 border-dashed border-slate-400 p-2 rounded text-xs">border-dashed</div>
        </div>
      ),
    },
    {
      name: '10. Rounded Corners',
      classes: 'rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-full',
      description: 'Softens sharp box corners to produce approachable, ergonomic, modern UI cards with 8px to 16px border-radius.',
      exampleCode: `<div className="rounded-2xl bg-white">Card</div>\n<span className="rounded-full">Badge</span>`,
      demo: (
        <div className="flex items-center gap-2">
          <div className="bg-slate-200 p-2 rounded-sm text-[10px]">rounded-sm</div>
          <div className="bg-slate-200 p-2 rounded-lg text-[10px]">rounded-lg</div>
          <div className="bg-slate-200 p-2 rounded-2xl text-[10px]">rounded-2xl</div>
          <div className="bg-orange-500 text-white p-2 rounded-full text-[10px] font-bold">rounded-full</div>
        </div>
      ),
    },
    {
      name: '11. Shadows',
      classes: 'shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-orange-500/25',
      description: 'Generates elevation and depth, separating floating cards, modals, and sticky navbars from background surfaces.',
      exampleCode: `<div className="shadow-sm hover:shadow-xl">Elevated Card</div>\n<button className="shadow-md shadow-orange-500/25">Button</button>`,
      demo: (
        <div className="flex gap-3 p-2 bg-slate-100 rounded-lg">
          <div className="bg-white p-2 text-[10px] rounded shadow-xs">shadow-xs</div>
          <div className="bg-white p-2 text-[10px] rounded shadow-md font-semibold">shadow-md</div>
          <div className="bg-white p-2 text-[10px] rounded shadow-xl font-bold">shadow-xl</div>
        </div>
      ),
    },
    {
      name: '12. Hover Effects & Transitions',
      classes: 'hover:shadow-xl, hover:-translate-y-1, hover:scale-105, hover:bg-orange-700, transition-all duration-300',
      description: 'Provides smooth, tactile feedback upon pointer interaction, creating an active, engaging dining experience.',
      exampleCode: `<div className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300">Hover me</div>`,
      demo: (
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 p-2 text-xs rounded-xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            Hover to Lift 🎈
          </div>
          <div className="bg-[#E8590C] hover:bg-orange-700 text-white p-2 text-xs rounded-xl font-bold hover:scale-105 transition-transform duration-200 cursor-pointer">
            Hover to Grow 🚀
          </div>
        </div>
      ),
    },
  ];

  const theoryQnA = [
    {
      q: 'What is Tailwind CSS?',
      a: 'Tailwind CSS is an open-source, utility-first CSS framework designed to build custom user interfaces rapidly without leaving your HTML or JSX markup. Rather than writing traditional CSS classes like `.menu-card` or using opinionated pre-built UI components, Tailwind provides low-level atomic utility classes representing individual CSS properties.',
    },
    {
      q: 'What is utility-first CSS?',
      a: 'Utility-first CSS is an architectural methodology where styling is accomplished by composing small, single-purpose classes (e.g., `flex`, `pt-4`, `text-center`, `bg-white`) directly within elements. It eliminates the constant need to invent arbitrary class names and context-switch between template and stylesheet files.',
    },
    {
      q: 'What is a Tailwind CSS utility class?',
      a: 'A Tailwind utility class is an atomic class that applies a single CSS property or a small group of related declarations. For example, `font-bold` sets `font-weight: 700;`, `p-4` sets `padding: 1rem; (16px)`, and `rounded-xl` sets `border-radius: 0.75rem; (12px)`.',
    },
    {
      q: 'What is the difference between padding and margin in CSS?',
      a: 'Padding is inner spacing inside an element between its content and its border. Background colors and borders encompass padding. Margin is outer spacing outside an element between its border and neighboring elements, creating separation between different layout components.',
    },
    {
      q: 'What is the purpose of borders in UI design?',
      a: 'Borders delineate visual boundaries, establish content grouping, separate cards from surrounding backgrounds, and distinguish interactive elements (like active state selections and input focus outlines).',
    },
    {
      q: 'Why are rounded corners used in UI design?',
      a: 'Rounded corners (achieved via `border-radius` or `rounded-*`) soften the visual aesthetic, mirror real-world physical cards, guide the eye smoothly toward internal content, and create a modern, approachable feel.',
    },
    {
      q: 'What is the purpose of shadows in UI design?',
      a: 'Box shadows (`shadow-*`) introduce elevation along the Z-axis, creating visual hierarchy. They differentiate background planes from foreground floating elements (such as food cards, sticky headers, and modal overlays).',
    },
    {
      q: 'What are hover effects and why are they used?',
      a: 'Hover effects (e.g., `hover:bg-orange-700`, `hover:-translate-y-1`) trigger visual changes when a user hovers a mouse over an element. They provide immediate micro-feedback confirming that an element is interactive and clickable.',
    },
    {
      q: 'Why is consistent styling important in a card-based listing page?',
      a: 'Consistent styling across all dish cards creates predictable visual patterns, making it effortless for guests to scan titles, prices, dietary badges, and action buttons without cognitive fatigue.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h2 className="text-xl font-black tracking-tight">
                Experiment – 3 Laboratory & Theory Reference
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrating React & Tailwind CSS Utility Classes on BiteOrder Menu System
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('utilities')}
            className={`py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'utilities'
                ? 'border-[#E8590C] text-[#E8590C] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tailwind Utility Classes (12 Covered)
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'theory'
                ? 'border-[#E8590C] text-[#E8590C] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Experiment Theory Q & A
          </button>
        </div>

        {/* Tab 1: Utilities breakdown */}
        {activeTab === 'utilities' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <p className="text-xs text-slate-600 bg-orange-50 p-3 rounded-xl border border-orange-100">
              💡 <strong>All 12 Experiment 3 Tailwind Categories</strong> are actively deployed across{' '}
              <code className="text-[#E8590C] font-mono">MenuCard.jsx</code>,{' '}
              <code className="text-[#E8590C] font-mono">CategoryFilter.jsx</code>, and{' '}
              <code className="text-[#E8590C] font-mono">CartSidebar.jsx</code>.
            </p>

            <div className="space-y-4">
              {utilityCategories.map((cat) => (
                <div
                  key={cat.name}
                  className="rounded-xl border border-slate-200 p-4 hover:border-slate-300 bg-slate-50/40 space-y-2.5 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                    <code className="text-[11px] font-mono text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded">
                      {cat.classes}
                    </code>
                  </div>
                  <p className="text-xs text-slate-600">{cat.description}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Live Demonstration:
                    </span>
                    {cat.demo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Theory Questions & Answers */}
        {activeTab === 'theory' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {theoryQnA.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-orange-200 space-y-1.5 transition-colors"
              >
                <h3 className="font-bold text-xs uppercase tracking-wide text-orange-700">
                  Q{idx + 1}. {item.q}
                </h3>
                <p className="text-xs leading-relaxed text-slate-700">{item.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Student: <strong>Ronit Ahuja</strong> • Roll No: <strong>63</strong> (D15A)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
