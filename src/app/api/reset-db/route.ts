// app/api/reset-db/route.ts
import { revertDataBase } from "@/actions/actions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await revertDataBase();
    return NextResponse.json({ message: "Database reverted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error while reverting database" },
      { status: 500 }
    );
  }
}
