import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/better-auth/server";
import { getUnreadNotificationCount } from "@/features/notifications/actions/get-unread-count";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const count = await getUnreadNotificationCount({ userId });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("API /notifications/unread-count error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
