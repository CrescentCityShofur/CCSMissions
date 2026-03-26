import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, customerEmail, customerName, meetingType, siteAddress, date, time } = req.body;

        // Validate required fields
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Build product description with consultation details
        const meetingLabels = {
            short: 'Short Consultation',
            long: 'Extended Consultation',
            coastal: 'Coastal Site Consultation'
        };
        const productName = meetingLabels[meetingType] || 'CCS Consultation';
        const description = `${productName} at ${siteAddress} on ${date} at ${time}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail || undefined,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { 
                        name: productName,
                        description: description,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            metadata: {
                customerName: customerName || '',
                meetingType: meetingType || '',
                siteAddress: siteAddress || '',
                date: date || '',
                time: time || '',
            },
            success_url: `${req.headers.origin}?success=true`,
            cancel_url: `${req.headers.origin}?canceled=true`,
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
}
