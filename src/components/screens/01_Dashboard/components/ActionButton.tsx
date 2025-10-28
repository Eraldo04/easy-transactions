import {
  MoreHorizontal,
  ReceiptTextIcon,
  ShieldBan,
  Trash2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ActionButtonProps } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ActionButton: React.FC<ActionButtonProps> = ({
  id,
  transaction_type,
  data,
}) => {
  const [isRemoveTransactionDialogOpen, setIsRemoveTransactionDialogOpen] =
    useState(false);
  const { t } = useTranslation();

  function deleteItemById(id: string) {
    const index = data && data.findIndex((item) => item.id === id);
    try {
      if (data && index) {
        data.splice(index, 1);
      }
      localStorage.setItem("transactionsData", JSON.stringify(data));
      toast("Transaction is deleted successfully.");
      window.location.reload();
    } catch {
      if (index === -1) {
        console.warn(`No item found with id "${id}".`);
        return;
      }
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-black hover:bg-opacity-[0.14]"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t(`${transaction_type}`)}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              to={{
                pathname: `/transactions/transaction/${id}`,
                search: "?variant=view",
              }}
              className="flex items-center gap-1"
            >
              <ReceiptTextIcon size={16} strokeWidth={1.5} />
              <span>{t("Go to profile")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="bg-red-100 hover:bg-red-200 flex items-center gap-1 text-red-700 cursor-pointer"
            onClick={() => {
              setIsRemoveTransactionDialogOpen(true);
            }}
          >
            <Trash2Icon size={16} strokeWidth={1.5} />
            <span>{t("Delete transaction")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isRemoveTransactionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("Deleting this transaction cannot be undone.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsRemoveTransactionDialogOpen(false)}
            >
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 flex items-center gap-1"
              onClick={() => deleteItemById(id)}
            >
              <ShieldBan size={16} strokeWidth={3} />
              <span>
                {t("Delete")} {t(transaction_type)}
              </span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionButton;
