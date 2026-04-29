import { motion } from "motion/react";
import { NumberCategory } from "../lib/numbers";

const PREFIXES = ["010", "050", "051", "055", "070", "077", "099"];
const CATEGORIES: NumberCategory[] = ["VİP", "Qızıl", "Gümüş", "Ardıcıl"];

interface FilterBarProps {
  activePrefix: string | null;
  setActivePrefix: (val: string | null) => void;
  activeCategory: NumberCategory | null;
  setActiveCategory: (val: NumberCategory | null) => void;
}

export default function FilterBar({ 
  activePrefix, 
  setActivePrefix, 
  activeCategory, 
  setActiveCategory 
}: FilterBarProps) {
  return (
    <div className="sticky top-18 z-40 bg-brand-midnight/80 backdrop-blur-xl border-b border-gray-800 py-4 px-6 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        
        {/* Prefixes */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold shrink-0">Prefikslər:</span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActivePrefix(null)}
              className={`px-4 py-2 rounded border text-sm font-bold transition-all shrink-0 ${
                activePrefix === null 
                ? "bg-brand-electric border-brand-electric text-black" 
                : "bg-brand-input border-gray-700 text-gray-400 hover:border-brand-electric"
              }`}
            >
              Hamısı
            </button>
            {PREFIXES.map(p => (
              <button
                key={p}
                onClick={() => setActivePrefix(p)}
                className={`px-4 py-2 rounded border text-sm font-bold transition-all shrink-0 ${
                  activePrefix === p 
                  ? "bg-brand-electric border-brand-electric text-black" 
                  : "bg-brand-input border-gray-700 text-gray-400 hover:border-brand-electric"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:block w-px h-6 bg-gray-800" />

        {/* Categories */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold shrink-0">Kateqoriyalar:</span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded border text-sm font-bold transition-all shrink-0 ${
                activeCategory === null 
                ? "bg-white text-black border-white" 
                : "bg-brand-input border-gray-700 text-gray-400 hover:border-brand-electric"
              }`}
            >
              Hər biri
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded border text-sm font-bold transition-all shrink-0 ${
                  activeCategory === c 
                  ? "bg-brand-gold border-brand-gold text-black" 
                  : "bg-brand-input border-gray-700 text-gray-400 hover:border-brand-electric"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
