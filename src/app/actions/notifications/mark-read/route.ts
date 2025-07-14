import { NextRequest, NextResponse } from "next/server";
import { markNotificationRead } from "@/features/notifications/actions/mark-notification-read";

export async function POST(req: NextRequest) {
  const { notificationId, userId, read } = await req.json();
  await markNotificationRead({ notificationId, userId, read });
  return NextResponse.json({ success: true });
}
