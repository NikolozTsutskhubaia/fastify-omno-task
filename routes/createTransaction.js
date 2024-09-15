const axios = require('axios');
const qs = require('querystring');

const createTransactionSchema = {
    body: {
        type: 'object',
        required: ['amount', 'currency', 'billing', 'cardData'],
        properties: {
            amount: { type: 'number' },
            currency: { type: 'string' },
            billing: {
                type: 'object',
                required: ['firstName', 'lastName', 'address1', 'city', 'state', 'country', 'postalCode', 'phone', 'email'],
                properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    address1: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    country: { type: 'string' },
                    postalCode: { type: 'string' },
                    phone: { type: 'string' },
                    email: { type: 'string' },
                },
            },
            cardData: {
                type: 'object',
                required: ['cardNumber', 'cardHolderName', 'cardExpiryDate', 'cardExpiryDate2', 'cardCvv', 'browser'],
                properties: {
                    cardNumber: { type: 'string' },
                    cardHolderName: { type: 'string' },
                    cardExpiryDate: { type: 'string' },
                    cardExpiryDate2: { type: 'string' },
                    cardCvv: { type: 'string' },
                    browser: {
                        type: 'object',
                        required: ['colorDepth', 'userAgent', 'language', 'timeZone', 'screenWidth', 'javaEnabled', 'customerIp', 'screenHeight', 'windowHeight', 'timeZoneOffset', 'windowWidth'],
                        properties: {
                            colorDepth: { type: 'number' },
                            userAgent: { type: 'string' },
                            language: { type: 'string' },
                            timeZone: { type: 'string' },
                            screenWidth: { type: 'number' },
                            javaEnabled: { type: 'boolean' },
                            customerIp: { type: 'string' },
                            screenHeight: { type: 'number' },
                            windowHeight: { type: 'number' },
                            timeZoneOffset: { type: 'number' },
                            windowWidth: { type: 'number' },
                        },
                    },
                },
            },
        },
    },
};

async function getAccessToken() {
    try {
        console.log('Attempting to obtain access token...');
        const tokenResponse = await axios.post('https://sso.omno.com/realms/omno/protocol/openid-connect/token',
            qs.stringify({
                grant_type: 'client_credentials',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

        console.log('Access token obtained successfully');
        return tokenResponse.data.access_token;
    } catch (error) {
        console.log('Failed to obtain access token:', error.message);
        if (error.response) {
            console.log('Auth server response:', error.response.data);
        }
        throw new Error('Authentication failed');
    }
}

async function createTransactionHandler(request, reply) {
    try {
        const accessToken = await getAccessToken();
        console.log('Access token obtained successfully');

        const omnoResponse = await axios.post(
            'https://api.omno.com/transaction/h2h/create',
            {
                ...request.body,
                lang: 'en',
                hookUrl: `${process.env.BASE_URL}/webhook`,
                callback: `${process.env.BASE_URL}/callback`,
                callbackFail: `${process.env.BASE_URL}/callback-fail`,
                orderId: `order-${Date.now()}`,
                payment3dsType: 'Redirection',
                kycVerified: false,
                previousPaymentCount: 0,
                saveCard: false,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );
        console.log('Omno API response:', omnoResponse.data);
        return reply.code(200).send(omnoResponse.data);
    } catch (error) {
        console.log('Transaction creation error:', error);
        if (error.response) {
            console.log('Omno API error response:', error.response.data);
            return reply.code(error.response.status).send({
                error: 'Failed to create transaction',
                details: error.response.data
            });
        } else if (error.request) {
            console.log('No response received from Omno API');
            return reply.code(500).send({
                error: 'Failed to create transaction',
                details: 'No response from Omno API'
            });
        } else {
            console.log('Error setting up the request:', error.message);
            return reply.code(500).send({
                error: 'Failed to create transaction',
                details: error.message
            });
        }
    }
}

async function transactionRoutes(fastify, options) {
  fastify.post('/create-transaction', {
    schema: {
      body: createTransactionSchema.body,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      },
      summary: 'Create a new transaction',
      description: 'This route allows users to create a new transaction using Omno API.',
      tags: ['Transaction'],
    }
  }, createTransactionHandler);
}

module.exports = transactionRoutes;