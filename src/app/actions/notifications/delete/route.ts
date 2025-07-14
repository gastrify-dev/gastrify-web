import { NextRequest, NextResponse } from "next/server";
import { deleteNotification } from "@/features/notifications/actions/delete-notification";

export async function POST(req: NextRequest) {
  const { notificationId, userId } = await req.json();
  await deleteNotification({ notificationId, userId });
  return NextResponse.json({ success: true });
}
