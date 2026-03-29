const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const path = require("path");
app.use(express.static(path.join(__dirname, "../client")));

let world = {
    entropy: 40,
    stability: 60,
    deception: 10
};

// MOCK AI (replace later with real API)
async function getAIAction(agent) {

    // Replace this with OpenAI / Ollama later
    let actions = ["attack", "stabilize", "deceive"];

    return actions[Math.floor(Math.random()*actions.length)];
}

wss.on("connection", ws => {

    console.log("AI connected");

    ws.on("message", async (msg) => {

        let data = JSON.parse(msg);

        if (data.type === "TURN") {

            let updates = [];

            for (let agent of data.agents) {

                let action = await getAIAction(agent);

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