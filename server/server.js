const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const path = require("path");
app.use(express.static(path.join(__dirname, "../client")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});
let world = {
    entropy: 40,
    stability: 60,
    deception: 10
};

// REAL API 
async function getAIAction(agentName, world) {

    const prompt = `
You are an intelligent AI agent in a strategic simulation.

World State:
Entropy: ${world.entropy}
Stability: ${world.stability}
Deception: ${world.deception}

Agent: ${agentName}

Choose ONE action:
- attack
- stabilize
- deceive

Respond ONLY with one word.
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content.trim().toLowerCase();
}

wss.on("connection", ws => {

    console.log("AI connected");

    ws.on("message", async (msg) => {

        let data = JSON.parse(msg);

        if (data.type === "TURN") {

            let updates = [];

            for (let agent of data.agents) {

                let action = await getAIAction(agent.name, world);

                if (action === "attack") world.entropy += 5;
                if (action === "stabilize") world.stability += 5;
                if (action === "deceive") world.deception += 5;

                updates.push({ name: agent.name, action });
            }

            ws.send(JSON.stringify({
                type: "UPDATE",
                world,
                updates
            }));
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on", PORT));
