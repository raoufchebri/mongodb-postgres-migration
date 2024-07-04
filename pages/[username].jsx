"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticProps = exports.getStaticPaths = exports.default = void 0;
const meta_1 = require("@/components/layout/meta");
const user_1 = require("@/lib/api/user");
var _1 = require(".");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(_1).default; } });
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
const getStaticPaths = async () => {
    // You should remove this try-catch block once your MongoDB Cluster is fully provisioned
    try {
        await mongodb_1.default;
    }
    catch (e) {
        // cluster is still provisioning
        return {
            paths: [],
            fallback: true
        };
    }
    const results = await (0, user_1.getAllUsers)();
    const paths = results.flatMap(({ users }) => users.map((user) => ({ params: { username: user.username } })));
    return {
        paths,
        fallback: true
    };
};
exports.getStaticPaths = getStaticPaths;
const getStaticProps = async (context) => {
    // You should remove this try-catch block once your MongoDB Cluster is fully provisioned
    try {
        await mongodb_1.default;
    }
    catch (e) {
        if (e.code === 'ENOTFOUND') {
            // cluster is still provisioning
            return {
                props: {
                    clusterStillProvisioning: true
                }
            };
        }
        else {
            throw new Error(`Connection limit reached. Please try again later.`);
        }
    }
    const { username } = context.params;
    const user = await (0, user_1.getUser)(username);
    if (!user) {
        return {
            notFound: true,
            revalidate: 10
        };
    }
    const results = await (0, user_1.getAllUsers)();
    const totalUsers = await (0, user_1.getUserCount)();
    const ogUrl = `https://mongodb.vercel.app/${user.username}`;
    const meta = {
        ...meta_1.defaultMetaProps,
        title: `${user.name}'s Profile | MongoDB Starter Kit`,
        ogImage: `https://api.microlink.io/?url=${ogUrl}&screenshot=true&meta=false&embed=screenshot.url`,
        ogUrl: `https://mongodb.vercel.app/${user.username}`
    };
    return {
        props: {
            meta,
            results,
            totalUsers,
            user
        },
        revalidate: 10
    };
};
exports.getStaticProps = getStaticProps;
