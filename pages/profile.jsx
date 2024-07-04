"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const react_1 = require("next-auth/react");
function Profile() {
    return <div>Profile</div>;
}
exports.default = Profile;
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
    return {
        redirect: {
            permanent: false,
            destination: `/${session.username}`
        }
    };
};
exports.getServerSideProps = getServerSideProps;
