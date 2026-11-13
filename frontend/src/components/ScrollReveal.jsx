import { useRef, useState, useEffect } from 'react';

/**
 * ScrollReveal Component
 * Smoothly animates children into view when scrolling down and up.
 * Replicates the modern momentum & focus-in (blur + scale + translate) effects from convertecom.com.br.
 */
export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 800,
  distance = 36,
  threshold = 0.08,
  withBlur = true,
  withScale = true,
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
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Compute transform offset based on direction
  const scalePart = withScale ? ' scale(0.97)' : '';
  let hiddenTransform = `translateY(${distance}px)${scalePart}`;
  if (direction === 'down') hiddenTransform = `translateY(-${distance}px)${scalePart}`;
  if (direction === 'left') hiddenTransform = `translateX(-${distance}px)${scalePart}`;
  if (direction === 'right') hiddenTransform = `translateX(${distance}px)${scalePart}`;
  if (direction === 'zoom') hiddenTransform = 'scale(0.92)';

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0) scale(1)' : hiddenTransform,
    filter: withBlur ? (isVisible ? 'blur(0px)' : 'blur(5px)') : undefined,
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform, filter',
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
