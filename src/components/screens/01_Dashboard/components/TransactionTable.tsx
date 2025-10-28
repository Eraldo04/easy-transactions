import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead as TH,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  TableHeadProps,
  TransactionTableProps,
  TransactionType,
} from "../types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ActionButton from "./ActionButton";
import AddTransactionModal from "../NestedScreens";
import type { CategoryTypes } from "../../03_Categories/types";

const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  filters,
}) => {
  const { t } = useTranslation();
  const headers = [
    "date",
    "amount",
    "amountEuro",
    "type",
    "category",
    "description",
    "currency",
  ];

  const categoryData = JSON.parse(localStorage.getItem("categories") || "[]");

  const TableHead: React.FC<TableHeadProps> = useCallback(
    ({ children }) => {
      if (children === "date")
        return (
          <DropdownMenu>
            <TH>
              <DropdownMenuTrigger className="flex focus:outline-none gap-1.5 justify-center items-center hover:bg-gray-200 ring-transparent ring-[5px] hover:ring-gray-200 rounded-[2px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 justify-center hover:bg-transparent"
                >
                  <span className="capitalize">{t("date", "date")}</span>
                  <ChevronsUpDown
                    className="ml-1 h-3.5 w-3.5"
                    strokeWidth={1.5}
                  />
                </Button>
              </DropdownMenuTrigger>
            </TH>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={"ASCENDING"}
                // TODO: It will set a seach param that will be used on query on index.tsx file
                onValueChange={(value) => {
                  filters.transactionFilter.setTransactionDateFilter(
                    value || "ASCENDING"
                  );
                }}
              >
                <DropdownMenuRadioItem
                  value="ASCENDING"
                  className="gap-1 cursor-pointer hover:bg-[#F36E22]-200"
                >
                  <span className="text-[#F36E22]">{t("Ascending")}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="DESCENDING"
                  className="gap-1 cursor-pointer hover:bg-amber-200"
                >
                  <span className="text-black-700">{t("Descending")}</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      if (children === "type")
        return (
          <DropdownMenu>
            <TH>
              <DropdownMenuTrigger className="flex focus:outline-none gap-1.5 justify-center items-center hover:bg-gray-200 ring-transparent ring-[5px] hover:ring-gray-200 rounded-[2px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 justify-center hover:bg-transparent"
                >
                  <span className="capitalize">{t("type", "type")}</span>
                  <ChevronsUpDown
                    className="ml-1 h-3.5 w-3.5"
                    strokeWidth={1.5}
                  />
                </Button>
              </DropdownMenuTrigger>
            </TH>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={filters.typeFilter.transactionTypeFilter}
                // TODO: It will set a seach param that will be used on query on index.tsx file
                onValueChange={(value) => {
                  filters.typeFilter.setTransactionTypeFilter(value || "all");
                }}
              >
                <DropdownMenuRadioItem
                  value="all"
                  className="gap-1 cursor-pointer hover:bg-[#F36E22]-200"
                >
                  <span className="text-[#F36E22]">{t("All")}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="INCOME"
                  className="gap-1 cursor-pointer hover:bg-[#F36E22]-200"
                >
                  <span className="text-[#F36E22]">{t("INCOME")}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="EXPENSE"
                  className="gap-1 cursor-pointer hover:bg-amber-200"
                >
                  <span className="text-black-700">{t("EXPENSE")}</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      if (children === "category")
        return (
          <DropdownMenu>
            <TH className="w-fit">
              <DropdownMenuTrigger className="flex focus:outline-none gap-1.5 justify-center items-center hover:bg-gray-200 ring-transparent ring-[5px] hover:ring-gray-200 rounded-[2px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 justify-center hover:bg-transparent"
                >
                  <span className="capitalize">
                    {t("category", "category")}
                  </span>
                  <ChevronsUpDown
                    className="ml-1 h-3.5 w-3.5"
                    strokeWidth={1.5}
                  />
                </Button>
              </DropdownMenuTrigger>
            </TH>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={filters.categoryFilter.transactionCategoryFilter}
                onValueChange={(value) => {
                  filters.categoryFilter.setTransactionCategoryFilter(value);
                }}
              >
                <DropdownMenuRadioItem
                  value="all"
                  className="gap-1 cursor-pointer hover:bg-[#F36E22]-200"
                >
                  <span className="text-[#F36E22]">{t("All")}</span>
                </DropdownMenuRadioItem>
                {categoryData.map((category: CategoryTypes) => {
                  return (
                    <DropdownMenuRadioItem
                      key={category.category}
                      value={category.category}
                      className="gap-1 cursor-pointer hover:bg-white"
                    >
                      <span className="text-black">{t(category.category)}</span>
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      return <TH>{t(`${children}`)}</TH>;
    },
    [filters.transactionFilter, t, data]
  );

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-xl border border-gray-300 bg-background text-foreground">
      <Table className="w-full">
        <TableHeader className="bg-gray-100">
          <TableRow className="border-b border-black">
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TH className="p-2">
              <AddTransactionModal />
            </TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data
            ? [...data]
                .sort((a, b) => {
                  const ascendingTime = new Date(a.date as string).getTime();
                  const descendingTime = new Date(b.date as string).getTime();
                  return filters.transactionFilter.transactionDateFilter ===
                    "ASCENDING"
                    ? ascendingTime - descendingTime
                    : descendingTime - ascendingTime;
                })
                .filter((category) => {
                  const selected =
                    filters.categoryFilter.transactionCategoryFilter || "all";
                  return selected === "all"
                    ? true
                    : category.category === selected;
                })
                .filter((type) => {
                  const selected =
                    filters.typeFilter.transactionTypeFilter || "all";
                  return selected === "all" ? true : type.type === selected;
                })
            : []
          ).map((transaction, idx) => (
            <TableRow
              key={transaction.id}
              className={cn(
                data && data.length <= 7 && "h-14",
                idx % 2 === 0
                  ? "bg-white hover:bg-white"
                  : "bg-gray-50 hover:bg-gray-50"
              )}
            >
              {headers.map((header) => (
                <TableCell
                  key={`${transaction.id}-${header}`}
                  className="whitespace-nowrap"
                >
                  {header === "date" ? (
                    <span>{format(transaction[header], "dd.MM.yyyy")}</span>
                  ) : header === "description" ? (
                    <span className="block max-w-48 overflow-hidden truncate">
                      {transaction[header as keyof TransactionType] as string}
                    </span>
                  ) : header === "amount" ? (
                    <span>{`${transaction[header]} ${transaction["currency"]}`}</span>
                  ) : header === "amountEuro" ? (
                    <span>{`€${transaction[header]}`}</span>
                  ) : (
                    t(`${transaction[header as keyof TransactionType]}`)
                  )}
                </TableCell>
              ))}

              <TableCell className="w-16 text-right">
                <ActionButton
                  id={transaction.id}
                  transaction_type={transaction.type}
                  data={data}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
