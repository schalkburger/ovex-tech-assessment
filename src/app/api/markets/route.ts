// src/app/api/markets/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://www.ovex.io/api/v2/markets");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching markets" }, { status: 500 });
  }
}
