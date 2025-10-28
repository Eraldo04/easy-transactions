export async function fetchEurRate(currency: string): Promise<number | null> {
  const cur = currency?.toUpperCase();
  if (!cur || cur === "EUR") return 1;
  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=EUR&to=${currency}`
    );
    const json = await res.json();
    const rate = json?.rates?.[cur];
    localStorage.setItem("rates", JSON.stringify(json));

    return typeof rate === "number" ? rate : null;
  } catch {
    return null;
  }
}
