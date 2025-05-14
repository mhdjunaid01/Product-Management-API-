# Product-Management-API-
## Application Setup and Configuration

This section provides an overview of the setup and configuration of the Product Management API. The application is built using Node.js and Express, with several middleware and utilities to ensure robust functionality.

### Features
- User authentication and authorization.
- Product management (CRUD operations).
- Wishlist management for users.
- Secure and scalable backend architecture.

### Dependencies
The application uses the following dependencies:
- **dotenv**: Loads environment variables from a `.env` file.
- **express**: A web framework for building the server.
- **cors**: Enables Cross-Origin Resource Sharing.
- **cookie-parser**: Parses cookies attached to client requests.
- **morgan**: Logs HTTP requests for debugging and monitoring.
- **helmet**: Adds security headers to HTTP responses.
- **mongoose**: Connects to and interacts with MongoDB.
- **multer**: Handles file uploads.
- **jsonwebtoken**: Manages JSON Web Token (JWT) authentication.
- **bcryptjs**: Hashes passwords for secure storage.
- **validator**: Validates and sanitizes input data.

---

### Environment Variables
The application relies on the following environment variables:
- **PORT**: Port number for the server to listen on (default: `5000`).
- **CLIENT_URL**: URL of the client application for CORS configuration.
- **MONGO_URI**: MongoDB connection string.
- **JWT_SECRET**: Secret key for signing and verifying JWTs.
- **NODE_ENV**: Environment mode (`development` or `production`).
- **ADMIN_EMAIL**: Default admin email address.
- **ADMIN_PASSWORD**: Default admin password.

---

### Middleware
The application uses the following middleware:
1. **CORS**: Configured to allow specific origins, methods, and headers.
2. **Helmet**: Adds security headers to protect against common vulnerabilities.
3. **Body Parsers**:
    - Parses URL-encoded request bodies.
    - Parses JSON request bodies.
4. **Cookie Parser**: Parses cookies for session management.
5. **Morgan**: Logs HTTP requests in development mode.
6. **Static Files**: Serves static files from the `uploads/public` directory.

---

### Routes
The application defines the following routes:
1. **Authentication Routes (`/api/auth`)**:
    - `POST /register`: Registers a new user.
    - `POST /login`: Logs in an existing user.
2. **Product Routes (`/api/products`)**:
    - `POST /createProduct`: Creates a new product (requires authentication and role-based access).
    - `GET /`: Retrieves all products.
    - `GET /getProduct/:id`: Retrieves a single product by ID.
    - `PUT /updateProduct/:id`: Updates a product (requires authentication and ownership/role-based access).
    - `DELETE /deleteProduct/:id`: Deletes a product (requires authentication and ownership/role-based access).
3. **Wishlist Routes (`/api/wishlist`)**:
    - `POST /add/:productId`: Adds a product to the user's wishlist.
    - `GET /`: Retrieves the user's wishlist.
    - `DELETE /remove/:productId`: Removes a product from the user's wishlist.

---

### Error Handling
The application includes a custom error handler middleware to:
- Catch and handle application errors.
- Return appropriate HTTP status codes and error messages.

---

### Database Connection
The `connectDB` function establishes a connection to the MongoDB database using the `MONGO_URI` environment variable. It ensures a reliable connection and logs the status.

---

### Server
The application starts an Express server that:
- Listens on the specified port (`PORT` environment variable or `5000` by default).
- Logs a message indicating that the server is running.

---

### Postman Collection
To test the API, you can use the provided Postman collection, which includes pre-configured requests for all endpoints.

---

### How to Run
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file with the required environment variables.
4. Start the server:
    - Development mode: `npm run dev`.
    - Production mode: `npm start`.
5. Access the API at `http://localhost:5000`.

---

### Notes
- Ensure MongoDB is running and accessible via the `MONGO_URI`.
- Use strong values for `JWT_SECRET` and admin credentials in production.
- Regularly update dependencies to address security vulnerabilities.

### .ENV
PORT=5000
MONGO_URI=mongodb+srv://muhammedjunaid2016:mHIAjmDq26PdEbo5@machinetest.ow4qovg.mongodb.net/
JWT_SECRET=asdfghjwertyxcv234ecvbn345cvertcv345xcv34xcv34rcv
NODE_ENV=production
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123