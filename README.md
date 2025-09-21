# Access Race

## Project Description
Access Race is a Node.js web application built with Express.js and EJS, designed to manage various aspects of an event or organization. It features an administrative panel, client-facing routes, and functionalities such as user management, event handling, QR code generation, email notifications, and Excel file processing. The application supports both HTTP and HTTPS connections.

## Features
*   **User Authentication & Management:** Secure access for administrators and users.
*   **Event Management:** Create, update, and manage events.
*   **QR Code Generation:** Generate QR codes for various purposes (e.g., event tickets, volunteer check-ins).
*   **Email Notifications:** Send automated emails for confirmations, updates, etc.
*   **File Uploads:** Handle image and document uploads (e.g., certificates, event banners).
*   **Excel File Processing:** Import and export data using Excel files (e.g., volunteer lists).
*   **Dynamic Content:** EJS templating for dynamic web pages.
*   **Database Integration:** MongoDB for data storage.
*   **Secure Connections:** Supports both HTTP and HTTPS.

## Technologies Used
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (via Mongoose)
*   **Templating:** EJS (Embedded JavaScript)
*   **Middleware:**
    *   `body-parser`: For parsing request bodies.
    *   `multer`: For handling multipart/form-data (file uploads).
    *   `express-ejs-layouts`: For EJS layout support.
*   **Utilities:**
    *   `dotenv`: For environment variable management.
    *   `nodemailer`: For sending emails.
    *   `qrcode`: For generating QR codes.
    *   `canvas`: Used by `qrcode` for rendering.
    *   `slugify`: For creating URL-friendly strings.
    *   `xlsx`: For reading and writing Excel files.
    *   `file-type`: For detecting file types.
*   **Development Tools:**
    *   `nodemon`: For automatic server restarts during development.
    *   `prettier-plugin-ejs`: For EJS code formatting.

## Installation

### Prerequisites
*   Node.js (LTS version recommended)
*   MongoDB (running instance)

### Steps
1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd access-race
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root directory of the project and add the following environment variables. Replace the placeholder values with your actual configuration.

    ```
    HTTP_PORT=3000
    HTTPS_PORT=3001
    MONGODB_URI=mongodb://localhost:27017/access_race_db
    # Add other environment variables for email, AWS S3 (if used), etc.
    # Example for Nodemailer (SMTP)
    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    ```

4.  **SSL Certificates (for HTTPS):**
    Place your `key.pem` and `cert.pem` files in the `ssl/` directory at the project root. If you don't have them, you can generate self-signed certificates for development purposes.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will restart automatically on code changes. Access the application via `http://localhost:3000` (or your configured HTTP_PORT) and `https://localhost:3001` (or your configured HTTPS_PORT).

6.  **Run the production server:**
    ```bash
    npm start
    ```
    This will start the server in production mode.

## Project Structure
```
.
├───.gitignore
├───.prettierrc
├───index.js                  # Production entry point
├───package.json
├───README.md
├───ssl/                      # SSL certificates
│   ├───cert.pem
│   └───key.pem
├───src/
│   ├───public/               # Client-side static assets (CSS, JS, images)
│   │   ├───admin/            # Admin-specific static assets
│   │   ├───css/
│   │   ├───font/
│   │   ├───img/
│   │   ├───js/
│   │   └───uploads/          # Publicly accessible uploads
│   ├───server/
│   │   ├───app.js            # Express application configuration
│   │   ├───server.js         # HTTP/HTTPS server setup
│   │   ├───api/              # API routes (if any)
│   │   ├───areas/            # Modularized routes/logic (e.g., admin area)
│   │   ├───config/           # Database connection, multer, mail config
│   │   ├───controller/       # Route handlers/controllers
│   │   ├───enums/            # Enumerations
│   │   ├───model/            # Mongoose schemas/models
│   │   ├───router/           # Route definitions (adminRoute, clientRoute, testRoute)
│   │   ├───services/         # Business logic/services
│   │   ├───stringValue/      # String constants
│   │   ├───test/             # Test-related files
│   │   ├───utils/            # Utility functions
│   │   └───view/             # EJS templates (admin, layout, pages, partials)
│   └───uploads/              # Server-side uploads (e.g., volunteer certificates)
└───uploads/                  # Root-level uploads (might be redundant with src/uploads)
    ├───certificate/
    ├───da-nang/
    ├───event/
    ├───homepage/
    └───volunteer_certificate/
```

## Usage
*   **Admin Panel:** Access the administrative interface via `/admin` routes (e.g., `https://localhost:3001/admin`).
*   **Client Routes:** The main application interface is available at the root URL (e.g., `https://localhost:3001/`).
*   **API Endpoints:** Refer to the `src/server/api` and `src/server/controller` directories for available API endpoints and their functionalities.

## Contributing
(Instructions for contributing to the project, if applicable.)

## License
(License information, e.g., MIT, ISC.)
