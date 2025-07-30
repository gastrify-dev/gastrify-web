import axios from "axios";

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function getZoomAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "account_credentials");
  params.append("account_id", ZOOM_ACCOUNT_ID);

  const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString(
    "base64",
  );

  const res = await axios.post("https://zoom.us/oauth/token", params, {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  cachedToken = res.data.access_token;
  tokenExpiresAt = now + (res.data.expires_in - 60) * 1000; // 60s margen
  if (!cachedToken)
    throw new Error("No se pudo obtener el access token de Zoom");
  return cachedToken;
}

export async function createZoomMeeting({
  topic,
  startTime,
  duration,
  agenda,
}: {
  topic: string;
  startTime: string; // ISO string
  duration: number; // minutos
  agenda?: string;
}) {
  const token = await getZoomAccessToken();
  const res = await axios.post(
    `https://api.zoom.us/v2/users/me/meetings`,
    {
      topic,
      type: 2, // scheduled
      start_time: startTime,
      duration,
      agenda,
      timezone: "America/Guayaquil",
      settings: {
        join_before_host: false,
        waiting_room: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return res.data;
}

export async function deleteZoomMeeting(meetingId: string) {
  const token = await getZoomAccessToken();
  await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
