"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const react_1 = require("next-auth/react");
const react_2 = require("react");
const icons_1 = require("@/components/icons");
const image_1 = __importDefault(require("next/image"));
const outline_1 = require("@heroicons/react/outline");
const link_1 = __importDefault(require("next/link"));
function Navbar({ setSidebarOpen }) {
    const { data: session, status } = (0, react_1.useSession)();
    const [loading, setLoading] = (0, react_2.useState)(false);
    return (<nav className="absolute right-0 w-full flex items-center justify-between md:justify-end px-4 h-16" aria-label="Navbar">
      <button type="button" className="inline-flex md:hidden items-center justify-center rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-0" onClick={() => setSidebarOpen(true)}>
        <span className="sr-only">Open sidebar</span>
        <outline_1.MenuIcon className="h-6 w-6" aria-hidden="true"/>
      </button>
      {status !== 'loading' &&
            (session?.user ? (<link_1.default href={`/${session.username}`}>
            <a className="w-8 h-8 rounded-full overflow-hidden">
              <image_1.default src={session.user.image ||
                    `https://avatar.tobi.sh/${session.user.name}`} alt={session.user.name || 'User'} width={300} height={300} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="/>
            </a>
          </link_1.default>) : (<button disabled={loading} onClick={() => {
                    setLoading(true);
                    (0, react_1.signIn)('github', { callbackUrl: `/profile` });
                }} className={`${loading
                    ? 'bg-gray-200 border-gray-300'
                    : 'bg-black hover:bg-white border-black'} w-36 h-8 py-1 text-white hover:text-black border rounded-md text-sm transition-all`}>
            {loading ? <icons_1.LoadingDots color="gray"/> : 'Log in with GitHub'}
          </button>))}
    </nav>);
}
