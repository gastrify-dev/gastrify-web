import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/features/notifications/actions/create-notification";

export async function POST(req: NextRequest) {
  const input = await req.json();
  const notification = await createNotification(input);
  return NextResponse.json({ notification });
}
