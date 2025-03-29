
import React from 'react';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  className?: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/lovable-uploads/96535f3c-8593-499e-9d04-1fd5a7aa9348.png" 
        alt="SUPMTI Logo" 
        className="h-10 w-auto"
      />
    </div>
  );
};

export default CompanyLogo;
