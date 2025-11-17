import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ApiResponse } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { messages } = await request.json();

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return ApiResponse.error("OpenAI API key is not configured", 500);
    }

    // Format messages for OpenAI API (only send last 10 messages to avoid token limits)
    const recentMessages = messages.slice(-10);
    const formattedMessages = recentMessages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    // Add system message for context
    const systemMessage = {
      role: "system",
      content:
        "You are a helpful college admissions assistant. Provide clear, concise, and helpful answers about SAT/ACT preparation, college applications, and academic planning.",
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...formattedMessages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      
      // Return more specific error message
      const errorMessage = errorData.error?.message || "Failed to get response from OpenAI";
      return ApiResponse.error(errorMessage, response.status);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      return ApiResponse.error("No response generated from OpenAI", 500);
    }

    // Save messages to database
    const lastUserMessage = recentMessages[recentMessages.length - 1];
    if (lastUserMessage?.role === "user") {
      await (supabaseAdmin.from("chat_messages") as any).insert([
        {
          user_id: user.id,
          role: "user",
          content: lastUserMessage.content,
        },
        {
          user_id: user.id,
          role: "assistant",
          content: assistantMessage,
        },
      ]);
    }

    return ApiResponse.success({ message: assistantMessage });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return ApiResponse.unauthorized();
    }
    console.error("Chat API error:", error);
    return ApiResponse.serverError(error.message || "Internal server error");
  }
}
