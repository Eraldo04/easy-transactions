import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { BanknoteArrowUpIcon, CalendarIcon } from "lucide-react";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import type { CategoryTypes } from "../../03_Categories/types";
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
export type FormValues = z.infer<typeof formSchema>;

const AddTransactionModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const categoryData = JSON.parse(localStorage.getItem("categories") || "[]");
  const currenciesData = useFetchCurrencies();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      type: "",
      currency: "",
      category: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: FormValues) {
    const currentTransactions = JSON.parse(
      localStorage.getItem("transactionsData") || "[]"
    );
    const amount = Number(data.amount);

    const eurRate = await fetchEurRate(data.currency);
    const amountEuro =
      eurRate == null
        ? null
        : data.currency.toUpperCase() === "EUR"
        ? amount
        : (amount / eurRate).toFixed(2);

    const updatedTransactions = [
      ...currentTransactions,
      {
        id: Math.random().toString(36).slice(2, 11),
        date: data.date,
        amount,
        amountEuro,
        type: data.type,
        currency: data.currency,
        category: data.category,
        description: data.description,
      },
    ];

    localStorage.setItem(
      "transactionsData",
      JSON.stringify(updatedTransactions)
    );

    form.reset();
    window.location.reload();
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = form;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          className="gap-2 w-full p-2 flex flex-row items-center justify-between"
        >
          <BanknoteArrowUpIcon className="w-4 h-4" /> {t("Add new")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Details")}</AlertDialogTitle>
          <AlertDialogDescription>
            <ScrollArea className="flex-1 space-y-2 pb-6 overflow-auto max-h-[60vh] mt-4">
              <form
                id="login-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <FieldSet>
                  <FieldGroup className="gap-0.5">
                    <FieldLegend>Shuma</FieldLegend>
                    <Field>
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
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSet>
                  <FieldGroup className="gap-0.5">
                    <FieldLegend>Data</FieldLegend>
                    <Field>
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
                                  <CalendarIcon className="mr-2 h-4 w-4" />
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
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSet>
                  <FieldGroup className="gap-0.5">
                    <FieldLegend>{t("Type")}</FieldLegend>
                    <Field>
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
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSet>
                  <FieldGroup className="gap-0.5">
                    <FieldLegend>{t("Monedha")}</FieldLegend>
                    <Field>
                      <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                            disabled={currenciesData.isLoading || !!currenciesData.error}
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
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet>
                  <FieldGroup className="gap-0.5">
                    <FieldLegend>{t("Category")}</FieldLegend>
                    <Field>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => field.onChange(val)}
                            disabled={currenciesData.isLoading || !!currenciesData.error}
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
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSet>
                  <FieldGroup className="gap-0.5">
                    <FieldLegend>{t("Description")}</FieldLegend>
                    <Field>
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
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </form>
            </ScrollArea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction>
            <Button
              type="submit"
              form="login-form"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "..." : t("Save")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddTransactionModal;
