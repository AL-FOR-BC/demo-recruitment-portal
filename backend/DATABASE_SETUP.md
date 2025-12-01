# Database Setup Guide

This application supports switching between Prisma (for production) and MongoDB/Mongoose (for demo environment) using environment variables.

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Database Type: "prisma" for production, "mongoose" for demo
DB_TYPE=prisma

# For Prisma (MySQL/PostgreSQL)
DATABASE_URL="mysql://user:password@localhost:3306/rom_recruitment"

# For MongoDB (used when DB_TYPE=mongoose)
MONGODB_URI="mongodb://localhost:27017/rom_recruitment"
```

## Usage

### Production (Prisma)
Set `DB_TYPE=prisma` in your production environment. The application will use Prisma with your MySQL/PostgreSQL database.

```env
DB_TYPE=prisma
DATABASE_URL="mysql://user:password@host:3306/database"
```

### Demo/Development (MongoDB)
Set `DB_TYPE=mongoose` in your demo/development environment. The application will use Mongoose with MongoDB.

```env
DB_TYPE=mongoose
MONGODB_URI="mongodb://localhost:27017/rom_recruitment"
```

## Architecture

The application uses a database adapter pattern:

1. **Adapter Interface** (`src/database/adapter.interface.ts`): Defines common database operations
2. **Prisma Adapter** (`src/database/prisma.adapter.ts`): Implements Prisma-specific operations
3. **Mongoose Adapter** (`src/database/mongoose.adapter.ts`): Implements MongoDB-specific operations
4. **Factory** (`src/database/factory.ts`): Creates the appropriate adapter based on `DB_TYPE`

## Database Models

Both adapters support the same models:
- `users` / `Users`
- `applicant_profile` / `ApplicantProfile`
- `bc_configs` / `BcConfig`
- `app_setup` / `AppSetup`

## Using the Database in Controllers

Instead of directly importing `prisma`, use the `getDB()` utility:

```typescript
import { getDB } from "../utils/database";

// In your controller function
const db = getDB();
const user = await db.user.findUnique({ where: { email } });
const newUser = await db.user.create({ data: userData });
```

## Connection Management

- **Prisma**: Automatically manages connections
- **MongoDB**: Connection is established automatically when `DB_TYPE=mongoose` is set
- Graceful shutdown is handled in `src/index.ts`

## Notes

- The database adapter is initialized when the Express app starts
- All controllers have been updated to use the adapter pattern
- Error handling works for both Prisma and MongoDB-specific errors
- MongoDB models use the same field names as Prisma schema for compatibility

