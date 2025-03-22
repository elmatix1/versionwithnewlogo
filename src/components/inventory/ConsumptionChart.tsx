
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', Huile: 4, Filtres: 3, Freinage: 1 },
  { name: 'Fév', Huile: 3, Filtres: 2, Freinage: 2 },
  { name: 'Mar', Huile: 5, Filtres: 4, Freinage: 3 },
  { name: 'Avr', Huile: 7, Filtres: 3, Freinage: 2 },
  { name: 'Mai', Huile: 6, Filtres: 5, Freinage: 4 },
  { name: 'Juin', Huile: 8, Filtres: 6, Freinage: 4 },
];

const config = {
  Huile: { color: '#10b981' },
  Filtres: { color: '#3b82f6' },
  Freinage: { color: '#f59e0b' },
};

interface ConsumptionChartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Tendances de consommation</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] w-full mt-4">
          <ChartContainer
            config={config}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Quantité utilisée', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Huile" fill="#10b981" name="Huile" />
                <Bar dataKey="Filtres" fill="#3b82f6" name="Filtres" />
                <Bar dataKey="Freinage" fill="#f59e0b" name="Freinage" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};
