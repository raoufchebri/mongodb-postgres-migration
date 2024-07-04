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
  const client = require('../lib/postgresql');
  const query = 'SELECT name, username, email, image, bio, followers, verified FROM users WHERE username = $1';
  const values = [username];
  const result = await client.query(query, values);
  const user = result.rows[0];
  if (user) {
    return {
      ...user,
      bioMdx: await getMdxSource(user.bio || placeholderBio)
    };
  } else {
    return null;
  }
}

export async function getFirstUser(): Promise<UserProps | null> {
  const client = require('../lib/postgresql');
  const query = 'SELECT name, username, email, image, bio, followers, verified FROM users LIMIT 1';
  const result = await client.query(query);
  const user = result.rows[0];
  if (user) {
    return {
      ...user,
      bioMdx: await getMdxSource(user.bio || placeholderBio)
    };
  } else {
    return null;
  }
}

export async function getAllUsers(): Promise<ResultProps[]> {
  const client = require('../lib/postgresql');
  const query = `
    SELECT
      LOWER(SUBSTRING(name, 1, 1)) AS _id,
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
    ORDER BY _id
    LIMIT 100
  `;
  const result = await client.query(query);
  return result.rows;
}

export async function searchUser(query: string): Promise<UserProps[]> {
  const client = require('../lib/postgresql');
  const searchQuery = `
    SELECT
      name,
      username,
      email,
      image,
      bio,
      followers,
      verified,
      ts_rank_cd(to_tsvector('english', name || ' ' || username), to_tsquery('english', $1)) AS score
    FROM users
    WHERE to_tsvector('english', name || ' ' || username) @@ to_tsquery('english', $1)
      AND verified = true
    ORDER BY score DESC
    LIMIT 10
  `;
  const values = [query];
  const result = await client.query(searchQuery, values);
  const users = await Promise.all(
    result.rows.map(async (user: UserProps) => ({
      ...user,
      bioMdx: await getMdxSource(user.bio || placeholderBio)
    }))
  );
  return users;
}

export async function getUserCount(): Promise<number> {
  const client = await clientPromise;
  const collection = client.db('test').collection('users');
  return await collection.countDocuments();
}

export async function updateUser(username: string, bio: string) {
  const client = await clientPromise;
  const collection = client.db('test').collection('users');
  return await collection.updateOne({ username }, { $set: { bio } });
}
