import { useState } from "react";
import { askAIQuestion } from "../../services/chat.service";

const SUGGESTIONS = [
  "What are the most critical threats right now?",
  "Summarize all open incidents",
  "What did IP 192.168.1.1 do?",
];

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello Analyst. I'm S.H.I.E.L.D — ask me about any IP, attack, or incident." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (question?: string) => {
    const q = question || input;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askAIQuestion(q);
      setMessages(prev => [...prev, { role: "assistant", text: answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "⚠️ AI service unavailable. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-xl p-4 gap-3 border border-gray-700">
      <h2 className="text-green-400 font-bold text-sm tracking-widest uppercase">
        🛡 S.H.I.E.L.D — AI Security Assistant
      </h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg text-sm max-w-[85%] whitespace-pre-wrap ${
            m.role === "user"
              ? "bg-blue-700 text-white ml-auto"
              : "bg-gray-800 text-green-300"
          }`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-xs animate-pulse">
            S.H.I.E.L.D is analyzing...
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => sendMessage(s)}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded-full border border-gray-600">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-600 focus:border-green-500"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder='e.g. "What did IP 45.33.22.11 do?"'
          disabled={loading}
        />
        <button onClick={() => sendMessage()}
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Ask
        </button>
      </div>
    </div>
  );
}