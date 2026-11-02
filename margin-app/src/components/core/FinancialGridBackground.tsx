'use client';

interface FinancialGridBackgroundProps {
  className?: string;
  showRays?: boolean;
}

export default function FinancialGridBackground({
  className = '',
  showRays = true,
}: FinancialGridBackgroundProps) {
  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden select-none -z-10 ${className}`}>
      {/* Deep Obsidian Black Base */}
      <div className="absolute inset-0 bg-[#090B10]" />

      {/* Atmospheric Volumetric Cosmic Haze (Deep Navy, Violet & Icy Blue) */}
      <div
        className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1100px] h-[750px] rounded-full opacity-35 blur-[160px]"
        style={{
          background: 'radial-gradient(circle, #101722 0%, #17243B 40%, #1A1735 65%, transparent 80%)',
        }}
      />

      <div
        className="absolute top-[40%] -right-[15%] w-[700px] h-[700px] rounded-full opacity-25 blur-[150px]"
        style={{
          background: 'radial-gradient(circle, #251B3E 0%, #101722 50%, transparent 75%)',
        }}
      />

      <div
        className="absolute -bottom-[20%] -left-[10%] w-[650px] h-[650px] rounded-full opacity-20 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, #1A3050 0%, transparent 70%)',
        }}
      />

      {/* Futuristic Metallic Silver Perspective Technical Grid Floor */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(201, 208, 218, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(201, 208, 218, 0.45) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black 25%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black 25%, transparent 80%)',
        }}
      />

      {/* Fine Horizon Scan Beam (Platinum / Icy Blue) */}
      {showRays && (
        <div
          className="absolute top-[48%] left-0 right-0 h-px opacity-20"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(131, 184, 255, 0.6) 50%, transparent)',
            boxShadow: '0 0 15px rgba(131, 184, 255, 0.4)',
          }}
        />
      )}
    </div>
  );
}
