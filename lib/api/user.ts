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
    connectionString: process.env.POSTGRES_URI,
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
    connectionString: process.env.POSTGRES_URI,
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
    connectionString: process.env.POSTGRES_URI,
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
       ORDER BY followers DESC, _id
       LIMIT 100`
    );

    return res.rows;
  } finally {
    await client.end();
  }
}

export async function searchUser(query: string): Promise<UserProps[]> {
  const client = await clientPromise;
  const collection = client.db('test').collection('users');
  return await collection
    .aggregate<UserProps>([
      {
        $search: {
          index: 'name-index',
          /*
          name-index is a search index as follows:

          {
            "mappings": {
              "fields": {
                "followers": {
                  "type": "number"
                },
                "name": {
                  "analyzer": "lucene.whitespace",
                  "searchAnalyzer": "lucene.whitespace",
                  "type": "string"
                },
                "username": {
                  "type": "string"
                }
              }
            }
          }

          */
          text: {
            query: query,
            path: {
              wildcard: '*' // match on both name and username
            },
            fuzzy: {},
            score: {
              // search ranking algorithm: multiply relevance score by the log1p of follower count
              function: {
                multiply: [
                  {
                    score: 'relevance'
                  },
                  {
                    log1p: {
                      path: {
                        value: 'followers'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        // filter out users that are not verified
        $match: {
          verified: true
        }
      },
      // limit to 10 results
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          emailVerified: 0,
          score: {
            $meta: 'searchScore'
          }
        }
      }
    ])
    .toArray();
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
