# Hello, Namaste 🙏, Welcome to My Next.js Social Media Application!

Thank you for checking out this project! This is a social media application built using Next.js with features like user profiles, posts, and real-time interactions. Feel free to explore the code, provide feedback, or contribute. 🚀

---

# Next.js Social Media Application

## Overview

This project is a fully functional social media platform where users can:
- Create and manage profiles.
- Post content and interact with other users.
- Follow/unfollow users and receive real-time updates.

## Features

- **User Authentication:** Secure login and signup using NextAuth.
- **User Profiles:** View and edit user details.
- **Post Management:** Create, edit, and delete posts.
- **Real-time Notifications:** Get instant notifications for activities like likes and follows.
- **Responsive Design:** Seamless experience across devices.

## Tech Stack

**Frontend:**
- Next.js
- TypeScript
- Tailwind CSS

**Backend:**
- Node.js
- Prisma ORM
- MongoDB (for database)
- WebSockets (for real-time features)

## Installation and Setup

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/aman-S25/next-js-social-media-app.git
    cd next-js-social-media-app
    cd frontend
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Environment Setup:**
    Create a `.env` file in the root directory with the following variables:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    CLERK_SECRET_KEY=your_CLERK_SECRET_KEY
    WEBHOOK_SECRET=your_clerk_WEBHOOK_SECRET
    
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    
    NEXT_PUBLIC_CLOUDINARY_API_KEY=your_NEXT_PUBLIC_CLOUDINARY_API_KEY
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_SECRET=your_CLOUDINARY_API_SECRET
    
    API_KEY=your_Stream_chat_API_KEY
    STREAM_SECRET=your_STREAM_SECRET
    
    NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
    DATABASE_URL=your-database-url
    
    ```

4. **Run the Development Server:**
    ```bash
    npm run dev
    ```

5. **Clone the Repository:**
    ```bash
    cd express-socket-server
    ```

6. **Install Dependencies:**
    ```bash
    npm install
    ```

7. **Environment Setup:**
    Create a `.env` file in the root directory with the following variables:
    ```env
    
    client_url=http://localhost:3000
    
    ```

8. **Run the Development Server:**
    ```bash
    npm start
    ```



9. **Access the Application:**
    - Open your browser and go to `http://localhost:3000`.

## Usage

- Register an account and set up your profile.
- Create posts and interact with other users.
- Follow/unfollow users and receive real-time updates.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

