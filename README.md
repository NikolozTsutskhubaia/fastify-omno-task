# Omno API Integration

This Fastify application integrates with the Omno API for transaction creation and webhook handling. It features endpoints for creating transactions and processing webhooks, including handling 3DS (Three-Domain Secure) redirects. Swagger documentation is available for API reference.

## Features

- **Transaction Creation**: Endpoint for creating a new transaction.
- **Webhook Handling**: Endpoint for processing webhooks, including 3DS redirects.
- **Swagger Documentation**: Auto-generated API documentation via Swagger UI.

## Prerequisites

- Node.js (>=14.x)
- npm or yarn
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following environment variables:

    ```env
    CLIENT_ID=<your-client-id>
    CLIENT_SECRET=<your-client-secret>
    BASE_URL=<your-base-url>
    ```

## Running the Application

1. Start the server:

    ```bash
    npm start
    ```

   The server will listen on port 3000 by default.

2. Access the Swagger UI documentation at:

    ```
    http://localhost:3000/docs
    ```

## API Endpoints

### Create Transaction

- **URL**: `/create-transaction`
- **Method**: `POST`
- **Description**: Creates a new transaction using the Omno API.
- **Request Body Schema**:

    ```json
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
    ```

- **Responses**:
  - `200 OK`: Success response with transaction details.

### Webhook

- **URL**: `/webhook`
- **Method**: `POST`
- **Description**: Processes webhooks from Omno API, including handling 3DS redirects.
- **Request Body**: Should match the webhook payload from Omno API.
- **Responses**:
  - `200 OK`: Acknowledges receipt of the webhook.
  - `307 Redirect`: Redirects to 3DS URL if provided.
  - `500 Internal Server Error`: Error processing the webhook.

## Error Handling

Errors are logged and returned as responses. Detailed error information is provided in case of transaction creation or webhook processing failures.

## Docker Deployment

To deploy using Docker, create a Dockerfile and configure Docker to build and run the application. Ensure that necessary environment variables are set in your Docker configuration.

