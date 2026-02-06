import express from "express";
import cors from "cors";

const app = express();

// Allow requests from Vite dev server
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
  }),
);

app.use(express.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    res.json({ output: data.response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ollama failed" });
  }
});

app.listen(3001, () =>
  console.log("🚀 AI server running on http://localhost:3001"),
);
