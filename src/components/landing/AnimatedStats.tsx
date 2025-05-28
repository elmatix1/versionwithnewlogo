
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  duration?: number;
}

const AnimatedStat: React.FC<StatProps> = ({ value, suffix, label, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
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
    }, 500);

    return () => clearTimeout(timer);
  }, [value, duration]);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
      <CardContent className="p-6">
        <div className="text-3xl md:text-4xl font-bold text-white mb-2">
          {displayValue}{suffix}
        </div>
        <div className="text-white/80 text-sm">{label}</div>
      </CardContent>
    </Card>
  );
};

const AnimatedStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
      <AnimatedStat value={95} suffix="%" label="Livraisons à l'heure" />
      <AnimatedStat value={20} suffix="%" label="Économie de carburant" />
      <AnimatedStat value={500} suffix="+" label="Véhicules suivis" />
    </div>
  );
};

export default AnimatedStats;
