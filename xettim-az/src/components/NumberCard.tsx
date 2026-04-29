import React from "react";
import { motion } from "motion/react";
import { MessageCircle, Crown, SignalHigh, Wifi, Share2 } from "lucide-react";
import { MobileNumber, formatPhoneNumber, generateWhatsAppLink } from "../lib/numbers";

interface NumberCardProps {
  item: MobileNumber;
}

export default function NumberCard({ item }: NumberCardProps): React.JSX.Element {
  const formatted = formatPhoneNumber(item.full_number);
  const waLink = generateWhatsAppLink(item.full_number, item.price);

  const getBrandColors = () => {
    if (item.isVip) return "from-brand-gold/10 via-brand-midnight to-brand-gold/5 border-brand-gold/30";
    return "from-brand-sidebar via-brand-midnight to-brand-input border-white/5";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 group border ${
        item.isVip 
          ? "bg-[#0c0f16]/80 border-brand-gold/10 hover:border-brand-gold/40 hover:shadow-[0_0_40px_rgba(251,191,36,0.12)]" 
          : "bg-[#0c0f16]/80 border-white/5 hover:border-brand-electric/30 hover:shadow-[0_0_40px_rgba(14,165,233,0.08)]"
      }`}
    >
      {/* Glossy Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      {/* Category Ribbon - Minimal & Glowy */}
      <div className="flex justify-between items-center mb-10">
        <div className={`px-2.5 py-0.5 rounded-md text-[8px] font-black tracking-[0.25em] uppercase border backdrop-blur-xl ${
          item.isVip 
            ? "bg-brand-gold/20 text-brand-gold border-brand-gold/40 shadow-[0_0_15px_rgba(251,191,36,0.2)]" 
            : "bg-white/5 text-gray-400 border-white/10"
        }`}>
          {item.category}
        </div>
        {item.isVip && (
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(251,191,36,1)]" />
        )}
      </div>

      {/* Main Content - Ultra Clean */}
      <div className="flex flex-col items-center mb-8">
        <h3 className={`text-xl md:text-2xl font-mono font-bold tracking-tight transition-colors duration-500 ${
          item.isVip ? "text-brand-gold" : "text-white group-hover:text-brand-electric"
        }`}>
          {formatted}
        </h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-base font-bold text-white/90">{item.price}</span>
          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">AZN</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="relative z-10">
        {item.status === 'available' ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full block text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              item.isVip 
                ? "bg-brand-gold/5 text-brand-gold border border-brand-gold/20 hover:bg-brand-gold hover:text-black" 
                : "bg-white/[0.03] text-white/60 border border-white/5 hover:bg-brand-electric hover:text-black hover:border-brand-electric"
            }`}
          >
            SİFARİŞ
          </a>
        ) : (
          <div className="w-full text-center py-2.5 rounded-lg bg-white/5 text-gray-700 text-[9px] font-black uppercase tracking-[0.2em] border border-white/5">
            SATILIB
          </div>
        )}
      </div>

      {/* Hover Shimmer - Golden / Electric */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${item.isVip ? 'via-brand-gold/5' : 'via-brand-electric/5'} to-transparent -translate-x-full group-hover:animate-shimmer`} 
             style={{ animationDuration: '2s' }} />
      </div>
    </motion.div>
  );
}
