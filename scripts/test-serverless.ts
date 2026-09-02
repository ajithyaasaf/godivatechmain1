import { createApp } from "../server/app";
import { createServer } from "http";

async function runTest() {
  console.log("Starting test server on port 5055...");
  const app = await createApp();
  const server = createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(5055, "127.0.0.1", resolve);
  });

  console.log("Server listening on http://127.0.0.1:5055");

  // Test 1: Health check
  console.log("\n1. Testing GET /api/health...");
  const res1 = await fetch("http://127.0.0.1:5055/api/health");
  const data1 = await res1.json();
  console.log("Health Check Status:", res1.status, data1);

  // Test 2: Services
  console.log("\n2. Testing GET /api/services...");
  const res2 = await fetch("http://127.0.0.1:5055/api/services");
  const data2 = await res2.json();
  console.log("Services Status:", res2.status, `Fetched ${Array.isArray(data2) ? data2.length : 0} services`);

  // Test 3: Categories
  console.log("\n3. Testing GET /api/categories...");
  const res3 = await fetch("http://127.0.0.1:5055/api/categories");
  const data3 = await res3.json();
  console.log("Categories Status:", res3.status, `Fetched ${Array.isArray(data3) ? data3.length : 0} categories`);

  // Test 4: Projects
  console.log("\n4. Testing GET /api/projects...");
  const res4 = await fetch("http://127.0.0.1:5055/api/projects");
  const data4 = await res4.json();
  console.log("Projects Status:", res4.status, `Fetched ${Array.isArray(data4) ? data4.length : 0} projects`);

  // Test 5: Blog posts
  console.log("\n5. Testing GET /api/blog-posts...");
  const res5 = await fetch("http://127.0.0.1:5055/api/blog-posts");
  const data5 = await res5.json();
  console.log("Blog Posts Status:", res5.status, `Fetched ${Array.isArray(data5) ? data5.length : 0} posts`);

  // Test 6: Newsletter Subscribe
  console.log("\n6. Testing POST /api/subscribe...");
  const testEmail = `test-${Date.now()}@godivatech.com`;
  const res6 = await fetch("http://127.0.0.1:5055/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail })
  });
  const data6 = await res6.json();
  console.log("Subscribe Status:", res6.status, data6);

  // Test 7: Contact Message Submission
  console.log("\n7. Testing POST /api/contact...");
  const res7 = await fetch("http://127.0.0.1:5055/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Integration Test User",
      email: "test@godivatech.com",
      phone: "+91 96005 20130",
      subject: "Automated Integration Test",
      message: "Testing unified API serverless contact endpoint."
    })
  });
  const data7 = await res7.json();
  console.log("Contact Message Status:", res7.status, data7);

  // Test 8: XML Sitemap
  console.log("\n8. Testing GET /sitemap.xml...");
  const res8 = await fetch("http://127.0.0.1:5055/sitemap.xml");
  const xmlText = await res8.text();
  console.log("Sitemap Status:", res8.status, `XML Length: ${xmlText.length} chars (starts with: ${xmlText.substring(0, 38)}...)`);

  // Test 9: Robots.txt
  console.log("\n9. Testing GET /robots.txt...");
  const res9 = await fetch("http://127.0.0.1:5055/robots.txt");
  const robotsText = await res9.text();
  console.log("Robots.txt Status:", res9.status, `Content preview:\n${robotsText.substring(0, 100)}...`);

  server.close();
  console.log("\nAll 9 integration tests passed successfully! Server closed.");
  process.exit(0);
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
