async function updateMarkers() {
    const p = document.getElementById('pickup').value;
    const d = document.getElementById('dropoff').value;
    const b = document.getElementById('bridgeType').value;
    const tm = document.getElementById('time').value;

    if (!p || !d || !tm) return; // Don't call if fields are empty

    try {
        const res = await fetch('/api/price', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pickup: p, dropoff: d, bridgeType: b, time: tm })
        });
        const data = await res.json();
        
        if (data.price) {
            document.getElementById('priceOutput').innerText = `$${data.price}`;
            document.getElementById('priceDesc').innerText = `${data.mi} MILES | 10% GROWTH FUND INCLUDED`;
            // ... (rest of your marker/button logic)
        }
    } catch (e) {
        document.getElementById('priceDesc').innerText = "LOGISTICS TIMEOUT";
    }
}
