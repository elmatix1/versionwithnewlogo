
import React from 'react';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'sidebar';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default',
  className 
}) => {
  // Déterminer les tailles en fonction du paramètre size
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  }[size];
  
  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  }[size];

  const isSidebar = variant === 'sidebar';
  
  return (
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      <div className={cn(
        "flex items-center justify-center rounded-md",
        isSidebar ? "bg-translogica-600 text-white" : "bg-translogica-50 text-translogica-600",
        {
          'p-1.5': size === 'sm',
          'p-2': size === 'md',
          'p-2.5': size === 'lg'
        }
      )}>
        <Truck size={iconSize} className="transition-transform group-hover:rotate-[5deg]" />
      </div>
      <span className={cn(
        "font-bold transition-colors",
        textSize,
        isSidebar ? "text-translogica-600" : "text-translogica-700"
      )}>
        TransLogica
      </span>
    </div>
  );
};

export default Logo;
