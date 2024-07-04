"use strict";

const pkg = require('pg');
const { Pool } = pkg;
// const remarkMdx = require('remark-mdx'); // Remove this line
// const { serialize } = require('next-mdx-remote/serialize'); // Remove this line

const pool = new Pool({
    connectionString: process.env.POSTGRES_CONNECTION_URI,
});

async function getMdxSource(postContents) {
    // Use remark plugins to convert markdown into HTML string
    const { remark } = await import('remark');
    const remarkMdx = await import('remark-mdx');
    const { serialize } = await import('next-mdx-remote/serialize');
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
const placeholderBio = `
Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.

Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.`;

module.exports = { getMdxSource, getUser, getFirstUser, getAllUsers, searchUser, getUserCount, updateUser, placeholderBio };

async function getUser(username) {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT name, username, email, image, bio, followers, verified FROM "user" WHERE username = $1', [username]);
        if (res.rows.length > 0) {
            const user = res.rows[0];
            return {
                ...user,
                bioMdx: await getMdxSource(user.bio || placeholderBio),
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error in getUser:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function getFirstUser() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT name, username, email, image, bio, followers, verified FROM "user" ORDER BY id LIMIT 1');
        if (res.rows.length > 0) {
            const user = res.rows[0];
            return {
                ...user,
                bioMdx: await getMdxSource(user.bio || placeholderBio),
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error in getFirstUser:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function getAllUsers() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT name, username, email, image, followers, verified FROM "user" ORDER BY followers DESC LIMIT 100');
        const groupedUsers = {};
        res.rows.forEach((user) => {
            const firstLetter = user.name.charAt(0).toLowerCase();
            if (!groupedUsers[firstLetter]) {
                groupedUsers[firstLetter] = [];
            }
            groupedUsers[firstLetter].push(user);
        });
        return Object.keys(groupedUsers).sort().map((key) => ({
            _id: key,
            users: groupedUsers[key],
        }));
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function searchUser(query) {
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT name, username, email, image, followers, verified
       FROM "user"
       WHERE (name ILIKE $1 OR username ILIKE $1) AND verified = true
       ORDER BY followers DESC
       LIMIT 10`, [`%${query}%`]);
        return await Promise.all(res.rows.map(async (user) => ({
            ...user,
            bioMdx: await getMdxSource(user.bio || placeholderBio),
        })));
    } catch (error) {
        console.error('Error in searchUser:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function getUserCount() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT COUNT(*) FROM "user"');
        return parseInt(res.rows[0].count, 10);
    } catch (error) {
        console.error('Error in getUserCount:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function updateUser(username, bio) {
    const client = await pool.connect();
    try {
        const res = await client.query('UPDATE "user" SET bio = $1, updated_at = NOW() WHERE username = $2', [bio, username]);
        return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
        console.error('Error in updateUser:', error);
        throw error;
    } finally {
        client.release();
    }
}
