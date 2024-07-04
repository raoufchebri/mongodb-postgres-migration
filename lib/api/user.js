import pkg from 'pg';
const { Pool } = pkg;

export async function getMdxSource(postContents) {
    // Use remark plugins to convert markdown into HTML string
    const { remark } = await import("remark");
    const remarkMdx = (await import("remark-mdx")).default;
    const { serialize } = await import("next-mdx-remote/serialize");
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

export async function getUser(username) {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_CONNECTION_URI,
    });
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
    } finally {
        client.release();
    }
}

export async function getFirstUser() {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_CONNECTION_URI,
    });
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
    } finally {
        client.release();
    }
}

export async function getAllUsers() {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_CONNECTION_URI,
    });
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
    } finally {
        client.release();
    }
}

export async function searchUser(query) {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_CONNECTION_URI,
    });
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
    } finally {
        client.release();
    }
}

export async function getUserCount() {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_CONNECTION_URI,
    });
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT COUNT(*) FROM "user"');
        return parseInt(res.rows[0].count, 10);
    } finally {
        client.release();
    }
}

export async function updateUser(username, bio) {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_CONNECTION_URI,
    });
    const client = await pool.connect();
    try {
        const res = await client.query('UPDATE "user" SET bio = $1, updated_at = NOW() WHERE username = $2', [bio, username]);
        return res.rowCount !== null && res.rowCount > 0;
    } finally {
        client.release();
    }
}
