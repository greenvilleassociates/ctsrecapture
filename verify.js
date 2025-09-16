const axios = require('axios');

module.exports = async function (context, req) {
  const token = req.body['g-recaptcha-response'];
  const secretKey = process.env.6LdoossrAAAAAOklNRmrCHCqhuWUeg5Vje-s_klM;

  const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await axios.post(verificationURL, null, {
      params: {
        secret: secretKey,
        response: token
      }
    });

    if (response.data.success) {
      context.res = {
        status: 200,
        body: "Verification successful!"
      };
    } else {
      context.res = {
        status: 403,
        body: "Verification failed."
      };
    }
  } catch (error) {
    context.res = {
      status: 500,
      body: "Error verifying reCAPTCHA"
    };
  }
};
