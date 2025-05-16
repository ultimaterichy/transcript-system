const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test the connection
prisma.$connect()
  .then(() => {
    console.log("Successfully connected to the database.");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    throw error;
  });

module.exports = prisma;