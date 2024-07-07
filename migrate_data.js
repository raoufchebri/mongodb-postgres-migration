import { MongoClient } from 'mongodb';
import pkg from 'pg';
const { Client } = pkg;

const mongoUri = 'mongodb://localhost:27017';
const mongoDbName = 'test';
const mongoCollectionName = 'users';

const pgConnectionString = 'postgresql://neondb_owner:3Z9OVPCQGawz@ep-ancient-violet-a52dmhci.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function migrateData() {
  const mongoClient = new MongoClient(mongoUri);
  const pgClient = new Client({
    connectionString: pgConnectionString,
  });

  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');

    const db = mongoClient.db(mongoDbName);
    const collection = db.collection(mongoCollectionName);
    const users = await collection.find().toArray();

    await pgClient.connect();
    console.log('Connected to PostgreSQL');

    for (const user of users) {
      const { name, username, email, image, bio, followers, verified } = user;

      const insertUserQuery = `
        INSERT INTO users (name, username, email, image, bio, followers, verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;
      const userValues = [name, username, email, image, bio, followers.length, verified];
      const res = await pgClient.query(insertUserQuery, userValues);
      const userId = res.rows[0].id;

      if (user.bioMdx) {
        const insertUserBioQuery = `
          INSERT INTO user_bios (user_id, bio_mdx)
          VALUES ($1, $2)
        `;
        const userBioValues = [userId, user.bioMdx];
        await pgClient.query(insertUserBioQuery, userBioValues);
      }
    }

    console.log('Data migration completed successfully');
  } catch (err) {
    console.error('Error during data migration', err);
  } finally {
    await mongoClient.close();
    await pgClient.end();
  }
}

migrateData();
