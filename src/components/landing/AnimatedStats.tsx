
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  duration?: number;
  prefix?: string;
  color?: string;
}

const AnimatedStat: React.FC<StatProps> = ({ 
  value, 
  suffix, 
  label, 
  duration = 2000, 
  prefix = "",
  color = "text-white"
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => {
      if (statRef.current) {
        observer.unobserve(statRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      const currentValue = Math.floor(startValue + (value - startValue) * easedProgress);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 200);

    return () => clearTimeout(timer);
  }, [value, duration, isVisible]);

  return (
    <Card 
      ref={statRef}
      className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md border-white/30 text-center hover:from-white/20 hover:to-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
    >
      <CardContent className="p-6 relative overflow-hidden">
        {/* Effet de particules flottantes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-6 right-6 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-4 left-8 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>

        <div className={`text-4xl md:text-5xl font-bold ${color} mb-3 transition-all duration-300 group-hover:scale-110`}>
          <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {prefix}{displayValue}{suffix}
          </span>
        </div>
        
        <div className="text-white/90 text-sm font-medium tracking-wide uppercase">
          {label}
        </div>

        {/* Barre de progression décorative */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-2000 ease-out"
            style={{
              width: isVisible ? '100%' : '0%',
              transitionDelay: '0.5s'
            }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

const AnimatedStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
      <AnimatedStat 
        value={95} 
        suffix="%" 
        label="Livraisons à l'heure" 
        color="text-white"
      />
      <AnimatedStat 
        value={20} 
        suffix="%" 
        label="Économie de carburant" 
        color="text-white"
      />
      <AnimatedStat 
        value={500} 
        suffix="+" 
        label="Véhicules suivis" 
        color="text-white"
      />
    </div>
  );
};

export default AnimatedStats;
