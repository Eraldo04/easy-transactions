import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { TransactionType } from "../types";
import { useTranslation } from "react-i18next";

const SimpleBarChart = ({
  transactionsData,
}: {
  transactionsData: TransactionType[];
}) => {
  const { t } = useTranslation();

  const data = Object.values(
    transactionsData.reduce((selected, currentTransaction) => {
      const category = currentTransaction.category || "Other";
      const amount = Number(currentTransaction.amountEuro) || 0;
      if (!selected[category]) {
        selected[category] = { name: category, income: 0, expense: 0 };
      }
      if (currentTransaction.type === "INCOME")
        selected[category].income += amount;
      else if (currentTransaction.type === "EXPENSE")
        selected[category].expense += amount;
      return selected;
    }, {} as Record<string, { name: string; income: number; expense: number }>)
  );

  return (
    <BarChart
      width="100%"
      height={400}
      data={data}
      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={t("name")} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="income"
        fill="#4ade80"
        activeBar={<Rectangle fill="#22c55e" stroke="green" />}
      />
      <Bar
        dataKey="expense"
        fill="#f87171"
        activeBar={<Rectangle fill="#ef4444" stroke="red" />}
      />
    </BarChart>
  );
};

export default SimpleBarChart;
