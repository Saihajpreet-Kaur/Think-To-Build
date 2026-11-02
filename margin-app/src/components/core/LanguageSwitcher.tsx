'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export default function LanguageSwitcher({ className = '', compact = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, currentMeta } = useTranslation();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (langId: SupportedLanguage) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left z-50 ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Indian Language"
        className={`group flex items-center gap-2 rounded-xl border border-[rgba(201,208,218,0.2)] bg-[#101722]/90 font-mono text-xs font-semibold text-[#F5F7F3] backdrop-blur-md transition-all hover:border-[#83B8FF] hover:bg-[#182333] hover:shadow-[0_0_20px_rgba(131,184,255,0.25)] ${
          compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
        }`}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#182333] text-[#83B8FF] group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(131,184,255,0.3)]">
          <Globe size={13} className="animate-[spin_20s_linear_infinite]" />
        </div>
        <span className="font-bold text-[#E2E5EA]">
          {currentMeta.nativeName}
        </span>
        {!compact && (
          <span className="hidden sm:inline font-mono text-[10px] text-[#929BA8]">
            ({currentMeta.englishLabel})
          </span>
        )}
        <ChevronDown
          size={13}
          className={`text-[#929BA8] transition-transform duration-200 group-hover:text-[#83B8FF] ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Glassmorphic Obsidian Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-[rgba(201,208,218,0.25)] bg-[#090B10]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(131,184,255,0.15)] backdrop-blur-2xl"
            role="listbox"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-[rgba(201,208,218,0.12)] px-3 py-2 font-mono text-[10px]">
              <span className="text-[#83B8FF] font-bold tracking-wider">INDIAN LANGUAGES</span>
              <span className="text-[#929BA8]">13 ACTIVE</span>
            </div>

            {/* Language items ordered strictly as requested */}
            <div className="max-h-80 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-[rgba(201,208,218,0.2)]">
              {SUPPORTED_LANGUAGES.map((lang, index) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => handleSelect(lang.id)}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
                      isSelected
                        ? 'bg-[#182333] border border-[#83B8FF]/40 shadow-[0_0_15px_rgba(131,184,255,0.2)] text-[#F5F7F3]'
                        : 'hover:bg-[#101722] text-[#929BA8] hover:text-[#F5F7F3]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#090B10] font-mono text-[10px] text-[#83B8FF] font-bold border border-[rgba(201,208,218,0.1)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-[#E2E5EA]">
                          {lang.nativeName}
                        </span>
                        <span className="font-mono text-[10px] text-[#929BA8]">
                          {lang.englishLabel}
                          {lang.isRTL ? ' (RTL)' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="rounded-full bg-[#B9F36A]/15 border border-[#B9F36A]/40 px-2 py-0.5 font-mono text-[8px] font-extrabold text-[#B9F36A]">
                          PRIMARY
                        </span>
                      )}
                      {isSelected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#83B8FF] text-[#090B10] shadow-[0_0_8px_#83B8FF]">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick footer note */}
            <div className="border-t border-[rgba(201,208,218,0.1)] px-3 pt-2 pb-1 text-center font-mono text-[9px] text-[#929BA8]">
              Instant local client switch · Zero reload
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
