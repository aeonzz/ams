import { client } from "@/lib/trigger";

export const runtime = "edge";

export async function POST(request: Request) {
  const incomingData = await request.json();
  return await client.handleRequest(request, incomingData);
}

