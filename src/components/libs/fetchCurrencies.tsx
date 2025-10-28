'use client'
import { useEffect, useState } from "react";

const useFetchCurrencies = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/EUR"
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
  return { currencies, isLoading, error };
};

export default useFetchCurrencies;
