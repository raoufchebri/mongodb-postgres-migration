import clientPromise from '@/lib/mongodb';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface UserProps {
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
  bioMdx: MDXRemoteSerializeResult<Record<string, unknown>>;
  followers: number;
  verified: boolean;
}

export interface ResultProps {
  _id: string;
  users: UserProps[];
}

export async function getMdxSource(postContents: string) {
  // Use remark plugins to convert markdown into HTML string
  const processedContent = await remark()
    // Native remark plugin that parses markdown into MDX
    .use(remarkMdx)
    .process(postContents);

  // Convert converted html to string format
  const contentHtml = String(processedContent);

  // Serialize the content string into MDX
  const mdxSource = await serialize(contentHtml);

  return mdxSource;
}

export const placeholderBio = `
Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.

Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.`;

export async function getUser(username: string): Promise<UserProps | null> {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });

  await client.connect();

  try {
    const res = await client.query(
      'SELECT id, name, username, email, image, bio, bio_mdx, followers, verified FROM users WHERE username = $1',
      [username]
    );

    if (res.rows.length > 0) {
      const user = res.rows[0];
      return {
        ...user,
        bioMdx: await getMdxSource(user.bio || placeholderBio),
      };
    } else {
      return null;
    }
  } finally {
    await client.end();
  }
}

export async function getFirstUser(): Promise<UserProps | null> {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });

  await client.connect();

  try {
    const res = await client.query(
      'SELECT id, name, username, email, image, bio, bio_mdx, followers, verified FROM users ORDER BY id LIMIT 1'
    );

    if (res.rows.length > 0) {
      const user = res.rows[0];
      return {
        ...user,
        bioMdx: await getMdxSource(user.bio || placeholderBio),
      };
    } else {
      return null;
    }
  } finally {
    await client.end();
  }
}

export async function getAllUsers(): Promise<ResultProps[]> {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });

  await client.connect();

  try {
    const res = await client.query(
      `SELECT LOWER(SUBSTRING(name, 1, 1)) AS _id,
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'name', name,
                  'username', username,
                  'email', email,
                  'image', image,
                  'followers', followers,
                  'verified', verified
                )
              ) AS users,
              COUNT(*) AS count
       FROM users
       GROUP BY LOWER(SUBSTRING(name, 1, 1))
       ORDER BY _id`
    );

    return res.rows;
  } finally {
    await client.end();
  }
}

export async function searchUser(query: string): Promise<UserProps[]> {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });

  await client.connect();

  try {
    const res = await client.query(
      `SELECT id, name, username, email, image, bio, bio_mdx, followers, verified,
              ts_rank_cd(to_tsvector('english', name || ' ' || username), query) AS score
       FROM users, to_tsquery('english', $1) query
       WHERE to_tsvector('english', name || ' ' || username) @@ query
         AND verified = TRUE
       ORDER BY score DESC
       LIMIT 10`,
      [query]
    );

    return await Promise.all(
      res.rows.map(async (user: UserProps) => ({
        ...user,
        bioMdx: await getMdxSource(user.bio || placeholderBio),
      }))
    );
  } finally {
    await client.end();
  }
}

export async function getUserCount(): Promise<number> {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });

  await client.connect();

  try {
    const res = await client.query('SELECT COUNT(*) FROM users');
    return parseInt(res.rows[0].count, 10);
  } finally {
    await client.end();
  }
}

export async function updateUser(username: string, bio: string) {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });

  await client.connect();

  try {
    await client.query(
      'UPDATE users SET bio = $2 WHERE username = $1',
      [username, bio]
    );
  } finally {
    await client.end();
  }
}
