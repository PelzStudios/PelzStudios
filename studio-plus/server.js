/**
 * Studio+ — Simulated Alexa+ Experience
 * ---------------------------------------------------------------
 * Express server that serves the web UI and proxies chat requests to
 * Amazon Bedrock (Claude). If AWS is not configured, the API reports
 * "demo" mode and the front-end falls back to built-in responses,
 * so the simulation always works (even offline).
 *
 * Built for the Amazon Developer Hackathon — Alexa+ track
 * (simulated-experience path) + AWS Builder mini challenge.
 */
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const REGION = process.env.AWS_REGION || "us-east-1";
const MODEL_ID =
  process.env.BEDROCK_MODEL_ID ||
  "us.anthropic.claude-3-5-haiku-20241022-v1:0";

const SYSTEM_PROMPT = `You are "Studio+", an AI content strategist living inside a simulated Alexa+ experience.
You help content creators plan, write, and grow on Instagram, TikTok, and YouTube.

Voice and rules:
- Be warm, concise, and practical. Use short sections, bullet lists, and bold labels.
- Always answer in Markdown the front-end can render (##, bullets, **bold**).
- You know content workflows deeply: content calendars, hooks, captions, hashtags,
  trend research, Reel/Short scripts, engagement strategy, and audience growth.
- When relevant, mention where Studio+ (the product) fits into the workflow.
- Keep answers focused and skimmable — creators are busy.
- If asked something outside content creation, answer briefly and gently steer back.`;

// Lazy-load the AWS SDK so the server still boots if dependencies are missing.
let bedrock = null;
try {
  const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");
  bedrock = { BedrockRuntimeClient, ConverseCommand };
} catch {
  console.log("[studio+] @aws-sdk/client-bedrock-runtime not found — run `npm install` to enable live AI mode.");
}

function hasAwsCredentials() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_PROFILE ||
    process.env.AWS_WEB_IDENTITY_TOKEN_FILE ||
    process.env.AWS_CONTAINER_CREDENTIALS_FULL_URI
  );
}

function aiMode() {
  return bedrock && hasAwsCredentials() ? "live" : "demo";
}

app.get("/api/health", (req, res) => {
  res.json({ mode: aiMode(), model: MODEL_ID, region: REGION });
});

app.post("/api/chat", async (req, res) => {
  if (aiMode() !== "live") {
    return res.status(503).json({
      error: "AWS credentials are not configured — the front-end will use demo mode.",
    });
  }

  const raw = Array.isArray(req.body && req.body.messages) ? req.body.messages : [];
  const messages = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12);

  if (!messages.length) {
    return res.status(400).json({ error: "No valid messages provided." });
  }

  try {
    const client = new bedrock.BedrockRuntimeClient({ region: REGION });
    const command = new bedrock.ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: SYSTEM_PROMPT }],
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: [{ text: m.content }],
      })),
    });

    const result = await client.send(command);
    const reply = (result.output && result.output.message && result.output.message.content
      ? result.output.message.content.map((c) => c.text || "").join("\n")
      : ""
    ).trim();

    res.json({ reply: reply || "(No response generated.)" });
  } catch (err) {
    console.error("[studio+] Bedrock error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log(`  Studio+ running: http://localhost:${PORT}`);
  console.log(`  AI mode: ${aiMode()}  |  Model: ${MODEL_ID}`);
  console.log("----------------------------------------");
});
