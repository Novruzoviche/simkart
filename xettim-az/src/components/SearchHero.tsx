import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NumberCategory, NumberPrefix } from "../lib/numbers";
import { useRef, useState, KeyboardEvent } from "react";

interface SearchHeroProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activePrefix: NumberPrefix | null;
  setActivePrefix: (val: NumberPrefix | null) => void;
  activeCategory: NumberCategory | null;
  setActiveCategory: (val: NumberCategory | null) => void;
}

export default function SearchHero({ 
  searchQuery, 
  setSearchQuery, 
  activePrefix, 
  setActivePrefix, 
  activeCategory, 
  setActiveCategory 
}: SearchHeroProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showPrefixes, setShowPrefixes] = useState(false);

  const tabs: { label: string; value: NumberCategory | null }[] = [
    { label: "Hamısı", value: null },
    { label: "VİP", value: "VİP" },
    { label: "Qızıl", value: "Qızıl" },
    { label: "Gümüş", value: "Gümüş" },
    { label: "Ardıcıl", value: "Ardıcıl" }
  ];

  const prefixes: NumberPrefix[] = ["010", "050", "051", "055", "070", "077", "099"];

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const currentDigits = searchQuery.padEnd(7, " ").split("");
    currentDigits[index] = value || " ";
    const newQuery = currentDigits.join("").trim();
    setSearchQuery(newQuery);

    if (value && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !searchQuery[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const digits = searchQuery.padEnd(7, " ").split("").slice(0, 7);

  return (
    <section className="fixed top-18 left-0 right-0 z-40 bg-brand-midnight/90 backdrop-blur-xl border-b border-white/5 md:h-20 py-3 md:py-0 flex items-center shadow-2xl">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
        
        {/* Left: Filters - Scrollable on mobile */}
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
          {/* Prefix Dropdown */}
          <div className="relative flex-shrink-0">
            <button 
              onClick={() => setShowPrefixes(!showPrefixes)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                activePrefix 
                ? 'bg-brand-electric/10 border-brand-electric/30 text-brand-electric' 
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
              }`}
            >
              <span>{activePrefix || "Prefiks"}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showPrefixes ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showPrefixes && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPrefixes(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 p-1.5 bg-[#0c0f16]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-50 grid grid-cols-2 gap-1 min-w-[120px]"
                  >
                    <button
                      onClick={() => { setActivePrefix(null); setShowPrefixes(false); }}
                      className="col-span-2 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/5 text-left text-gray-400"
                    >
                      Hamısı
                    </button>
                    {prefixes.map(p => (
                      <button
                        key={p}
                        onClick={() => { setActivePrefix(p); setShowPrefixes(false); }}
                        className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors ${
                          activePrefix === p ? 'bg-brand-electric text-black shadow-lg shadow-brand-electric/20' : 'hover:bg-white/5 text-gray-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-px bg-white/10 flex-shrink-0" />

          {/* Categories - Now scrollable */}
          <div className="flex gap-1 md:gap-2 flex-shrink-0">
            {tabs.map((tab) => (
              <button 
                key={tab.label}
                onClick={() => setActiveCategory(tab.value)}
                className={`text-[9px] font-black uppercase tracking-widest transition-all px-2 md:px-3 py-1.5 rounded-lg border whitespace-nowrap ${
                  activeCategory === tab.value 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "border-transparent text-gray-600 hover:text-gray-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          <div className="flex items-center gap-1 md:gap-1.5">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                value={digit === " " ? "" : digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                maxLength={1}
                placeholder="•"
                className="w-8 h-10 md:w-10 md:h-12 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-center text-lg md:text-xl font-mono font-bold text-brand-electric focus:border-brand-electric focus:outline-none transition-all placeholder:text-gray-800"
              />
            ))}
          </div>
          
          <button 
            onClick={() => setSearchQuery("")}
            className={`transition-colors p-2 rounded-full hover:bg-white/5 flex-shrink-0 ${searchQuery ? 'text-red-400' : 'text-gray-800'}`}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

