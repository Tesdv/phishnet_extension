async function callAPI(body, link, method = "POST", headers = { "Content-Type": "text/plain" }) {
    const response = await fetch(link, {
        method: method,
        headers: headers,
        body: body
    });
    if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
    }
    return await response.json();
}