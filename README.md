Omno API Integration
This is a Fastify application that integrates with the Omno API for transaction creation and webhook handling. It provides endpoints for creating transactions and processing webhooks, including handling 3DS (Three-Domain Secure) redirects.

Features
Transaction Creation: Endpoint to create a new transaction with various details.
Webhook Handling: Endpoint to process webhooks from Omno API, including handling 3DS redirects.
Swagger Documentation: Automatically generated API documentation accessible via Swagger UI.
Getting Started
Prerequisites
Node.js (>=14.x)
npm or yarn
Docker (optional, for containerized deployment)
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
cd <repository-name>
Install dependencies:

bash
Copy code
npm install
Create a .env file in the root directory with the following environment variables:

env
Copy code
CLIENT_ID=<your-client-id>
CLIENT_SECRET=<your-client-secret>
BASE_URL=<your-base-url>
Running the Application
Start the server:

bash
Copy code
npm start
The server will listen on port 3000 by default.

Access the Swagger UI documentation at:

bash
Copy code
http://localhost:3000/docs
API Endpoints
Create Transaction
URL: /create-transaction

Method: POST

Description: Create a new transaction using the Omno API.

Request Body Schema:

json
Copy code
{
  "amount": "number",
  "currency": "string",
  "billing": {
    "firstName": "string",
    "lastName": "string",
    "address1": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postalCode": "string",
    "phone": "string",
    "email": "string"
  },
  "cardData": {
    "cardNumber": "string",
    "cardHolderName": "string",
    "cardExpiryDate": "string",
    "cardExpiryDate2": "string",
    "cardCvv": "string",
    "browser": {
      "colorDepth": "number",
      "userAgent": "string",
      "language": "string",
      "timeZone": "string",
      "screenWidth": "number",
      "javaEnabled": "boolean",
      "customerIp": "string",
      "screenHeight": "number",
      "windowHeight": "number",
      "timeZoneOffset": "number",
      "windowWidth": "number"
    }
  }
}
Responses:

200 OK: Success response with transaction details.
Webhook
URL: /webhook
Method: POST
Description: Process webhooks from the Omno API, including handling 3DS redirects.
Request Body: The body should match the webhook payload from Omno API.
Responses:
200 OK: Acknowledgement of the webhook.
307 Redirect: Redirect to 3DS URL if provided.
500 Internal Server Error: Error processing the webhook.
Error Handling
Errors are logged and sent back as responses. If an error occurs during transaction creation or webhook processing, detailed error information is provided.

Docker Deployment
For containerized deployment, you can create a Dockerfile and use Docker to build and run the application. Ensure to set the necessary environment variables in your Docker configuration.
