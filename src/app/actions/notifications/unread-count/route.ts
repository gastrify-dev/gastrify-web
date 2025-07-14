import { NextRequest, NextResponse } from "next/server";
import { getUnreadNotificationCount } from "@/features/notifications/actions/get-unread-count";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const count = await getUnreadNotificationCount({ userId });
  return NextResponse.json({ count });
}
