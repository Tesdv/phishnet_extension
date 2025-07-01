async function callAPI(body, link, method = "POST", headers = { "Content-Type": "text/plain" }) {
    const maxRetries = 2;
    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            const response = await fetch(link, {
                method: method,
                headers: headers,
                body: body
            });

            if (!response.ok) {
                throw new Error(`API call failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            console.warn(`Attempt ${attempt + 1} failed: ${error}. Retrying in 3 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            attempt++;
        }
    }
}
