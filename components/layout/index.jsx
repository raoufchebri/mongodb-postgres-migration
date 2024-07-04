"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
const react_1 = require("react");
const sidebar_1 = __importDefault(require("./sidebar"));
const navbar_1 = __importDefault(require("./navbar"));
const directory_1 = __importDefault(require("./directory"));
const toast_1 = __importDefault(require("@/components/layout/toast"));
const meta_1 = __importDefault(require("@/components/layout/meta"));
const router_1 = require("next/router");
const icons_1 = require("@/components/icons");
const cluster_provisioning_1 = __importDefault(require("@/components/layout/cluster-provisioning"));
function Layout({ meta, results, totalUsers, username, clusterStillProvisioning, children }) {
    const router = (0, router_1.useRouter)();
    const [sidebarOpen, setSidebarOpen] = (0, react_1.useState)(false);
    if (router.isFallback) {
        return (<div className="h-screen w-screen flex justify-center items-center bg-black">
        <icons_1.LoadingDots color="white"/>
      </div>);
    }
    // You should remove this once your MongoDB Cluster is fully provisioned
    if (clusterStillProvisioning) {
        return <cluster_provisioning_1.default />;
    }
    return (<div className="w-full mx-auto h-screen flex overflow-hidden bg-black">
      <meta_1.default props={meta}/>
      <toast_1.default username={username}/>
      <sidebar_1.default sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} results={results} totalUsers={totalUsers}/>

      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <div className="flex-1 relative z-0 flex overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
            {/* Navbar */}
            <navbar_1.default setSidebarOpen={setSidebarOpen}/>

            {children}
          </main>
          <div className="hidden md:order-first h-screen md:flex md:flex-col">
            <directory_1.default results={results} totalUsers={totalUsers}/>
          </div>
        </div>
      </div>
    </div>);
}
