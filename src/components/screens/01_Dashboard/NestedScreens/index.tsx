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
import { CalendarIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

const formSchema = z.object({
  description: z.string().max(50, "Ju lutem vendosni email"),
  amount: z.string().max(50, "Ju lutem vendosni shumën"),
  type: z.string().max(50, "Ju lutem vendosni modelin"),
  category: z.string().max(50, "Ju lutem vendosni kategorinë"),
  currency: z.string().max(50, "Ju lutem vendosni monedhën"),
  date: z.string().max(50, "Ju lutem vendosni datën"),
});
type FormValues = z.infer<typeof formSchema>;

const AddTransactionModal = () => {
  const { t } = useTranslation();
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

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

    const updatedTransactions = [
      ...currentTransactions,
      {
        id: Math.random().toString(36).substr(2, 9),
        date: data?.date,
        amount: data.amount,
        type: data.type,
        currency: data.currency,
        category: data.category,
        description: data.description,
      },
    ];
    localStorage.setItem(
      "transactionsData",
      updatedTransactions && JSON.stringify(updatedTransactions)
    );
    console.log(updatedTransactions,'updatedTransactions');
    form.reset();
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = form;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/ALL"
        );
        const result = await response.json();
        const currencyCodes = Object.keys(result.rates);
        setCurrencies(currencyCodes);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">{t("Add transaction")}</Button>
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
                    <FieldLegend>{t("Model")}</FieldLegend>
                    <Field>
                      <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => field.onChange(val)}
                            disabled={isLoading || !!error}
                          >
                            <SelectTrigger className="bg-gray-100 border-gray-300">
                              <SelectValue placeholder={t("Choose model")} />
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
                            value={field.value}
                            onValueChange={(val) => field.onChange(val)}
                            disabled={isLoading || !!error}
                          >
                            <SelectTrigger className="bg-gray-100 border-gray-300">
                              <SelectValue placeholder={t("Choose currency")} />
                            </SelectTrigger>
                            <SelectContent>
                              {error ? (
                                <div className="px-2 py-1.5 text-sm text-red-600">
                                  {t("Gabim gjatë marrjes së monedhave")}
                                </div>
                              ) : (
                                currencies.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
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
                    <FieldLegend>Kategoria</FieldLegend>
                    <Field>
                      <Input
                        type="text"
                        placeholder="123456"
                        autoComplete="category"
                        aria-invalid={!!errors.category}
                        {...register("category")}
                      />
                      {errors.category && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.category.message}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet>
                  <FieldGroup className="gap-0.5">
                    <FieldLegend>Përshkrimi</FieldLegend>
                    <Field>
                      <Textarea
                        autoComplete="description"
                        className="bg-gray-100 border-gray-300 resize-none"
                        placeholder={t(
                          "You can provide a short description here"
                        )}
                        aria-invalid={!!errors.description}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-600 mt-1">
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
