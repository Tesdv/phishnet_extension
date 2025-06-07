browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  try {
    await ensurePhishingTagExists();

    const msg = await browser.messages.get(message.id);
    if (msg.tags && msg.tags.includes("phishnet-warning")) {
      console.log("Message tagged, skipping API call.");
      return;
    }

    const full = await browser.messages.getFull(message.id);
    let body = "";
    const walkParts = (parts) => {
      for (const part of parts) {
        if (part.contentType === "text/plain" && part.body) {
          body += part.body;
        } else if (part.parts) {
          walkParts(part.parts);
        }
      }
    };
    walkParts(full.parts || []);

    const response = await fetch("https://phishnetflask-production.up.railway.app/predict", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: body
    });
    const result = await response.json();

    if (result.prediction === "phishing") {
      await browser.messages.update(message.id, { tags: ["phishnet-warning"] });
      console.log('Applied custom tag "phishnet-warning"');
    } else {
      console.log("Email is not phishing, no action taken.");
    }
  } catch (err) {
    console.error("Failed to process email:", err);
  }
});

async function ensurePhishingTagExists() {
  const existingTags = await browser.messages.listTags();
  const tagId = "phishnet-warning";
  if (!existingTags.some(tag => tag.key === tagId)) {
    await browser.messages.createTag(tagId, "Phishing Warning", "#FF0000");
    console.log("Created custom tag: Phishing Warning");
  }
}