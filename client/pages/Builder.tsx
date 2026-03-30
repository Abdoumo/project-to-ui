import { useState } from "react";
import { Send, Plus, Settings, MessageSquare, Code, Zap } from "lucide-react";

type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Platform = "web" | "mobile" | null;

export default function Builder() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !platform) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          description: input,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from API");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `✨ **App Design Generated!**\n\n📐 **App Structure:**\n${data.appStructure || "Structure generation pending..."}\n\n🎨 **Screens:**\n${data.screens || "Screens generation pending..."}\n\n🎭 **Design System:**\n${data.designSystem || "Design system generation pending..."}\n\n💻 **Code Template:**\n${data.code || "Code generation pending..."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error generating app:", errorMessage);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `❌ Failed to generate app design: ${errorMessage}\n\nPlease try again or check your API configuration.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-foreground text-sm">AppForge</span>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition">
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 px-3 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground mb-3 px-2">
            Recent
          </div>
          <div className="space-y-2">
            {/* Placeholder items */}
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition truncate">
              E-commerce Platform
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition truncate">
              Task Management App
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition truncate">
              Fitness Tracker
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-border p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition">
            <MessageSquare className="h-4 w-4" />
            Help
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground">App Designer</h1>
            <div className="flex items-center gap-3">
              {platform && (
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  {platform === "web" ? "Web App" : "Mobile App"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {!platform ? (
            // Platform Selection
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  What are you building?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Choose your platform and describe your app idea. We'll generate beautiful UI designs and code.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPlatform("web")}
                  className="p-6 rounded-lg border border-border hover:border-accent bg-white hover:bg-accent/5 transition text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Code className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">Web App</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Build responsive websites and web applications with modern UI
                  </p>
                </button>

                <button
                  onClick={() => setPlatform("mobile")}
                  className="p-6 rounded-lg border border-border hover:border-accent bg-white hover:bg-accent/5 transition text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">Mobile App</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create beautiful mobile app designs for iOS and Android
                  </p>
                </button>
              </div>
            </div>
          ) : (
            // Chat Messages
            <>
              {messages.length === 0 ? (
                <div className="max-w-2xl mx-auto text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Ready to design your {platform === "web" ? "web" : "mobile"} app?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Describe your app idea and I'll generate beautiful screens, design system, and code
                  </p>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">Try describing:</p>
                    <ul className="text-left space-y-2">
                      <li className="p-3 rounded-lg bg-secondary/50 text-foreground">
                        "A task management app with dark mode and real-time collaboration"
                      </li>
                      <li className="p-3 rounded-lg bg-secondary/50 text-foreground">
                        "An e-commerce platform with product filtering and checkout flow"
                      </li>
                      <li className="p-3 rounded-lg bg-secondary/50 text-foreground">
                        "A social fitness app where users can share workouts"
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-2xl ${msg.type === "user" ? "ml-auto" : ""}`}
                  >
                    <div
                      className={`rounded-lg p-4 ${
                        msg.type === "user"
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary/50 text-foreground"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap space-y-3">
                        {msg.content.split("\n\n").map((paragraph, idx) => (
                          <div key={idx}>
                            {paragraph.split("\n").map((line, lineIdx) => {
                              const isBold = line.includes("**");
                              const text = line.replace(/\*\*/g, "");
                              return (
                                <div key={lineIdx} className={isBold ? "font-semibold" : ""}>
                                  {text}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="max-w-2xl">
                  <div className="rounded-lg p-4 bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Generating your app...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        {platform && (
          <div className="border-t border-border bg-white px-6 py-4">
            <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Describe your app idea..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
