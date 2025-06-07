browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  try {
    await ensureTagExists("phishnet-warning", "Phishing Warning", "red");

    if (await isTagged(message.id, "phishnet-warning")) {
      console.log("Message tagged, skipping API call.");
      return;
    }

    const body = await getPlainTextBody(message.id);
    const prediction = await getPhishingPrediction(body);

    if (prediction === "phishing") {
      await tagMessage(message.id, "phishnet-warning");
    } else {
      console.log("Email is not phishing, no action taken.");
    }
  } catch (err) {
    console.error("Failed to process email:", err);
  }
});

async function getPlainTextBody(messageId) {
  const full = await browser.messages.getFull(messageId);
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
  return body;
}

async function getPhishingPrediction(body) {
  const response = await fetch("https://phishnetflask-production.up.railway.app/predict", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: body
  });
  const result = await response.json();
  return result.prediction;
}