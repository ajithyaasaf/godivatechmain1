// This file is now a shim for Firebase
// Import schema for type reference only
import * as schema from "@shared/schema";

// Create mock DB objects to prevent errors when importing this file
// All actual database operations will go through firestore-storage.ts
const mockDb = {
  select: () => mockDb,
  from: () => mockDb,
  where: () => mockDb,
  orderBy: () => mockDb,
  insert: () => mockDb,
  values: () => mockDb,
  returning: () => [{}],
  delete: () => mockDb,
};

export const db = mockDb;
