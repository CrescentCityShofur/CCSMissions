<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crescent City Shofur | CCS Missions</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
    
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaPRyrkFfUOmhQktzRS6rd1jMrGMnuzgI&libraries=places&callback=initMap" async defer></script>
    <script src="https://js.stripe.com/v3/"></script>

    <style>
        :root { --gold: #fcf6ba; }
        body { 
            font-family: 'Montserrat', sans-serif; 
            background-color: #0a0118;
            background-image: linear-gradient(rgba(10,1,24,0.96), rgba(15,5,30,0.98)), 
                              url('https://raw.githubusercontent.com/CrescentCityShofur/Shofur.Nola/main/nola.png');
            background-size: cover; background-position: center; background-attachment: fixed;
            color: #ffffff; 
        }
        .gold-shimmer {
            background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent;
            animation: shimmer 5s infinite linear; 
            background-size: 200% auto;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
        .glass-panel { 
            background: rgba(255, 255, 255, 0.03); 
            backdrop-filter: blur(20px); 
            border: 1px solid rgba(252, 246, 186, 0.1); 
            border-radius: 30px; 
        }
        .input-field {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            color: white; 
            border-radius: 0; 
            outline: none;
            transition: all 0.3s ease;
        }
        .input-field:focus { 
            border-color: var(--gold); 
            background: rgba(255,255,255,0.08); 
        }
        #map { height: 200px; border-radius: 12px; border: 1px solid rgba(252,246,186,0.3); margin-top: 12px; }
        #mapSpinner { display: none; text-align: center; font-size: 12px; padding: 8px; color: var(--gold); }
    </style>
</head>
<body class="flex flex-col items-center min-h-screen py-20 px-6 text-center">

    <header id="mainHeader" class="mb-16">
        <h1 style="font-family: 'Cinzel', serif;" class="text-4xl md:text-6xl gold-shimmer uppercase tracking-widest leading-none">Crescent City Shofur</h1>
        <p class="text-xl md:text-2xl font-light text-white lowercase tracking-widest mt-2">fueling</p>
        <p class="text-xs md:text-sm text-gray-500 uppercase tracking-[0.6em] mt-8">Coastal Consolidated Solutions</p>
    </header>

    <div id="infoPanels" class="w-full max-w-2xl space-y-6 mb-12 text-left">
        <div class="glass-panel p-8">
            <h3 class="text-xs text-[#fcf6ba] uppercase tracking-widest mb-4 font-bold">Founder’s Note</h3>
            <p class="text-sm font-light leading-relaxed text-gray-300 italic">"We operate at the intersection of logistics and legacy. Every transaction should leave our infrastructure stronger than we found it."</p>
        </div>
        <div class="glass-panel p-8">
            <h3 class="text-xs text-[#fcf6ba] uppercase tracking-widest mb-4 font-bold">Mission Statement</h3>
            <p class="text-sm font-light leading-relaxed text-gray-300">To steward the movement of the Gulf South through Local Tailored Excellence, optimizing the regional corridor with disciplined stewardship.</p>
        </div>
        <div class="glass-panel p-8">
            <h3 class="text-xs text-[#fcf6ba] uppercase tracking-widest mb-4 font-bold">Stakeholder Acknowledgment</h3>
            <p class="text-sm font-light leading-relaxed text-gray-300">A portion of every engagement is directed to the CCS Regional Growth Fund, fueling sustainable movement across the hub.</p>
        </div>
    </div>

    <div class="w-full max-w-md">
        <button onclick="revealCommand()" id="fuelBtn" class="w-full border-2 border-[#fcf6ba] py-6 px-10 text-[#fcf6ba] uppercase text-xs tracking-[0.5em] font-bold hover:bg-[#fcf6ba] hover:text-black transition-all duration-700">
            Fuel the Mission
        </button>

        <div id="commandCenter" class="hidden mt-12 space-y-4 text-left">
            <h2 class="text-[#fcf6ba] text-xs uppercase tracking-widest font-bold mb-6">Mission Authorization</h2>
            
            <input type="text" id="stakeholderName" placeholder="STAKEHOLDER NAME" class="input-field w-full p-4 text-xs tracking-widest uppercase">
            
            <div class="flex flex-col md:flex-row gap-4">
                <input type="email" id="stakeholderEmail" placeholder="EMAIL ADDRESS" class="input-field flex-1 p-4 text-xs tracking-widest">
                <input type="tel" id="stakeholderPhone" placeholder="PHONE NUMBER" class="input-field flex-1 p-4 text-xs tracking-widest">
            </div>
            
            <select id="bridgeType" onchange="updateMarkers()" class="input-field w-full p-4 text-xs tracking-widest bg-[#0a0118]">
                <option value="local">Local Bridge ($15 Min)</option>
                <option value="charter">Charter ($65/hr - 2hr Min Deposit)</option>
                <option value="tour">Tour Bridge (30+ Miles / Corridor)</option>
            </select>

            <input type="text" id="pickup" placeholder="PICKUP LOCATION" class="input-field w-full p-4 text-xs tracking-widest uppercase">
            <input type="text" id="dropoff" placeholder="DESTINATION" class="input-field w-full p-4 text-xs tracking-widest uppercase">
            
            <div id="mapSpinner" class="text-center text-xs py-2 hidden">
                <div class="inline-block w-5 h-5 border-2 border-t-transparent border-[#fcf6ba] rounded-full animate-spin"></div>
                Loading map...
            </div>
            <div id="map" class="w-full h-48 rounded-xl overflow-hidden mt-4 border border-white/20"></div>

            <div class="flex gap-4">
                <input type="date" id="date" class="input-field flex-1 p-4 text-xs tracking-widest text-gray-400">
                <input type="time" id="time" class="input-field flex-1 p-4 text-xs tracking-widest text-gray-400">
            </div>

            <div id="priceSection" class="mt-6 text-center py-4 border-t border-white/10">
                <p id="priceOutput" class="text-5xl gold-shimmer font-light">$0.00</p>
                <p id="priceDesc" class="text-xs text-gray-400 mt-2">Enter locations to see estimate</p>
            </div>

            <button onclick="dispatchMission()" class="w-full bg-[#fcf6ba] text-black py-6 text-xs font-black uppercase tracking-[0.5em] mt-8 hover:bg-white transition-all duration-300">
                Authorize Mission
            </button>
        </div>
    </div>

    <script>
        const stripe = Stripe('pk_live_51Sub4u00aruvjmQ2mvXyX7v3YFY11LEMViffvxVJ4rYQ03MyatLbE640LKBAZZnrji9z6RKB4irBb0MTdpTRrcXmW00Lhx0XJ2v');
        let map, directionsService;

        function initMap() {
            document.getElementById('mapSpinner').style.display = 'block';
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 29.9511, lng: -90.0715 },
                zoom: 11
            });
            directionsService = new google.maps.DirectionsService();
            document.getElementById('mapSpinner').style.display = 'none';
        }

        function updateMarkers() {
            const pickupVal = document.getElementById('pickup').value.toUpperCase();
            const dropoffVal = document.getElementById('dropoff').value.toUpperCase();
            const bridge = document.getElementById('bridgeType').value;

            if (pickupVal && dropoffVal) {
                directionsService.route({ origin: pickupVal, destination: dropoffVal, travelMode: 'DRIVING' }, (result, status) => {
                    if (status === 'OK') {
                        const leg = result.routes[0].legs[0];
                        const mi = leg.distance.value / 1609.34;
                        const min = leg.duration.value / 60;
                        let subtotal = 0;

                        const isToMSY = dropoffVal.includes("MSY") || dropoffVal.includes("AIRPORT") || dropoffVal.includes("ARMSTRONG");
                        const isFromMSY = pickupVal.includes("MSY") || pickupVal.includes("AIRPORT") || pickupVal.includes("ARMSTRONG");

                        if (isToMSY) subtotal = 45;
                        else if (isFromMSY) subtotal = 65;
                        else if (bridge === 'charter') subtotal = 130;
                        else if (bridge === 'tour' || mi > 30) subtotal = (mi * 1.31) + (min * 1.42);
                        else {
                            subtotal = 7 + (mi * 1.30) + (min * 0.50);
                            if (subtotal < 15) subtotal = 15;
                        }

                        const hour = new Date().getHours();
                        const nightFee = (hour >= 22 || hour < 5) ? 10 : 0;
                        const finalTotal = (subtotal * 1.10) + nightFee;

                        document.getElementById('priceOutput').innerText = '$' + finalTotal.toFixed(2);
                        document.getElementById('priceDesc').innerText = `MILEAGE: ${mi.toFixed(1)} | INCL. 10% GROWTH FUND`;
                    }
                });
            }
        }

        function revealCommand() {
            document.getElementById('commandCenter').classList.remove('hidden');
            document.getElementById('fuelBtn').style.display = 'none';
        }

        function dispatchMission() {
            const name = document.getElementById('stakeholderName').value;
            const email = document.getElementById('stakeholderEmail').value;
            const phone = document.getElementById('stakeholderPhone').value;
            const pickup = document.getElementById('pickup').value;
            const dropoff = document.getElementById('dropoff').value;
            const amountDisplay = document.getElementById('priceOutput').innerText;
            const amountCent = parseFloat(amountDisplay.replace('$', '')) * 100;

            if (!name || !email || amountCent === 0) { 
                alert("Authorization Error: Please define logistics."); 
                return; 
            }

            const subject = `MISSION AUTHORIZED: ${name.toUpperCase()}`;
            const body = `STAKEHOLDER: ${name}%0D%0APHONE: ${phone}%0D%0ALOGISTICS: ${pickup} TO ${dropoff}%0D%0AAUTHORIZED: ${amountDisplay}`;
            window.open(`mailto:CrescentCityShofur@Gmail.com?subject=${subject}&body=${body}`, '_blank');

            stripe.redirectToCheckout({
                lineItems: [{ price_data: { currency: 'usd', product_data: { name: 'CCS MISSION AUTHORIZATION' }, unit_amount: amountCent }, quantity: 1 }],
                mode: 'payment',
                successUrl: 'https://ccsmissions.com?success=true',
                cancelUrl: 'https://ccsmissions.com',
                customer_email: email,
            });
        }

        window.addEventListener('load', () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('success') === 'true') {
                document.getElementById('fuelBtn').style.display = 'none';
                document.getElementById('infoPanels').style.display = 'none';
                document.getElementById('mainHeader').innerHTML = `<h1 style="font-family: 'Cinzel', serif;" class="text-4xl gold-shimmer uppercase tracking-widest leading-none">Mission Authorized</h1>`;
                const cc = document.getElementById('commandCenter');
                cc.classList.remove('hidden');
                cc.innerHTML = `<div class="glass-panel p-12 text-center border border-[#fcf6ba]/30">
                    <p class="text-gray-300 mb-8 tracking-widest uppercase text-xs">Infrastructure Fueling Successful.</p>
                    <p class="text-sm text-gray-500 mb-8 italic">Dispatch has been notified. Expect a logistics text shortly.</p>
                    <button onclick="location.href='https://ccsmissions.com'" class="border border-[#fcf6ba] text-[#fcf6ba] px-8 py-3 text-xs uppercase tracking-widest font-bold">Return to Hub</button>
                </div>`;
            }
        });
    </script>
</body>
</html>
