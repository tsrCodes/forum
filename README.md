Full-stack web application built with Next.js that enables users to create discussion forums, interact through comments

## Tech Stack

- **Frontend**
  - Next.js / React
  - Tailwind CSS / ShadCN UI Components

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL Database

- **Authentication**
  - Auth.js (NextAuth)

## Features

- **Authentication**
  - User can Register and log in using email (Credentials) (Auth.js)
  - Protected routes for Authenticated users

- **Forums**
  - CRUD Operations
  - Each forum includes Title / Description, Tags, and Timestamp
  - Only forum creators can edit or delete their forums

- **Comments**
  - Post comments under any forum
  - Delete your own comments

- **Likes / DisLikes**
  - Like/unlike forums
  - See number of likes per forum

- **User Profiles**
  - View your created forums
  - See your comment history
  - Track forums you've liked

- **Search & Pagination**
  - Search forums by title, description, or tags
  - Paginated results for better navigation
  - Form validation on both client and server sides


## Database Schema

The application uses the following database models:

- **User**: Stores user information and authentication data
- **Forum**: Contains forum details like title, description, and tags
- **Comment**: Stores comments associated with forums
- **Like**: Stores User likes on forums

## Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/tsrCodes/forum.git
cd forum
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file with the following variables:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/forum_app?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. **Set up the database & Initialize Prisma**

```bash
npx prisma generate

npx prisma migrate dev --name init

# (Optional)
npx prisma db seed
```

5. **Run the development server**

```bash
pnpm dev
```