export default function formatCurrency(amount: number, currency: string) {
  const formattedNumber = Number(amount).toLocaleString("sq-AL", {
    style: "currency",
    currency: currency,
  });
  return formattedNumber;
}
