import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import TransactionDetails from "./components/TransactionDetails";
import type { TransactionType } from "../01_Dashboard/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const TransactionDetailsScreen = () => {
  const { transactionId: transactionIdParams } = useParams();
  const { t } = useTranslation();
  const transactionData = localStorage.getItem("transactionsData");
  const formatedTransactionData: TransactionType[] = transactionData
    ? JSON.parse(transactionData)
    : null;

  const singleTransactionData = formatedTransactionData.filter(
    (singleTransaction) =>
      String(singleTransaction.id) === String(transactionIdParams)
  );

  const transactionDetailsData = useMemo(
    () => ({
      id: singleTransactionData[0]["id"] ?? "",
      amount: singleTransactionData[0]["amount"] ?? "",
      amountEuro: singleTransactionData[0]["amountEuro"] ?? "",
      category: singleTransactionData[0]["category"] ?? "",
      currency: singleTransactionData[0]["currency"] ?? "",
      date: singleTransactionData[0]["date"] ?? "",
      description: singleTransactionData[0]["description"] ?? "",
      type: singleTransactionData[0]["type"] ?? "",
    }),
    [singleTransactionData]
  );

  return (
    <div className="flex flex-col gap-4 h-full flex-1 p-4">
      <div className="w-full flex flex-row items-center justify-end">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> {t("Go back")}
          </Button>
        </Link>
      </div>
      <TransactionDetails
        id={transactionDetailsData["id"]}
        amount={transactionDetailsData["amount"]}
        amountEuro={transactionDetailsData["amountEuro"]}
        category={transactionDetailsData["category"]}
        currency={transactionDetailsData["currency"]}
        date={transactionDetailsData["date"]}
        description={transactionDetailsData["description"]}
        type={transactionDetailsData["type"]}
        formatedTransactionData={formatedTransactionData}
      />
      <div className="flex justify-between items-center"></div>
    </div>
  );
};

export default TransactionDetailsScreen;
