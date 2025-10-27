import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { TableHeadProps } from "../01_Dashboard/types";
import {
  TableHead as TH,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { CategoryTypes } from "./types";
import AddCategoryModal from "./NestedScreens";

const CategoriesScreen = () => {
  const { t } = useTranslation();
  const headers = ["category"];
  const data = localStorage.getItem("categories")
    ? JSON.parse(localStorage.getItem("categories") || "[]")
    : [
        { id: "1", category: "Food" },
        { id: "2", category: "Transport" },
        { id: "3", category: "Utilities" },
      ];

  const TableHead: React.FC<TableHeadProps> = useCallback(
    ({ children }) => {
      return <TH>{t(`${children}`)}</TH>;
    },
    [t]
  );

  return (
    <div className="flex flex-col w-full h-full">
      <Table className={cn("w-full table-auto", data?.length >= 7 && "flex-1")}>
        <TableHeader className="bg-gray-100 w-full">
          <TableRow className="border-b border-black">
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
            <TH className="p-2">
              <AddCategoryModal />
            </TH>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {data?.map((category: CategoryTypes, index: number) => (
            <TableRow
              key={category.id}
              className={cn(
                data?.length <= 7 && "h-14",
                index % 2 === 0
                  ? "bg-white hover:bg-white"
                  : "bg-gray-50 hover:bg-gray-50"
              )}
            >
              {headers.map((header) => (
                <TableCell
                  key={`${category.id}-${header}`}
                  className="whitespace-nowrap w-full"
                >
                  {t(`${category[header as keyof CategoryTypes]}`)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesScreen;
