"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_auth_1 = __importDefault(require("next-auth"));
const github_1 = __importDefault(require("next-auth/providers/github"));
const mongodb_adapter_1 = require("@next-auth/mongodb-adapter");
const mongodb_1 = __importDefault(require("lib/mongodb"));
exports.default = (0, next_auth_1.default)({
    adapter: (0, mongodb_adapter_1.MongoDBAdapter)(mongodb_1.default),
    providers: [
        (0, github_1.default)({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    username: profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    followers: profile.followers,
                    verified: true
                };
            }
        })
    ],
    callbacks: {
        async session({ session, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.username = user.username;
            return session;
        }
    }
});
