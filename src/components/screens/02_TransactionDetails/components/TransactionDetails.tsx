import { CalendarIcon, Edit2, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TransactionDetailsProps } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormValues } from "../../01_Dashboard/NestedScreens";
import z from "zod";
import { cn } from "@/lib/utils";
import type { CategoryTypes } from "../../03_Categories/types";
import ViewModelField from "./ViewModelField";
import { fetchEurRate } from "@/components/libs/fetchEurRate";
import useFetchCurrencies from "@/components/libs/fetchCurrencies";

const formSchema = z.object({
  description: z.string().max(50, "Ju lutem vendosni email"),
  amount: z.string().max(50, "Ju lutem vendosni shumën"),
  type: z.string().max(50, "Ju lutem vendosni modelin"),
  category: z.string().max(50, "Ju lutem vendosni kategorinë"),
  currency: z.string().max(50, "Ju lutem vendosni monedhën"),
  date: z.string().max(50, "Ju lutem vendosni datën"),
});

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  description,
  date,
  amount,
  amountEuro,
  type,
  category,
  currency,
  id,
  formatedTransactionData,
}) => {
  const { "1": setSearchParams } = useSearchParams();
  const [searchParams] = useSearchParams();
  const variant = searchParams.get("variant");
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const categoryData = JSON.parse(localStorage.getItem("categories") || "[]");
  const currenciesData = useFetchCurrencies();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description,
      amount: String(amount),
      type: type,
      currency: currency,
      category: category,
      date: date,
    },
    mode: "onChange",
  });

  async function onSubmit(data: FormValues) {
    if (!id) return;
    const amountNum = Number(data.amount);

    const eurRate = await fetchEurRate(data.currency);
    const amountEuro =
      eurRate == null
        ? null
        : data.currency.toUpperCase() === "EUR"
        ? amountNum
        : Number((amountNum / eurRate).toFixed(2));

    const updatedList = formatedTransactionData.map((tx) =>
      String(tx.id) === String(id)
        ? {
            ...tx,
            date: data.date,
            amount: amountNum,
            amountEuro,
            type: data.type,
            currency: data.currency,
            category: data.category,
            description: data.description,
          }
        : tx
    );

    localStorage.setItem("transactionsData", JSON.stringify(updatedList));
    setSearchParams({ variant: "view" });
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = form;

  return (
    <Card className="p-4">
      <CardHeader className="w-full flex flex-row items-center justify-between px-0 py-0">
        <CardTitle className="px-0">{t("Details")}</CardTitle>

        {variant === "view" ? (
          <Button
            onClick={() => {
              setSearchParams({ variant: "edit" });
            }}
            variant="outline"
            size="sm"
            className="space-x-1"
          >
            <Edit2 className="w-5 h-5" strokeWidth={3} />
            <span>{t("Edit")}</span>
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="space-x-1"
              onClick={() => {
                setSearchParams({ variant: "view" });
              }}
            >
              <XIcon className="w-5 h-5" strokeWidth={3} />
              <span>{t("Cancel")}</span>
            </Button>

            <Button
              type="submit"
              form="login-form"
              className="space-x-1"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "..." : t("Save")}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <form
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full grid grid-cols-2 gap-4"
        >
          <FieldSet>
            <FieldGroup className="gap-0.5">
              <FieldLegend>Shuma</FieldLegend>
              <Field>
                {variant === "view" ? (
                  <ViewModelField>
                    {`${form.watch("amount") || "-"} ${form.watch("currency")}`}
                  </ViewModelField>
                ) : (
                  <>
                    <Input
                      type="number"
                      placeholder="Shuma"
                      autoComplete="amount"
                      aria-invalid={!!errors}
                      {...register("amount")}
                    />
                    {errors.amount && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                  </>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup className="gap-0.5">
              <FieldLegend>Shuma në euro</FieldLegend>
              <Field>
                <ViewModelField>{amountEuro || "-"} €</ViewModelField>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup className="gap-0.5">
              <FieldLegend>Data</FieldLegend>
              <Field>
                {variant === "view" ? (
                  <ViewModelField>
                    <p className="flex flex-row items-center justify-start gap-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(form.watch("date"), "dd.MM.yyyy")}
                    </p>
                  </ViewModelField>
                ) : (
                  <>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => {
                        const selected = field.value
                          ? new Date(field.value)
                          : undefined;

                        return (
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  "w-full justify-start bg-gray-100 border-gray-300",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-5 w-5" />
                                {selected
                                  ? format(selected, "dd.MM.yyyy")
                                  : "Zgjidh datën"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Calendar
                                mode="single"
                                selected={selected}
                                onSelect={(date) => {
                                  field.onChange(
                                    date ? date.toISOString() : ""
                                  );
                                  setOpen(false);
                                }}
                                weekStartsOn={1}
                                fromDate={new Date("1990-01-01")}
                                toDate={new Date("2070-12-31")}
                              />
                            </PopoverContent>
                          </Popover>
                        );
                      }}
                    />
                    {errors.date && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.date.message}
                      </p>
                    )}
                  </>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup className="gap-0.5">
              <FieldLegend>{t("Type")}</FieldLegend>
              <Field>
                {variant === "view" ? (
                  <ViewModelField>
                    {t(form.watch("type")) || "-"}
                  </ViewModelField>
                ) : (
                  <>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                          disabled={
                            currenciesData.isLoading || !!currenciesData.error
                          }
                        >
                          <SelectTrigger className="bg-gray-100 border-gray-300">
                            <SelectValue placeholder={t("Select model")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INCOME">
                              {t("income")}
                            </SelectItem>
                            <SelectItem value="EXPENSE">
                              {t("expense")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.currency && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.currency.message}
                      </p>
                    )}
                  </>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup className="gap-0.5">
              <FieldLegend>{t("Monedha")}</FieldLegend>
              <Field>
                {variant === "view" ? (
                  <ViewModelField>
                    {form.watch("currency") || "-"}
                  </ViewModelField>
                ) : (
                  <>
                    <Controller
                      name="currency"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          disabled={
                            currenciesData.isLoading || !!currenciesData.error
                          }
                        >
                          <SelectTrigger className="bg-gray-100 border-gray-300">
                            <SelectValue placeholder={t("Select currency")} />
                          </SelectTrigger>
                          <SelectContent>
                            {currenciesData.error ? (
                              <div className="px-2 py-1.5 text-sm text-red-600">
                                {t("Gabim gjatë marrjes së monedhave")}
                              </div>
                            ) : (
                              currenciesData.currencies.map((currency) => (
                                <SelectItem key={currency} value={currency}>
                                  {currency}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.currency && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.currency.message}
                      </p>
                    )}
                  </>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup className="gap-0.5">
              <FieldLegend>{t("Category")}</FieldLegend>
              <Field>
                {variant === "view" ? (
                  <ViewModelField>
                    {form.watch("category") || "-"}
                  </ViewModelField>
                ) : (
                  <>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                          disabled={
                            currenciesData.isLoading || !!currenciesData.error
                          }
                        >
                          <SelectTrigger className="bg-gray-100 border-gray-300">
                            <SelectValue placeholder={t("Select category")} />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData?.map(
                              (categoryData: CategoryTypes) => {
                                return (
                                  <SelectItem
                                    key={categoryData.id}
                                    value={categoryData.category}
                                  >
                                    {categoryData.category}
                                  </SelectItem>
                                );
                              }
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.currency && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.currency.message}
                      </p>
                    )}
                  </>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet className="col-span-2">
            <FieldGroup className="gap-0.5">
              <FieldLegend>Përshkrimi</FieldLegend>
              <Field>
                {variant === "view" ? (
                  <ViewModelField>
                    {form.watch("description") || "-"}
                  </ViewModelField>
                ) : (
                  <>
                    <Textarea
                      {...register("description")}
                      autoComplete="off"
                      className="bg-gray-100 border-gray-300 resize-none"
                      placeholder={t(
                        "You can provide a short description here"
                      )}
                      aria-invalid={!!errors.description}
                      maxLength={50}
                      rows={3}
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
