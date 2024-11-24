// app/rfq/page.tsx
"use client";
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
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Request-for-Quote (RFQ)</h1>
    </div>
  );
}
