const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("scene") });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 5;

// Nodes (AI entities)
let nodes = [];

for (let i = 0; i < 3; i++) {
    let geo = new THREE.SphereGeometry(0.5);
    let mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    let sphere = new THREE.Mesh(geo, mat);

    sphere.position.x = i * 2 - 2;
    scene.add(sphere);
    nodes.push(sphere);
}

// Animate
function animate() {
    requestAnimationFrame(animate);

    nodes.forEach(n => {
        n.rotation.x += 0.01;
        n.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}
animate();

// WebSocket
const protocol = location.protocol === "https:" ? "wss://" : "ws://";
const ws = new WebSocket(protocol + location.host);

document.getElementById("turnBtn").onclick = () => {

    ws.send(JSON.stringify({
        type: "TURN",
        agents: [
            { name: "Alpha" },
            { name: "Beta" },
            { name: "Gamma" }
        ]
    }));
};

ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    console.log("🧠 AI UPDATE:", data);

    if (data.type === "UPDATE") {

        // Show actions visually
        data.updates.forEach(update => {
            console.log(update.name + " → " + update.action);
        });

        // Optional: display on screen
        const info = document.getElementById("info");
        if (info) {
            info.innerHTML = data.updates.map(u =>
                `${u.name}: ${u.action}`
            ).join("<br>");
        }
    }
};
   ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    console.log("🧠 AI UPDATE:", data);

    if (data.type === "UPDATE") {

        const info = document.getElementById("info");

        data.updates.forEach((update, i) => {

            console.log(update.name + " → " + update.action);

            // 🎨 COLOR BASED ON ACTION
            if (update.action === "attack") {
                nodes[i].material.color.set(0xff0000); // red
            }

            if (update.action === "stabilize") {
                nodes[i].material.color.set(0x00ff00); // green
            }

            if (update.action === "deceive") {
                nodes[i].material.color.set(0x8000ff); // purple
            }

            // ⚡ SCALE EFFECT
            nodes[i].scale.set(
                1 + Math.random() * 0.5,
                1 + Math.random() * 0.5,
                1 + Math.random() * 0.5
            );
        });

        // 📊 SHOW TEXT INFO
        if (info) {
            info.innerHTML = data.updates.map(u =>
                `${u.name}: ${u.action}`
            ).join("<br>");
        }
    }
};
