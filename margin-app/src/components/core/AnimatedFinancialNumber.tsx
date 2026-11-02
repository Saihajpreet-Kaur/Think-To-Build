'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/calculations';

interface AnimatedFinancialNumberProps {
  valuePaise: number;
  durationMs?: number;
  compact?: boolean;
  prefix?: string;
  className?: string;
}

export default function AnimatedFinancialNumber({
  valuePaise,
  durationMs = 800,
  compact = false,
  prefix = '',
  className = '',
}: AnimatedFinancialNumberProps) {
  const [displayValue, setDisplayValue] = useState(valuePaise);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const diff = valuePaise - startValue;

    if (diff === 0) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Quintic ease out for Apple-like deceleration
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + diff * ease);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [valuePaise, durationMs]);

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {prefix}
      {formatCurrency(displayValue, compact)}
    </span>
  );
}
