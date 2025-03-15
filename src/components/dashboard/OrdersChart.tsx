
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';

interface OrderData {
  name: string;
  completed: number;
  pending: number;
}

interface OrdersChartProps {
  data: OrderData[];
  className?: string;
}

const OrdersChart: React.FC<OrdersChartProps> = ({ data, className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Commandes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `${value}`} 
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorCompleted)" 
                name="Complétées"
              />
              <Area 
                type="monotone" 
                dataKey="pending" 
                stroke="#64748b" 
                fillOpacity={1} 
                fill="url(#colorPending)" 
                name="En attente"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersChart;
