import { z } from "zed";

import { editTransactionFormSchema } from "./DetailsForm/form-schema";
import type { TransactionType } from "../01_Dashboard/types";

type TransactionDetailsProps = TransactionType & {
  formatedTransactionData: TransactionType[];
};

type EditTransactionFormValues = z.infer<typeof editTransactionFormSchema>;

export { TransactionDetailsProps, EditTransactionFormValues };
