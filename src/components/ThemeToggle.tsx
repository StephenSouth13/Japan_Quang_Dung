import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showTooltip?: boolean;
}

export function ThemeToggle({ variant = 'ghost', size = 'icon', showTooltip = true }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const button = (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className="relative overflow-hidden"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
      }`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      }`} />
      <span className="sr-only">
        {theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
      </span>
    </Button>
  );

  if (!showTooltip) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
