// src/app/api/rfq/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market");
  const from_amount = searchParams.get("from_amount");
  const side = searchParams.get("side") || "buy";
  const to_amount = searchParams.get("to_amount") || "1";
  const prefunded = searchParams.get("prefunded") || "0";

  if (!market || !from_amount) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const url = new URL("https://www.ovex.io/api/v2/rfq/get_quote");
    url.searchParams.append("market", market);
    url.searchParams.append("from_amount", from_amount);
    url.searchParams.append("side", side);
    url.searchParams.append("to_amount", to_amount);
    url.searchParams.append("prefunded", prefunded);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      console.error("External API Error:", errorText);
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json({ error: "Error fetching quote" }, { status: 500 });
  }
}
