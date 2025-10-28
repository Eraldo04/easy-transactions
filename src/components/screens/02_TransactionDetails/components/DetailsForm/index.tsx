import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, XIcon } from "lucide-react";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { useSearchParams } from "react-router-dom";
import { BankDetailsProps, EditBankFormValues } from "../types";
import { editBankFormSchema } from "./form-schema";
import {
  GET_ALL_BANKS,
  GET_BANK_BY_ID,
  GET_CURRENCY,
  GET_TABLE_OF_BANKS,
  GetCurrencyDataTypes,
} from "@/graphql/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "@/components/primitives/use-toast";
import { UPDATE_BANK } from "@/graphql/Mutations";
import { Separator } from "@/components/primitives/separator";
import NumberInput from "@/lib/numberInput";
import { useTranslation } from "react-i18next";
import type { TransactionDetailsProps } from "../../types";

const TransactionDetailsForm: React.FC<TransactionDetailsProps> = ({
  bank_account_number,
  bank_amount,
  bank_iban,
  bank_id,
  bank_name,
  bank_status,
  bank_swift,
  bank_currency,
}) => {
  const defaultValues: Partial<BankDetailsProps> = useMemo(
    () => ({
      bank_account_number,
      bank_amount: String(bank_amount),
      bank_iban,
      bank_name,
      bank_status: String(bank_status),
      bank_swift,
      bank_id,
      bank_currency,
    }),
    [
      bank_account_number,
      bank_amount,
      bank_iban,
      bank_name,
      bank_status,
      bank_swift,
      bank_id,
      bank_currency,
    ]
  );
  const { t } = useTranslation();

  const form = useForm<EditBankFormValues>({
    resolver: zodResolver(editBankFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { "1": setSearchParams } = useSearchParams();

  const [updateBank] = useMutation(UPDATE_BANK);
  const { data: currency }: GetCurrencyDataTypes = useQuery(GET_CURRENCY);

  function onSubmit(data: EditBankFormValues) {
    updateBank({
      errorPolicy: "all",
      variables: {
        bank_id: bank_id,
        new_bank_account_number: data?.bank_account_number,
        new_bank_amount: Number(data?.bank_amount),
        new_bank_iban: data?.bank_iban,
        new_bank_name: data?.bank_name,
        new_bank_status: data?.bank_status,
        new_bank_swift: data?.bank_swift,
        new_bank_currency: data?.bank_currency,
      },
      refetchQueries: [GET_BANK_BY_ID, GET_ALL_BANKS, GET_TABLE_OF_BANKS],
      onCompleted: () => {
        setSearchParams({ variant: "view" });
        toast({
          variant: "default",
          title: t("common.success", "Success"),
          description: t(
            "common.toastSuccesDescription",
            "Data succesfully changed"
          ),
          duration: 5000,
        });
      },
      onError: () => {
        // toast({
        //   variant: "destructive",
        //   title: "Gabim",
        //   description:
        //     "Operacioni nuk u krye me sukses. Ju lutemi të provoni përsëri.",
        //   duration: 5000,
        // });
      },
    });
  }

  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <CardHeader className="flex-row justify-between px-0 py-0">
              <CardTitle className="px-0">
                {t("common.details", "Details")}
              </CardTitle>
              <div className="space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="space-x-1 w-[98.58px]"
                  onClick={() => {
                    setSearchParams({ variant: "view" });
                  }}
                >
                  <XIcon size={14} strokeWidth={3} />
                  <span>{t("common.cancel", "Cancel")}</span>
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="space-x-1 w-[98.58px] disabled:opacity-100"
                  //   disabled={loading}
                  //   loading={loading}
                >
                  <Save size={14} strokeWidth={3} />
                  <span>{t("common.save", "Save")}</span>
                </Button>
              </div>
            </CardHeader>

            <div className="grid grid-cols-2 gap-2 pb-2">
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("bank.bank_name", "Bank name")}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-100 border-gray-300"
                        placeholder={t("bank.bank_name", "Bank name...")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bank_iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("bank.bank_iban", "IBAN")}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-100"
                        placeholder={`${t("bank.bank_iban", "IBAN")}...`}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pb-2">
              <FormField
                control={form.control}
                name="bank_swift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("bank.bank_swift", "SWIFT")}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-100"
                        placeholder={`${t("bank.bank_swift", "SWIFT")}...`}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("bank.bankCurrency", "Currency used")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      disabled={true}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-100 border-gray-300">
                          <SelectValue
                            placeholder={t(
                              "bank.bankCurrencyPlaceholder",
                              "Select currency"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {currency?.currency?.items?.map((currency, index) => (
                          <>
                            <SelectItem key={index} value={currency?.value}>
                              {currency?.value}
                            </SelectItem>
                            <Separator />
                          </>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pb-2">
              <FormField
                control={form.control}
                name="bank_account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("bank.bankCode", "Bank code")}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-100 border-gray-300"
                        placeholder={t("bank.code", "Code")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bank_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("bank.totalAmount", "Total amount")}
                    </FormLabel>
                    <FormControl>
                      <NumberInput
                        className="bg-gray-100 border-gray-300"
                        field={field}
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="grid grid-cols-2 gap-2 pb-2">
              <FormField
                control={form.control}
                name="bank_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statusi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-100">
                          <SelectValue placeholder="Statusi Bankes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="ACTIVE"
                          className="hover:!bg-emerald-200 focus:!bg-emerald-200"
                        >
                          <span className="bg-emerald-200 text-emerald-700 px-[10px] rounded-full font-semibold">
                            {t("ACTIVE")}
                          </span>
                        </SelectItem>
                        <SelectItem
                          value="INACTIVE"
                          className="hover:!bg-amber-200 focus:!bg-amber-200"
                        >
                          <span className="bg-amber-200 text-amber-700  px-[10px] rounded-full font-semibold">
                            {t("INACTIVE")}
                          </span>{" "}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div> */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailsForm;
