import type { SummaryChartsProps, TransactionType } from "../types";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetchCurrencies from "@/components/libs/fetchCurrencies";
import { CircleXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchEurRate } from "@/components/libs/fetchEurRate";
import formatCurrency from "@/components/libs/formatCurrency";

const SummaryCharts: React.FC<SummaryChartsProps> = ({
  data,
  globalCurrency,
  setGlobalCurrency,
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"PROFIT" | "LOSS" | "NONE">("NONE");

  const currenciesData = useFetchCurrencies();

  const [eurRate, setEurRate] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      const response = await fetchEurRate(globalCurrency);
      setEurRate(response);
    })();
  }, [globalCurrency]);
  const incomes = data
    .filter((singleData: TransactionType) => singleData.type === "INCOME")
    .map((amount) => Number(amount.amountEuro))
    .reduce((a, b) => a + b, 0);

  const convertedIncomes = Number(
    eurRate == null
      ? null
      : globalCurrency.toUpperCase() === "EUR"
      ? incomes
      : (incomes * eurRate).toFixed(2)
  );

  const expenses = data
    .filter((singleData: TransactionType) => singleData.type === "EXPENSE")
    .map((amount) => Number(amount.amountEuro))
    .reduce((a, b) => a + b, 0);

  const convertedExpenses = Number(
    eurRate == null
      ? null
      : globalCurrency.toUpperCase() === "EUR"
      ? expenses
      : (expenses * eurRate).toFixed(2)
  );

  const totalBalance = convertedIncomes - convertedExpenses;

  useMemo(() => {
    if (totalBalance > 0) {
      setStatus("PROFIT");
    } else if (totalBalance < 0) {
      setStatus("LOSS");
    } else {
      setStatus("NONE");
    }
  }, [totalBalance]);

  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <CardDescription>{t("Total balance")}</CardDescription>
        <CardTitle className="flex flex-row items-center justify-between">
          <p
            className={`text-2xl ${
              totalBalance > 0
                ? "text-green-600"
                : totalBalance < 0
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {formatCurrency(totalBalance, globalCurrency)} (
            {status === "PROFIT"
              ? t("Profit")
              : status === "LOSS"
              ? t("Loss")
              : t("None")}
            )
          </p>
          <div className="flex flex-row items-center justify-end gap-2">
            {globalCurrency !== "EUR" && (
              <Button
                variant="ghost"
                className="hover:bg-transparent p-0 m-0 cursor-pointer"
                onClick={() => setGlobalCurrency("EUR")}
              >
                <CircleXIcon className="w-5 h-5 text-red-600" />
              </Button>
            )}
            <Select
              value={globalCurrency}
              disabled={currenciesData.isLoading || !!currenciesData.error}
              onValueChange={(val) => setGlobalCurrency(val)}
            >
              <SelectTrigger className="bg-gray-100 border-gray-300">
                <SelectValue placeholder={t("Select currency")} />
              </SelectTrigger>
              <SelectContent>
                {currenciesData.currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        <Card className="bg-green-50">
          <CardHeader className="pb-1">
            <CardDescription>{t("Incomes")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="font-medium">
              {formatCurrency(Number(convertedIncomes), globalCurrency)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardHeader className="pb-1">
            <CardDescription>{t("Expenses")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="font-medium">
              {formatCurrency(Number(convertedExpenses), globalCurrency)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardHeader className="pb-1">
            <CardDescription>{t("Status")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className={`font-medium ${
                totalBalance >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {status === "PROFIT" ? t("Profit") : t("Loss")}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default SummaryCharts;
