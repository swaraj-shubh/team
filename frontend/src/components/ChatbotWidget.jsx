import { useState, useRef, useEffect } from "react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

async function chatWithGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: "Give a short, precise, one-sentence answer: " + prompt }]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from Gemini."
    );
  } catch (err) {
    return "⚠️ Error contacting Gemini: " + err.message;
  }
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const question = input;
    setInput("");
    setIsTyping(true);

    const reply = await chatWithGemini(question);
    
    setIsTyping(false);
    const botMsg = { sender: "bot", text: reply };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed z-50 p-5 rounded-full shadow-2xl transition-all duration-300 ${
          open
            ? "bottom-6 right-6 bg-red-500 hover:bg-red-600 scale-90 rotate-90"
            : "bottom-6 right-6 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500"
        }`}
      >
        <div className="relative">
          <span className="text-2xl">💬</span>
          {messages.length > 0 && !open && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </div>
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-slate-800/50 backdrop-blur-sm z-50 flex flex-col animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-emerald-600 rounded-t-2xl p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Numerano Assistant</h3>
                <p className="text-white/80 text-xs">Powered by Gemini AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Clear chat"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Close chat"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 h-80 md:h-96 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center h-full flex flex-col items-center justify-center p-8">
                <div className="p-4 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 rounded-2xl mb-4">
                  <span className="text-3xl">👋</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Hello! I'm Numerano AI</h4>
                <p className="text-slate-400 text-sm">
                  Ask me anything about Numerano events, registration, or mathematics!
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInput("What is Numerano?")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300 transition-colors"
                  >
                    What is Numerano?
                  </button>
                  <button
                    onClick={() => setInput("How to register?")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300 transition-colors"
                  >
                    How to register?
                  </button>
                  <button
                    onClick={() => setInput("Event schedule")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300 transition-colors"
                  >
                    Event schedule
                  </button>
                  <button
                    onClick={() => setInput("Team requirements")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300 transition-colors"
                  >
                    Team requirements
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-none"
                          : "bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300 rounded-bl-none border border-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${
                          msg.sender === "user" ? "text-white/80" : "text-emerald-400"
                        }`}>
                          {msg.sender === "user" ? "You" : "Numerano AI"}
                        </span>
                        <span className="text-[10px] text-white/50">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300 rounded-2xl rounded-bl-none p-3 border border-slate-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-emerald-400">Numerano AI</span>
                        <span className="text-[10px] text-white/50">typing...</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-800/50">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-3 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all placeholder:text-slate-500"
                  placeholder="Ask about Numerano..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                />
                {input && (
                  <button
                    onClick={() => setInput("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                  input.trim() && !isTyping
                    ? "bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isTyping ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      )}

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}