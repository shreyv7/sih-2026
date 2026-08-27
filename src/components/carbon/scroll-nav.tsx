import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScrollNavSection {
  id: string;
  label: string;
  shortLabel: string;
  badge?: string;
}

interface ScrollNavProps {
  sections: ScrollNavSection[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function ScrollNav({
  sections,
  containerRef,
  activeId: controlledActiveId,
  onSelect,
}: ScrollNavProps) {
  const [internalActiveId, setInternalActiveId] = useState<string>(sections[0]?.id ?? "");

  const activeId = controlledActiveId ?? internalActiveId;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section) continue;
        const sectionEl = container.querySelector(`#${section.id}`) as HTMLElement | null;
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setInternalActiveId(section.id);
            break;
          }
        }
      }
    };


    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, sections]);

  const scrollToSection = (id: string) => {
    onSelect?.(id);
    const container = containerRef.current;
    if (!container) return;
    const target = container.querySelector(`#${id}`) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Building Intelligence Sections"
      className="sticky top-4 right-0 z-30 hidden xl:flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/80 p-2 shadow-2xl backdrop-blur-xl transition-all"
    >
      <div className="px-2 py-1 border-b border-white/10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
          STAGES
        </p>
      </div>

      <div className="flex flex-col gap-1.5 py-1">
        {sections.map((s, index) => {
          const isActive = activeId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className={cn(
                "group relative flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-1.5 text-left transition-all cursor-pointer",
                isActive
                  ? "bg-emerald-500/15 border border-emerald-400/30 text-white shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-all",
                    isActive
                      ? "bg-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                      : "bg-white/10 text-slate-300 group-hover:bg-white/20"
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
                  {s.shortLabel}
                </span>
              </div>

              {s.badge && (
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-full uppercase font-medium tracking-wider",
                    isActive
                      ? "bg-emerald-400/20 text-emerald-300"
                      : "bg-white/5 text-slate-400"
                  )}
                >
                  {s.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
