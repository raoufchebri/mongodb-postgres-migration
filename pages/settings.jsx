"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const profile_1 = __importDefault(require("@/components/profile"));
const meta_1 = require("@/components/layout/meta");
const user_1 = require("@/lib/api/user");
const react_1 = require("next-auth/react");
function Settings({ user }) {
    return <profile_1.default settings={true} user={user}/>;
}
exports.default = Settings;
const getServerSideProps = async ({ req }) => {
    const session = await (0, react_1.getSession)({ req });
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        };
    }
    const results = await (0, user_1.getAllUsers)();
    const totalUsers = await (0, user_1.getUserCount)();
    const user = await (0, user_1.getUser)(session.username);
    const meta = {
        ...meta_1.defaultMetaProps,
        title: `Settings | MongoDB Starter Kit`
    };
    return {
        props: {
            meta,
            results,
            totalUsers,
            user
        }
    };
};
exports.getServerSideProps = getServerSideProps;
