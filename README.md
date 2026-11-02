# Exclusive – E-commerce Backend

The robust Node.js, Express, and MongoDB REST API powering the **Exclusive** e-commerce platform. It handles secure user authentication, product management, Cloudinary image uploads, order tracking, and Chapa payment verification.

## Tech Stack

- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT), Google OAuth, and Nodemailer (password resets)
- **File Uploads:** Cloudinary
- **Payments:** Chapa API (server-side verification)

## Features

- **Authentication & Roles:** Secure sign-up, login, Google authentication, password recovery via email, and Role-Based Access Control (Customer & Admin).
- **Product Management:** Full CRUD operations for products with media uploads routed through Cloudinary.
- **Cart & Wishlist:** Server-backed cart and wishlist management.
- **Checkout & Payments:** Order creation supporting Cash on Delivery and secure online payments verified via Chapa webhooks/APIs.
- **Admin Control:** Comprehensive order status tracking and user role management.

## Getting Started

**Requirements:** Node.js 20 or newer, and a running MongoDB instance (Local or MongoDB Atlas).

1. Clone the repository and install dependencies:
   ```bash
   git clone [https://github.com/yaredkumera/E-commerce-backend.git](https://github.com/yaredkumera/E-commerce-backend.git)
   cd E-commerce-backend
   npm install