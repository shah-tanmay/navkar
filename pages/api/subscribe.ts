import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const CLIENT_ID = process.env.SENDPULSE_CLIENT_ID!;
const CLIENT_SECRET = process.env.SENDPULSE_CLIENT_SECRET!;
const ADDRESS_BOOK_ID = process.env.SENDPULSE_LIST_ID!; // Your mailing list ID

async function getAccessToken() {
  const res = await axios.post("https://api.sendpulse.com/oauth/access_token", {
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  return res.data.access_token;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const token = await getAccessToken();

    await axios.post(
      `https://api.sendpulse.com/addressbooks/${ADDRESS_BOOK_ID}/emails`,
      { emails: [{ email }] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.status(200).json({ message: "Subscription successful!" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to add email" });
  }
}
