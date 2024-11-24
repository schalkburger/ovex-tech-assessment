// app/rfq/page.tsx
"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useEffect, useState } from "react";

interface Market {
  id: string;
  name: string;
  base_currency: string;
  quote_currency: string;
  base_precision: number;
  quote_precision: number;
  rfq_enabled: boolean;
  indicative_pricing: boolean;
  base_currency_long: string;
  quote_currency_long: string;
}

interface Quote {
  cost: number;
  rate: number;
  total_amount: number;
}

export default function RFQPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch("/api/markets");
        const data = await response.json();
        setMarkets(data);
        // console.log("Markets data -->", data);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchMarkets();
  }, []);

  const handleRequestQuote = async () => {
    if (selectedMarket && amount) {
      try {
        const response = await fetch(`/api/rfq?market=${selectedMarket}&from_amount=${amount}`);
        const data = await response.json();
        setQuote({
          cost: data.cost,
          rate: data.rate,
          total_amount: data.total_amount,
        });
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    } else {
      alert("Please select a market and enter an amount");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-mirage-950">
      <section className="flex flex-col max-w-screen-lg min-w-96 justify-center items-center bg-slate-700 p-8 rounded-md">
        <h1 className="text-3xl font-bold mb-4 text-white">Request for Quote</h1>
        <Select onValueChange={(value) => setSelectedMarket(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a trading pair" />
          </SelectTrigger>
          <SelectContent>
            {markets.map((market) => (
              <SelectItem key={market.id} value={market.id}>
                {market.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-4" />
        <Button onClick={handleRequestQuote} className="mt-4">
          Request Quote
        </Button>
        {quote && (
          <Card className="p-6 mt-4">
            <h2 className="text-xl font-bold mb-2">Quotation Details</h2>
            <p>Cost of the trade: {quote.cost}</p>
            <p>Rate (Price per coin): {quote.rate}</p>
            <p>Total amount of the asset you will receive: {quote.total_amount}</p>
          </Card>
        )}
      </section>
    </div>
  );
}
