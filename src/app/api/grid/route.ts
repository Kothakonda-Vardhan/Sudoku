
import { NextResponse } from "next/server";
import { getRandomPuzzle } from "@/app/lib/mongodb";

export async function GET() {
  try {
    const grid = await getRandomPuzzle();

    // console.error(grid);
    if (!grid) {
        throw new Error("No puzzles found in DB");
    }

    // if (!grid.length) throw new Error("No puzzles found in DB");

    return NextResponse.json(grid);
  } catch (error) {
    console.error("Error fetching puzzle:", error);
    return NextResponse.json({ error: "Failed to load puzzle" }, { status: 500 });
  }
}