import { NextRequest, NextResponse } from "next/server";
import { getNotifications } from "@/features/notifications/actions/get-notifications";

export async function POST(req: NextRequest) {
  const { userId, locale } = await req.json();
  const notifications = await getNotifications({ userId, locale });
  return NextResponse.json({ notifications });
}
