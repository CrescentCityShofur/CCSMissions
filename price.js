async function dispatchMission() {
    const btn = document.getElementById('authorizeBtn');
    btn.innerText = "DISPATCHING...";
    btn.disabled = true;

    // 1. Get the price from the screen
    const amt = Math.round(parseFloat(document.getElementById('priceOutput').innerText.replace('$', '')) * 100);

    try {
        // 2. Call your NEW create-checkout-session file
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amt })
        });
        const session = await response.json();

        // 3. Redirect to the secure Stripe vault
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        if (result.error) alert(result.error.message);
    } catch (e) {
        console.error("Dispatch Error:", e);
        btn.innerText = "AUTHORIZE MISSION";
        btn.disabled = false;
    }
}
