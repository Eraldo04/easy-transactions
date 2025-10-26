import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { UserContext } from "@/components/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z
    .string({
      message: "Ju lutem vendosni nje email te saktë",
    })
    .email(),
  password: z
    .string()
    .min(6, "Fjalëkalimi duhet të ketë të paktën 6 karaktere"),
  firstName: z.string().min(3, "Ju lutem vendosni emrin tuaj"),
  lastName: z.string().min(3, "Ju lutem vendosni mbiemrin tuaj"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginScreen = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
    mode: "onChange",
  });

  async function onSubmit(data: FormValues) {
    const u = await loginUser(data);
    if (u) navigate("/", { replace: true });
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form;

  return (
    <div className="w-screen grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col gap-4 p-6 md:p-10 col-span-2">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Hyni në llogarinë tuaj</CardTitle>
                <CardDescription>
                  Shkruani të dhënat tuaja për të vazhduar.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  id="login-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 w-full"
                >
                  <FieldSet>
                    <FieldGroup className="gap-0.5">
                      <FieldLegend>Emri</FieldLegend>
                      <Field>
                        <Input
                          type="text"
                          placeholder="Emri"
                          autoComplete="given-name"
                          aria-invalid={!!errors.firstName}
                          {...register("firstName")}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.firstName.message}
                          </p>
                        )}
                      </Field>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet>
                    <FieldGroup className="gap-0.5">
                      <FieldLegend>Mbiemri</FieldLegend>
                      <Field>
                        <Input
                          type="text"
                          placeholder="Mbiemri"
                          autoComplete="family-name"
                          aria-invalid={!!errors.lastName}
                          {...register("lastName")}
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.lastName.message}
                          </p>
                        )}
                      </Field>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet>
                    <FieldGroup className="gap-0.5">
                      <FieldLegend>Email</FieldLegend>
                      <Field>
                        <Input
                          type="email"
                          placeholder="test@shembull.com"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </Field>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet>
                    <FieldGroup className="gap-0.5">
                      <FieldLegend>Fjalëkalimi</FieldLegend>
                      <Field>
                        <Input
                          type="password"
                          placeholder="123456"
                          autoComplete="current-password"
                          aria-invalid={!!errors.password}
                          {...register("password")}
                        />
                        {errors.password && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.password.message}
                          </p>
                        )}
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </form>
              </CardContent>

              <CardFooter className="flex-col gap-2">
                <Button
                  type="submit"
                  form="login-form"
                  className="w-full"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Duke u futur..." : "Hyr"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://easypay.al/wp-content/uploads/2020/12/asistenti_besnik2.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginScreen;
