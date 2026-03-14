import AIChat from "../../components/dashboard/AIChat";

export default function Chat() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Security Assistant</h1>
        <p className="text-gray-400 text-sm mt-1">
          Ask S.H.I.E.L.D about any IP, attack pattern, or incident in plain English.
        </p>
      </div>
      <AIChat />
    </div>
  );
}