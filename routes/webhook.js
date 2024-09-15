async function webhookHandler(request, reply) {
    try {
        console.log('Received webhook:', request.body);

        if (request.body['3dsRedirectUrl']) {
            console.log('3DS Redirect URL:', request.body['3dsRedirectUrl']);
            return reply.code(307).redirect(request.body['3dsRedirectUrl']);
        }

        return reply.code(200).send({ message: 'Webhook received' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return reply.code(500).send({ error: 'Failed to process webhook' });
    }
}

async function webhookRoutes(fastify, options) {
    fastify.post('/webhook', {
        schema: {
            summary: 'Webhook for transaction events',
            description: 'This endpoint processes webhooks from Omno API, including 3DS redirects.',
            tags: ['Webhook'],
        }
    }, webhookHandler);
}

module.exports = webhookRoutes;