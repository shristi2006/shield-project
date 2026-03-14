import Groq from "groq-sdk";
import { SecurityLog } from "../models/SecurityLog";
import { Incident } from "../models/Incident";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function queryRAG(userQuestion: string): Promise<string> {
  // --- RETRIEVAL ---
  const ipMatch = userQuestion.match(/\b(\d{1,3}\.){3}\d{1,3}\b/);

  let relevantLogs: any[] = [];
  let relevantIncidents: any[] = [];

  if (ipMatch) {
    const ip = ipMatch[0];
    relevantLogs = await SecurityLog.find({ ip }).sort({ createdAt: -1 }).limit(20);
    relevantIncidents = await Incident.find({ ip }).limit(5);
  } else {
    relevantLogs = await SecurityLog.find({ severity: { $in: ["HIGH", "CRITICAL"] } })
      .sort({ createdAt: -1 })
      .limit(15);
    relevantIncidents = await Incident.find({ status: { $ne: "RESOLVED" } })
      .sort({ createdAt: -1 })
      .limit(5);
  }

  // --- BUILD CONTEXT ---
  const logContext = relevantLogs.length
    ? relevantLogs.map(l =>
        `[${l.createdAt}] IP: ${l.ip} | Type: ${l.attackType} | Severity: ${l.severity} | Endpoint: ${l.endpoint} | Payload: ${JSON.stringify(l.payload?.body || l.payload?.query || {})}`
      ).join("\n")
    : "No relevant logs found.";

  const incidentContext = relevantIncidents.length
    ? relevantIncidents.map((i: any) =>
        `Incident #${i._id} | Status: ${i.status} | Priority: ${i.priority} | Notes: ${i.notes || "None"}`
      ).join("\n")
    : "No relevant incidents found.";

  // --- PROMPT ---
  const prompt = `You are S.H.I.E.L.D, an expert AI Security Analyst inside the MicroSOC Command Center.
Answer using ONLY the context below. Be concise, technical, and suggest next steps.

=== RECENT LOGS ===
${logContext}

=== OPEN INCIDENTS ===
${incidentContext}

=== ANALYST QUESTION ===
${userQuestion}`;

  // --- GENERATE ---
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",  // free, fast, reliable
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || "No response generated.";
}
