
import { NextRequest, NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Stream API key or secret is not configured.' }, { status: 500 });
  }

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
  }

  const serverClient = StreamChat.getInstance(apiKey, apiSecret);
  const token = serverClient.createToken(userId);

  return NextResponse.json({ token }, { status: 200 });
}

