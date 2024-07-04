"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const user_1 = require("lib/api/user");
const react_1 = require("next-auth/react");
const user_2 = require("lib/api/user");
async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const result = await (0, user_1.searchUser)(req.query.query);
            return res.status(200).json(result);
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                error: e.toString()
            });
        }
    }
    else if (req.method === 'PUT') {
        const { username, bio } = req.body;
        const session = await (0, react_1.getSession)({ req });
        if (!session || session.username !== username) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        try {
            const result = await (0, user_1.updateUser)(username, bio);
            if (result) {
                await res.revalidate(`/${username}`);
            }
            const bioMdx = await (0, user_2.getMdxSource)(bio); // return bioMdx to optimistically show updated state
            return res.status(200).json(bioMdx);
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                error: e.toString()
            });
        }
    }
    else {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
