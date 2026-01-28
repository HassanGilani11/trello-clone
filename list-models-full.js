const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function run() {
    const apiKey = "AIzaSyCSFWLcB4xUz__CEQ7dGZ9o1e2MNgMHMXY";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        const modelNames = data.models ? data.models.map(m => m.name).join('\n') : "No models found";
        fs.writeFileSync('available_models.txt', modelNames);
        console.log("Models written to available_models.txt");
    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
