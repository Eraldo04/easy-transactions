import { useState } from "react";
import TransactionTable from "./components/TransactionTable";
import SummaryCharts from "./components/SummaryCharts";
import SimpleBarChart from "./components/Charts";
const DashboardScreen = () => {
  const currentData = localStorage.getItem("transactionsData");
  const [globalCurrency, setGlobalCurrency] = useState("EUR");
  const [transactionDateFilter, setTransactionDateFilter] =
    useState("ASCENDING");
  const [transactionCategoryFilter, setTransactionCategoryFilter] =
    useState("all");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");

  return (
    <div className="flex flex-col gap-4 h-full flex-1">
      <div className="w-full px-4 py-4">
        <div className="w-full overflow-x-auto">
          <TransactionTable
            data={currentData && JSON.parse(currentData)}
            filters={{
              transactionFilter: {
                transactionDateFilter,
                setTransactionDateFilter,
              },
              categoryFilter: {
                transactionCategoryFilter,
                setTransactionCategoryFilter,
              },
              typeFilter: {
                transactionTypeFilter,
                setTransactionTypeFilter,
              },
            }}
          />
        </div>
      </div>

      <div className="w-full px-4 space-y-4">
        <SummaryCharts
          data={currentData && JSON.parse(currentData)}
          globalCurrency={globalCurrency}
          setGlobalCurrency={setGlobalCurrency}
        />
        <SimpleBarChart
          transactionsData={currentData && JSON.parse(currentData)}
        />
      </div>
    </div>
  );
};

export default DashboardScreen;
