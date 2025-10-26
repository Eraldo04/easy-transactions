import { useState } from "react";
import TransactionTable from "./components/TransactionTable";
const DashboardScreen = () => {
  const currentData = localStorage.getItem("transactionsData");
  const [transactionDateFilter, setTransactionDateFilter] =
    useState("ASCENDING");
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
            }}
          />
        </div>
      </div>

      <div className="w-full px-4">
        <p>second part</p>
      </div>
    </div>
  );
};

export default DashboardScreen;
