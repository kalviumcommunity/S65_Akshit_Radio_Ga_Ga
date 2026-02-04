import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = (body?.messages ?? []) as ChatMessage[];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 },
      );
    }

    const contents = messages
      .filter((m) => m.role === "user")
      .map((m) => ({ role: "user", parts: [{ text: m.content }] }));

    if (contents.length === 0) {
      return NextResponse.json(
        { error: "No user messages provided" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "Gemini API error" },
        { status: response.status },
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no response)";

    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
