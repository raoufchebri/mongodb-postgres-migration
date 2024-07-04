"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@/styles/globals.css");
const react_1 = require("next-auth/react");
const layout_1 = __importDefault(require("@/components/layout"));
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (<react_1.SessionProvider session={session}>
      <layout_1.default {...pageProps}>
        <Component {...pageProps}/>
      </layout_1.default>
    </react_1.SessionProvider>);
}
exports.default = MyApp;
