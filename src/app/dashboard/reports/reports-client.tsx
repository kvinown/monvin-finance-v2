"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export function ReportsClient({ transactions }: { transactions: any[] }) {
  // Simple summary
  const income = transactions.filter(t => t.type === "INCOME" || t.type === "P2P_RECEIVED" || t.type === "SAVING_WITHDRAWAL").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "EXPENSE" || t.type === "P2P_SENT" || t.type === "SAVING_DEPOSIT").reduce((sum, t) => sum + Number(t.amount), 0);

  // Group by Category (for Expense Pie Chart)
  const expensesByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === "EXPENSE" || t.type === "P2P_SENT")
      .forEach(t => {
        const cat = t.category || "Uncategorized";
        categories[cat] = (categories[cat] || 0) + Number(t.amount);
      });
    return Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ['#1d4ed8', '#047857', '#b91c1c', '#c2410c', '#4338ca', '#be185d', '#0f766e', '#1e40af'];

  // Monthly Flow (Bar Chart)
  const monthlyFlow = useMemo(() => {
    const months: Record<string, { month: string, income: number, expense: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date || t.createdAt);
      const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!months[monthStr]) {
        months[monthStr] = { month: monthStr, income: 0, expense: 0 };
      }

      const amt = Number(t.amount);
      if (t.type === "INCOME" || t.type === "P2P_RECEIVED" || t.type === "SAVING_WITHDRAWAL") {
        months[monthStr].income += amt;
      } else if (t.type === "EXPENSE" || t.type === "P2P_SENT" || t.type === "SAVING_DEPOSIT") {
        months[monthStr].expense += amt;
      }
    });

    return Object.values(months);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
          <p className="text-sm font-medium text-primary opacity-80 mb-1">Total Income Flow</p>
          <p className="font-display-sm font-bold text-primary">{formatCurrency(income)}</p>
        </div>
        <div className="bg-error/10 border border-error/20 rounded-xl p-6">
          <p className="text-sm font-medium text-error opacity-80 mb-1">Total Expense Flow</p>
          <p className="font-display-sm font-bold text-error">{formatCurrency(expense)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Cash Flow (Monthly)</h3>
          {monthlyFlow.length === 0 ? (
            <p className="text-center text-sm text-on-surface-variant py-10">Not enough data to display chart.</p>
          ) : (
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFlow} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--on-surface-variant)" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--on-surface-variant)" }} tickFormatter={(val) => `Rp ${val/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: 'var(--surface-variant)' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }}
                    formatter={(value: any) => formatCurrency(Number(value) || 0)}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income" name="Income" fill="#047857" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#b91c1c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Expenses by Category</h3>
          {expensesByCategory.length === 0 ? (
            <p className="text-center text-sm text-on-surface-variant py-10">No expenses recorded yet.</p>
          ) : (
            <div className="h-80 w-full text-xs flex flex-col justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
