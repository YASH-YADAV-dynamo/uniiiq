"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "When should I begin preparing for the SAT/ACT?",
    },
    {
      id: "2",
      role: "user",
      content:
        "When should I begin preparing for the SAT/ACT?\n\n**8th/9th Grade:** Focus on foundational skills in math, reading, and writing. Build strong study habits and time management skills.\n\n**10th Grade:** Start familiarizing yourself with the test format. Take practice tests to identify strengths and weaknesses.\n\n**11th Grade:** This is when serious preparation begins. Aim to take the SAT/ACT in the fall or spring of your junior year. Focus on targeted practice, review weak areas, and take multiple practice tests.\n\n**Goal:** Maximize your scores while balancing other academic responsibilities.",
    },
    {
      id: "3",
      role: "assistant",
      content: "When is the SAT conducted?",
    },
    {
      id: "4",
      role: "user",
      content:
        "The SAT is administered seven times a year, typically on the first Saturday of the month. The test dates are usually in:\n\n- March\n- May\n- June\n- August\n- October\n- November\n- December\n\nRegistration opens about a month before each test date. You can register on the College Board website.",
    },
    {
      id: "5",
      role: "assistant",
      content: "Do you recommend taking the PSAT?",
    },
    {
      id: "6",
      role: "user",
      content:
        "Yes, I highly recommend taking the PSAT! Here's why:\n\n1. **Practice:** It's excellent practice for the actual SAT, helping you get familiar with the test format and timing.\n\n2. **Identify Strengths/Weaknesses:** The results help you understand which areas need more focus.\n\n3. **National Merit Scholarship:** Taking the PSAT/NMSQT in 11th grade can qualify you for the National Merit Scholarship Program.\n\n4. **Test Format:** It helps you understand the structure and types of questions you'll encounter on the SAT.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // Get current session from Supabase (handles token refresh automatically)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Please sign in to continue");
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.data?.message || data.message || "No response generated",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error.message || "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">A</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 hidden md:block">
              Speak with our intelligent chatbot, to assist with any questions
              you have around anything, anytime!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-700 text-sm font-medium">S</span>
              </div>
              <span className="text-sm font-medium text-gray-900 hidden md:block">
                Scarlet
              </span>
              <button className="p-1 text-gray-600 hover:text-gray-900">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col border-2 border-solid border-gray-300 rounded-lg bg-white p-6">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                )}
                <div
                  className={`flex-1 ${
                    message.role === "assistant"
                      ? "flex flex-col items-end"
                      : "flex flex-col"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] border border-solid ${
                      message.role === "assistant"
                        ? "bg-green-100 text-black border-gray-300"
                        : "bg-white text-black border-gray-300"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-black">
                      {message.content}
                    </p>
                  </div>
                  {message.role === "assistant" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          // Handle edit - can be implemented later
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCopy(message.content)}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 flex-row-reverse">
                <div className="flex flex-col items-end">
                  <div className="bg-green-100 rounded-lg px-4 py-3 border border-solid border-gray-300">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response here..."
              className="flex-1 px-4 py-3 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

