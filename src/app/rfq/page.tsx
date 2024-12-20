// src/app/rfq/page.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
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
  market: string;
  side: string;
  from_currency: string;
  from_amount: string;
  to_currency: string;
  to_amount: string;
  rate: string;
  rate_is_from_currency: boolean;
  requested_at: number;
  expires_at: number;
  is_prefunded: boolean;
  sn: null;
  message: string;
}

export default function RFQPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [open, setOpen] = React.useState(false);

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
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    } else {
      alert("Please select a market and enter an amount");
    }
  };

  const getMarketText = (marketId: string | null) => {
    const market = markets.find((m) => m.id === marketId);
    if (market) {
      return `Buy ${market.base_currency.toUpperCase()} with ${market.quote_currency.toUpperCase()}`;
    }
    return "";
  };

  const getPlaceholderText = (marketId: string | null) => {
    const market = markets.find((m) => m.id === marketId);
    if (market) {
      return `Amount in ${market.quote_currency.toUpperCase()}`;
    }
    return "Amount";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-mirage-950">
      <section className="flex flex-col max-w-screen-lg min-w-96 justify-center items-center bg-slate-700 p-8 rounded-md">
        <h1 className="text-3xl font-bold mb-4 text-white">Request for Quote</h1>
        <p className="text-lg text-white mb-4">{getMarketText(selectedMarket)}</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {selectedMarket ? markets.find((market) => market.id === selectedMarket)?.name : "Select trading pair..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="PopoverContent w-full p-0">
            <Command>
              <CommandInput placeholder="Search trading pair..." />
              <CommandList>
                <CommandEmpty>No trading pair found.</CommandEmpty>
                <CommandGroup>
                  {markets.map((market) => (
                    <CommandItem
                      key={market.id}
                      value={market.id}
                      onSelect={(currentValue) => {
                        setSelectedMarket(currentValue === selectedMarket ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedMarket === market.id ? "opacity-100" : "opacity-0")} />
                      {market.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input type="number" placeholder={getPlaceholderText(selectedMarket)} value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-4" />
        <Button onClick={handleRequestQuote} className="mt-4 w-full py-6 bg-mirage-800 hover:bg-mirage-900 text-lg">
          Request Quote
        </Button>
        {quote && (
          <Card className="p-6 mt-4">
            <h2 className="text-xl font-bold mb-2">Quotation Details</h2>
            <p>
              Cost of the trade: {quote.from_amount} <span className="uppercase">{quote.from_currency}</span>
            </p>
            <p>
              Rate (Price per coin): {quote.rate} <span className="uppercase">{quote.from_currency}</span>
            </p>
            <p>
              Total amount of the asset you will receive:{" "}
              <span className="uppercase">
                {quote.to_amount} {quote.to_currency}
              </span>
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
