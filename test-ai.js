const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    const apiKey = "AIzaSyCSFWLcB4xUz__CEQ7dGZ9o1e2MNgMHMXY";
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("SDK List Models Test:");
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("No models found:", data);
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
