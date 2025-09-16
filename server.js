require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/verify-recaptcha', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );

    const data = response.data;

    if (data.success) {
      return res.status(200).json({ success: true, message: 'Human verified' });
    } else {
      return res.status(403).json({ success: false, message: 'Bot detected', errors: data['error-codes'] });
    }
  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
