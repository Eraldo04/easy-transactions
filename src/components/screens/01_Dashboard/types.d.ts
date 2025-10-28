interface TransactionType {
  description: string;
  date: string;
  amount: number;
  amountEuro: number;
  type: "INCOME" | "EXPENSE";
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
    categoryFilter: {
      transactionCategoryFilter: string;
      setTransactionCategoryFilter: (value: string) => void;
    };
    typeFilter: {
      transactionTypeFilter: string;
      setTransactionTypeFilter: (value: string) => void;
    };
  };
}

interface ActionButtonProps {
  id: string;
  transaction_type: string;
  data: TransactionType[] | null;
}

interface SummaryChartsProps {
  data: TransactionType[];
  globalCurrency: string;
  setGlobalCurrency: (data: string) => void;
}

export {
  TransactionType,
  transactionFilter,
  TableHeadProps,
  TransactionTableProps,
  ActionButtonProps,
  SummaryChartsProps,
};
