browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  try {
    await ensurePhishingTagExists();

    const full = await browser.messages.getFull(message.id);

    let body = "";
    const parts = full.parts || [];

    const walkParts = (parts) => {
      for (const part of parts) {
        if (part.contentType === "text/plain" && part.body) {
          body += part.body;
        } else if (part.parts) {
          walkParts(part.parts);
        }
      }
    };

    walkParts(parts);

    console.log("Email body:\n", body);

    const response = await fetch("https://phishnetflask-production.up.railway.app/predict", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: body
    });

    const result = await response.json();
    console.log("Prediction result:", result);

    if (result.prediction === "phishing") {
      await browser.messages.update(message.id, {
        tags: ["phishnet-warning"]
      });
      console.log('Applied custom tag "phishnet-warning"');
    } else {
      await browser.messages.update(message.id, {
        tags: []
      });
      console.log('Removed custom tag for legitimate message');
    }

  } catch (err) {
    console.error("Failed to process email:", err);
  }
});

async function tagMessage(messageId, prediction) {
  const tagId = prediction === "phishing" ? "$label1" : "$label2";

  try {
    await browser.messages.update(messageId, { tags: [tagId] });
    console.log(`Tag ${tagId} applied to message ${messageId}`);
  } catch (error) {
    console.error("Error tagging message:", error);
  }
}

async function ensurePhishingTagExists() {
  const existingTags = await browser.messages.listTags();
  const tagId = "phishnet-warning";

  const tagAlreadyExists = existingTags.some(tag => tag.key === tagId);

  if (!tagAlreadyExists) {
    await browser.messages.createTag(tagId, "Phishing Warning", "#FF0000");
    console.log("Created custom tag: Phishing Warning");
  } else {
    console.log("Tag already exists");
  }
}