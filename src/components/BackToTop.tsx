import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={scrollToTop}
            size="icon"
            className={`
              fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg
              bg-primary hover:bg-primary/90 text-primary-foreground
              transform transition-all duration-300 ease-in-out
              hover:scale-110 hover:shadow-xl
              dark:shadow-2xl dark:shadow-black/50
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
            `}
            aria-label="Về đầu trang"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Về đầu trang</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
