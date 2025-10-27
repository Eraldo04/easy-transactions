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
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlusIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

const formSchema = z.object({
  category: z.string().max(50, "Ju lutem vendosni kategorinë"),
});
type FormValues = z.infer<typeof formSchema>;

const AddCategoryModal = () => {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: FormValues) {
    const currentTransactions = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );

    const updatedCategories = [
      ...currentTransactions,
      {
        id: Math.random().toString(36).substr(2, 9),
        category: data.category,
      },
    ];
    localStorage.setItem(
      "categories",
      updatedCategories && JSON.stringify(updatedCategories)
    );
    form.reset();
    window.location.reload();
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="gap-1">
          <CirclePlusIcon className="w-4 h-4" /> {t("Add category")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Details")}</AlertDialogTitle>
          <AlertDialogDescription>
            <form
              id="login-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FieldSet>
                <FieldGroup className="gap-0.5">
                  <FieldLegend>{t("Category")}</FieldLegend>
                  <Field>
                    <Input
                      type="text"
                      placeholder={t("category")}
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
            </form>
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

export default AddCategoryModal;
