import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { ICard } from '../App';

export const ChartComponent = ({ cardsData }: { cardsData: ICard[]}) => {
    const RADIAN = Math.PI / 180;
    //@ts-ignore
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          );
    };
    return (
        <PieChart width={500} height={500}>
            <Pie data={cardsData} dataKey="countTime" nameKey="counterName" cx="50%" cy="50%" outerRadius={200} fill="#8884d8" label={renderCustomizedLabel}>
                {cardsData.map((card, index) => <Cell key={`cell-${index}`} fill={card.color}/>
                )}
            </Pie>
        </PieChart>
    );
}