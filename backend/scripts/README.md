# Migration Scripts

## Add Settings Fields Migration

This script adds the `companyName` and `help` fields to existing Settings documents in MongoDB.

### Prerequisites

1. Make sure your `.env` file has `MONGODB_URI` or `DATABASE_URL` set
2. Ensure MongoDB is running and accessible

### Running the Migration

**Option 1: Using npm script**
```bash
npm run migrate:settings
```

**Option 2: Using ts-node directly**
```bash
npx ts-node scripts/add-settings-fields.ts
```

### What it does

1. Connects to your MongoDB database
2. Finds all Settings documents
3. Adds `companyName` and `help` fields (set to `null`) to documents that don't have them
4. Leaves existing documents with these fields unchanged

### Note

Since MongoDB is schema-less, you don't actually need to run this migration. The new fields will automatically be accepted when:
- Creating new Settings documents
- Updating existing Settings documents

This migration is only useful if you want to ensure all existing documents have these fields initialized to `null`.




