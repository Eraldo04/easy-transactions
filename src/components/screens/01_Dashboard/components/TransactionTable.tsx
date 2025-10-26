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

const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  filters,
}) => {
  const { t } = useTranslation();
  const headers = [
    "date",
    "amount",
    "type",
    "category",
    "description",
    "currency",
  ];

  const TableHead: React.FC<TableHeadProps> = useCallback(
    ({ children }) => {
      if (children === "date")
        return (
          <DropdownMenu>
            <TH>
              <DropdownMenuTrigger className="flex focus:outline-none gap-1.5 justify-center items-center hover:bg-gray-200 ring-transparent ring-[5px] hover:ring-gray-200 rounded-[2px]">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-2 justify-center"
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
                  className="gap-1 cursor-pointer"
                >
                  <span>{t("Descending")}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="DESCENDING"
                  className="gap-1 cursor-pointer hover:bg-[#F36E22]-200"
                >
                  <span className="text-[#F36E22]">{t("ACTIVE")}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="PASSIVE"
                  className="gap-1 cursor-pointer hover:bg-amber-200"
                >
                  <span className="text-amber-700">{t("INACTIVE")}</span>
                </DropdownMenuRadioItem>
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
      <Table className="w-full table-fixed">
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
          {data?.map((transaction, idx) => (
            <TableRow
              key={transaction.id}
              className={cn(
                data.length <= 7 && "h-14",
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
                  ) : (
                    t(`${transaction[header as keyof TransactionType]}`)
                  )}
                </TableCell>
              ))}

              <TableCell className="w-16 text-right">
                <ActionButton
                  id={transaction.id}
                  transaction_type={transaction.type}
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
