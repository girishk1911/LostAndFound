# PICT Lost & Found System

## 🔄 Deployment Counter: **1**

_Tracking deployment attempts for backend-frontend connectivity_

---

A digital platform to manage lost and found items efficiently within an educational institution.

## Overview

The PICT Lost & Found System is a web application designed to streamline the process of cataloging, claiming, and returning lost items. The system bridges the gap between those who have lost items and those who have found them by providing a central repository with verification mechanisms.

## Current Deployment Status

- **Backend**: Simplified configuration ✅
- **Cloudinary Integration**: Active ✅
- **Environment Variables**: Removed for simplicity ✅
- **Status**: Ready for clean backend deployment

## Key Features

- **Item Management**: Guards can add, edit, update, and track items in the system
- **Claim System**: Students/staff can claim items with automated verification scheduling
- **Expiry Logic**: Claims expire after 24 hours if not verified, with email notifications
- **User Roles**: Different interfaces for guards (admin) and general users
- **Interactive Help**: Guided tour and contextual help for new users
- **Responsive UI**: Mobile-friendly interface using React and Tailwind CSS
- **Cloud Storage**: Images stored on Cloudinary for cross-device compatibility

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Email Notifications**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/pict-lost-and-found.git
   ```

2. Install dependencies

   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Configure environment variables

   - Create a `.env` file in the server directory with:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_EMAIL=your_email
   SMTP_PASSWORD=your_email_password
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=PICT Lost & Found
   ```

4. Start the application

   ```
   # Start the server
   cd server
   npm start

   # In a new terminal, start the client
   cd client
   npm start
   ```

5. Access the application at http://localhost:3000

## Usage

### For Guards (Admin)

- Login with guard credentials
- Add new lost items to the system
- Verify item claims and mark items as delivered
- View expiry claims and manage items

### For Students/Staff

- Browse available lost items
- Submit claims for found items
- Receive email notifications about claim status
- Attend verification sessions to retrieve items

## Acknowledgements

- Pune Institute of Computer Technology (PICT)
- All contributors to the project
