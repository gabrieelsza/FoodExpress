import { useRef, useState, useEffect } from 'react';

/**
 * ScrollReveal Component
 * Smoothly animates children into view when scrolling down and up.
 */
export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 700,
  distance = 32,
  threshold = 0.08,
  once = false,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Compute transform offset based on direction
  let hiddenTransform = `translateY(${distance}px)`;
  if (direction === 'down') hiddenTransform = `translateY(-${distance}px)`;
  if (direction === 'left') hiddenTransform = `translateX(-${distance}px)`;
  if (direction === 'right') hiddenTransform = `translateX(${distance}px)`;
  if (direction === 'zoom') hiddenTransform = 'scale(0.94)';

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0) scale(1)' : hiddenTransform,
    transitionProperty: 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
