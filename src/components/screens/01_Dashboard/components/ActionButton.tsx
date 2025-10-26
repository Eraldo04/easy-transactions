import { MoreHorizontal, ReceiptTextIcon, ShieldBan } from "lucide-react";
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

const ActionButton: React.FC<ActionButtonProps> = ({
  id,
  transaction_type,
}) => {
  const [isRemoveProductDialogOpen, setIsRemoveProductDialogOpen] =
    useState(false);
  const { t } = useTranslation();
  // const [guarantorIdSelected, setGuarantorIdSelected] = useState("");

  //   const [deleteGuarantor] = useMutation(DELETE_GUARANTOR);

  //   const handleDeleteGuarantor = () => {
  //     deleteGuarantor({
  //       variables: {
  //         guarantor_id: guarantorIdSelected,
  //       },
  //       refetchQueries: [GET_ALL_GUARANTORS],
  //     })
  //       .then(() => {
  //         setIsRemoveProductDialogOpen(false);
  //         setGuarantorIdSelected("");
  //         toast({
  //           variant: "default",
  //           title: `Garantori u fshi me sukses.`,
  //           description: "Të dhënat u ndryshuan me sukses.",
  //         });
  //       })
  //       .catch(() =>
  //       toast({
  //         variant: "destructive",
  //         title: "Gabim",
  //         description:
  //           "Operacioni nuk u krye me sukses. Ju lutemi të provoni përsëri.",
  //       }));
  //   };

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
          {/* <DropdownMenuItem
              className="bg-red-100 hover:!bg-red-200 flex items-center gap-1 !text-red-700 cursor-pointer"
              onClick={() => {
                setIsRemoveProductDialogOpen(true);
                setGuarantorIdSelected(bank_id);
              }}
            >
              <Trash2 size={16} strokeWidth={1.5} />
              <span>Fshij {bank_name}</span>
            </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isRemoveProductDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("Deleting this transaction cannot be undone.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsRemoveProductDialogOpen(false)}
            >
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 flex items-center gap-1"
              // onClick={() => handleDeleteGuarantor()}
            >
              <ShieldBan size={16} strokeWidth={3} />
              <span>
                {t("Delete")} {transaction_type}
              </span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionButton;
