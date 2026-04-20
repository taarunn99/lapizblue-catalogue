'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    els.forEach((el, i) => {
      // Stagger: each element delays by 40ms
      el.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
