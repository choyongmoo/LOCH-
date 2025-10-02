async function summarizeText(text) {
  const apiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "You are a precise meeting summarizer. \
            Your task is to produce a clear summary of meeting transcripts. \
            Follow these rules strictly:\n \
            - Output 3–7 concise bullet points.\n \
            - Include key decisions and action items.\n \
            - Be objective and avoid speculation.\n \
            - Write in the same language as the transcript. \
            If multiple languages are used, default to Korean.",
        },
        {
          role: "user",
          content: `Summarize the following transcript:\n\n${text}`,
        },
      ],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  return String(content).trim();
}
Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  try {
    const { text } = await req.json().catch(() => ({}));
    const plain = (typeof text === "string" ? text : "").trim();
    if (!plain) {
      return new Response(
        JSON.stringify({
          summary: "요약할 텍스트가 없습니다.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
    const summary = await summarizeText(plain);
    return new Response(
      JSON.stringify({
        summary,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message ?? String(err),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
