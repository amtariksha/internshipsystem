"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Message {
  role: "USER" | "ASSISTANT";
  content: string;
}

interface ChallengeData {
  title: string;
  description: string;
  starterContext: string;
  difficulty: number;
  timeLimitMinutes: number;
}

export default function AiCollabSessionPage() {
  const t = useTranslations("aiCollab");
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem(`ai_collab_${sessionId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setChallenge(data.challenge);
      setTimeRemaining(data.challenge.timeLimitMinutes);
      sessionStorage.removeItem(`ai_collab_${sessionId}`);
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1 / 60;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  async function handleSend() {
    if (!input.trim() || isSending) return;
    const userMessage = input.trim();
    setInput("");
    setIsSending(true);

    setMessages((prev) => [...prev, { role: "USER", content: userMessage }]);

    try {
      const res = await fetch("/api/ai-collab/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.expired) {
          await handleComplete();
          return;
        }
        setMessages((prev) => [...prev, { role: "ASSISTANT", content: `Error: ${data.error}` }]);
        return;
      }

      setMessages((prev) => [...prev, { role: "ASSISTANT", content: data.assistantResponse }]);
      setPromptsUsed(data.promptsUsed);
      setTimeRemaining(data.timeRemainingMinutes);
    } catch {
      setMessages((prev) => [...prev, { role: "ASSISTANT", content: "Network error. Please try again." }]);
    } finally {
      setIsSending(false);
    }
  }

  async function handleComplete() {
    router.push(`/ai-collab/complete/${sessionId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading challenge...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium">{challenge.title}</h2>
            <Badge variant="secondary" className="text-[10px]">
              Difficulty {challenge.difficulty}/5
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {t("timeRemaining", { minutes: Math.ceil(timeRemaining) })}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("promptsUsed", { count: promptsUsed })}
            </span>
            <Button size="sm" variant="outline" onClick={handleComplete} disabled={promptsUsed < 3}>
              {t("complete")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Problem Panel */}
        <div className="w-1/3 overflow-y-auto border-r border-border p-4">
          <h3 className="mb-2 text-sm font-medium">Problem</h3>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{challenge.description}</p>
          {challenge.starterContext && (
            <>
              <Separator className="my-3" />
              <h4 className="mb-1 text-xs font-medium">Starter Context</h4>
              <pre className="whitespace-pre-wrap rounded bg-muted p-2 font-mono text-xs">{challenge.starterContext}</pre>
            </>
          )}
        </div>

        {/* Chat Panel */}
        <div className="flex flex-1 flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground pt-8">
                Start by sending your first prompt to the AI assistant.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "USER"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("typePrompt")}
                rows={2}
                disabled={isSending || timeRemaining <= 0}
                className="resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isSending || timeRemaining <= 0}
                className="self-end"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
