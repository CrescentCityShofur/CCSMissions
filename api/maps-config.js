export default function handler(req, res) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: 'Google Maps API key not configured' });
    }
    
    res.status(200).json({ apiKey });
}
