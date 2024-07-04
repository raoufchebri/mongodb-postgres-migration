"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticProps = void 0;
exports.default = Home;
const profile_1 = __importDefault(require("@/components/profile"));
const user_1 = require("@/lib/api/user");
const meta_1 = require("@/components/layout/meta");
const mongodb_1 = __importDefault(require("@/lib/mongodb"));
function Home({ user }) {
    return <profile_1.default user={user} settings={false}/>;
}
const getStaticProps = async () => {
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
    const results = await (0, user_1.getAllUsers)();
    const totalUsers = await (0, user_1.getUserCount)();
    const firstUser = await (0, user_1.getFirstUser)();
    return {
        props: {
            meta: meta_1.defaultMetaProps,
            results,
            totalUsers,
            user: firstUser
        },
        revalidate: 10
    };
};
exports.getStaticProps = getStaticProps;
