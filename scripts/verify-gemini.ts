import { searchAndResearchNews, generateEditorialTake } from "../lib/ai.ts";
import * as dotenv from "dotenv";

// Manually load .env.local for script
dotenv.config({ path: ".env.local" });

async function testMagic() {
    console.log("🚀 Initializing SF Magic (Gemini Research)...");

    const query = "ultimele știri despre inteligența artificială de astăzi 31 ianuarie 2026";
    console.log(`🔍 Searching for: "${query}"...`);

    const research = await searchAndResearchNews(query);

    if (research.success) {
        console.log("\n✅ Research successful! Here is the findings:");
        console.log("-----------------------------------------");
        console.log(research.data);
        console.log("-----------------------------------------");

        console.log("\n🖋️ Generating Editorial Take...");
        const take = await generateEditorialTake(research.data || "", 'ro');
        console.log("\n✨ AIPress Take:");
        console.log(take);
    } else {
        console.error("\n❌ Magic failure:", research.error);
        console.log("\n💡 Check if your Gemini key is correct or if you have enough quota.");
    }
}

testMagic();
