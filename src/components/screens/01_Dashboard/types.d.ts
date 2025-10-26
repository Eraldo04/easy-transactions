interface TransactionType {
  description: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  currency: string;
  id: string;
}
interface TableHeadProps {
  children?: string | number;
}

interface TransactionTableProps {
  data: TransactionType[] | null;
  filters: {
    transactionFilter: {
      transactionDateFilter: string;
      setTransactionDateFilter: (value: string) => void;
    };
  };
}

interface ActionButtonProps {
  id: string;
  transaction_type: string;
}

export {
  TransactionType,
  transactionFilter,
  TableHeadProps,
  TransactionTableProps,
  ActionButtonProps,
};
