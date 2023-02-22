// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const uri = process.env.MONGO_URI;
const mClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let domain = 'http://localhost:3000'

export default async function handler(req, res) {
    const { subType } = req.body;
    let priceId = ''
    if (subType === 'monthly') {
        priceId = 'price_1Me3TCGKFGesgQ29JlJKwrTY'
    } else if (subType === 'yearly') {
        priceId = 'price_1MeJiTGKFGesgQ29KzmF4A45'
    } else if (subType === 'lifetime') {
        priceId = 'price_1Me4L5GKFGesgQ298EOOdpSK'
    }
    
    if (req.method === 'POST') {
        try {
          // Create Checkout Sessions from body params.
          const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: priceId,
                quantity: 1,
              },
            ],
            mode: 'subscription',
            success_url: `${req.headers.origin}/upgrade?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/premium`,
            automatic_tax: {enabled: true},
          });
          res.json({url: session.url}) 
        } catch (err) {
          res.status(err.statusCode || 500).json(err.message);
        }
      } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};
