"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatPanel({ open, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const storageKey = "rgg-chat-history";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore storage errors
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Request failed");
      }

      const reply = data?.reply ?? "(no response)";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open ? (
        <button
          aria-label="Close chat"
          className="absolute inset-0 z-20 cursor-default bg-black/20"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`absolute left-0 top-0 z-30 flex h-full w-full max-w-md flex-col border-r border-white/10 bg-black/80 text-white shadow-2xl backdrop-blur transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Chat</p>
            <p className="text-xs text-white/60">Gemini 2.5 Flash</p>
          </div>
          <button
            className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
          {messages.length === 0 ? (
            <p className="text-sm text-white/60">
              Ask anything to get started.
            </p>
          ) : null}

          {messages.map((msg, idx) => (
            <div
              key={`${msg.role}-${idx}`}
              className={`max-w-[90%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-white text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading ? (
            <div className="max-w-[80%] rounded-lg bg-white/10 px-3 py-2 text-sm text-white/70">
              Gemini is typing...
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded border border-white/20 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-white/60"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="rounded bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
