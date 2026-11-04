'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'fade';
}

/**
 * Wraps content in a div that fades/slides in when it enters the viewport.
 * Uses IntersectionObserver — fires once, then disconnects.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.07, rootMargin: '0px 0px -36px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hidden  = direction === 'up' ? 'opacity-0 translate-y-6' : 'opacity-0';
  const shown   = direction === 'up' ? 'opacity-100 translate-y-0' : 'opacity-100';

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? shown : hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
