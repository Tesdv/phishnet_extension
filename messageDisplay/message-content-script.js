async function showPhishnetBanner() {
  const result = await browser.runtime.sendMessage({
    command: "getPhishResult"
  });

  const banner = document.createElement("div");
  banner.className = "phishnetBanner";
  banner.innerText = `Prediction: ${result.prediction}`;

  if (result.prediction === "phishing") {
    banner.classList.add("phishing");
  }

  document.body.insertBefore(banner, document.body.firstChild);
}

showPhishnetBanner();