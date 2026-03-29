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

    let data = JSON.parse(msg.data);

    console.log(data);

    // Visual reaction
    nodes.forEach((n, i) => {
        n.scale.set(1 + Math.random(), 1 + Math.random(), 1 + Math.random());
    });
};
