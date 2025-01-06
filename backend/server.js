const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

var https = require('https');

app.use(cors());
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize Payment
app.post('/api/initialize-payment', async (req, res) => {
  const { email, amount } = req.body;

  const params = JSON.stringify({
    email,
    amount,
    callback_url: `${process.env.FRONTEND_URL}/payment/success`,
  });

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const paystackReq = https.request(options, paystackRes => {
    let data = '';

    paystackRes.on('data', (chunk) => {
      data += chunk;
    });

    paystackRes.on('end', () => {
      res.send(JSON.parse(data));
    });
  }).on('error', (error) => {
    console.error(error);
    res.status(500).send({ error: 'Failed to initialize payment' });
  });

  paystackReq.write(params);
  paystackReq.end();
});

// Verify Transaction
app.get('/api/verify-payment/:reference', async (req, res) => {
  const { reference } = req.params;
  console.log(reference)

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
    }
  };

  const paystackReq = https.request(options, paystackRes => {
    let data = '';

    paystackRes.on('data', (chunk) => {
      data += chunk;
    });

    paystackRes.on('end', () => {
      res.send(JSON.parse(data));
    });
  }).on('error', (error) => {
    console.error(error);
    res.status(500).send({ error: 'Failed to verify payment' });
  });

  paystackReq.end();
});

// Webhook endpoint
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash == req.headers['x-paystack-signature']) {
    const event = req.body;
    
    switch(event.event) {
      case 'charge.success':
        break;
      case 'transfer.success':
        break;
    }
  }

  res.send(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));