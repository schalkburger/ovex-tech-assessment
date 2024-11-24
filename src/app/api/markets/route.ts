// app/api/markets/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get("https://www.ovex.io/api/v2/markets");
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching markets" }, { status: 500 });
  }
}
