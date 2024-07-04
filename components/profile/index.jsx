"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileWidth = void 0;
exports.default = Profile;
const gradients_1 = require("@/lib/gradients");
const icons_1 = require("@/components/icons");
const react_1 = require("next-auth/react");
const blur_image_1 = __importDefault(require("../blur-image"));
const react_2 = require("react");
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const react_textarea_autosize_1 = __importDefault(require("react-textarea-autosize"));
const next_mdx_remote_1 = require("next-mdx-remote");
exports.profileWidth = 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8';
function Profile({ settings, user }) {
    const router = (0, router_1.useRouter)();
    const { data: session } = (0, react_1.useSession)();
    const [saving, setSaving] = (0, react_2.useState)(false);
    const [data, setData] = (0, react_2.useState)({
        username: user.username,
        image: user.image,
        bio: user.bio || '',
        bioMdx: user.bioMdx
    });
    if (data.username !== user.username) {
        setData(user);
    }
    const [error, setError] = (0, react_2.useState)('');
    const settingsPage = settings ||
        (router.query.settings === 'true' && router.asPath === '/settings');
    const handleDismiss = (0, react_2.useCallback)(() => {
        if (settingsPage)
            router.replace(`/${user.username}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);
    const handleSave = async () => {
        setError('');
        setSaving(true);
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const bioMdx = await response.json();
                setData({
                    ...data,
                    bioMdx
                }); // optimistically show updated state for bioMdx
                router.replace(`/${user.username}`, undefined, { shallow: true });
            }
            else if (response.status === 401) {
                setError('Not authorized to edit this profile.');
            }
            else {
                setError('Error saving profile.');
            }
        }
        catch (error) {
            console.error(error);
        }
        setSaving(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onKeyDown = async (e) => {
        if (e.key === 'Escape') {
            handleDismiss();
        }
        else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            await handleSave();
        }
    };
    (0, react_2.useEffect)(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onKeyDown]);
    return (<div className="min-h-screen pb-20">
      <div>
        <div className={`h-48 w-full lg:h-64 
          ${(0, gradients_1.getGradient)(user.username)}`}/>
        <div className={`${exports.profileWidth} -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5`}>
          <div className="relative group h-24 w-24 rounded-full overflow-hidden sm:h-32 sm:w-32">
            {settingsPage && (<button className="absolute bg-gray-800 bg-opacity-50 hover:bg-opacity-70 w-full h-full z-10 transition-all flex items-center justify-center" onClick={() => alert('Image upload has been disabled for demo purposes.')}>
                <icons_1.UploadIcon className="h-6 w-6 text-white"/>
              </button>)}
            <blur_image_1.default src={user.image} alt={user.name} width={300} height={300}/>
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="flex min-w-0 flex-1 items-center space-x-2">
              <h1 className="text-2xl font-semibold text-white truncate">
                {user.name}
              </h1>
              {user.verified && (<icons_1.CheckInCircleIcon className="w-6 h-6 text-[#0070F3]"/>)}
            </div>
            {user.verified ? (<div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <a href={`https://github.com/${user.username}`} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center px-4 py-2 border border-gray-800 hover:border-white shadow-sm text-sm font-medium rounded-md text-white font-mono bg-black focus:outline-none focus:ring-0 transition-all">
                  <icons_1.GitHubIcon className="mr-3 h-5 w-5 text-white"/>
                  <span>View GitHub Profile</span>
                </a>
              </div>) : (<div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <a href="https://github.com/vercel/mongodb-starter" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center px-4 py-2 border border-gray-800 hover:border-white shadow-sm text-sm font-medium rounded-md text-white font-mono bg-black focus:outline-none focus:ring-0 transition-all">
                  <icons_1.GitHubIcon className="mr-3 h-5 w-5 text-white"/>
                  <span>Demo Account</span>
                </a>
              </div>)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 sm:mt-2 2xl:mt-5">
        <div className="border-b border-gray-800">
          <div className={`${exports.profileWidth} mt-10`}>
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (<button key={tab.name} disabled={tab.name !== 'Profile'} className={`${tab.name === 'Profile'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 cursor-not-allowed'}
                    whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm font-mono`}>
                  {tab.name}
                </button>))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className={`${exports.profileWidth} mt-16`}>
        <h2 className="font-semibold font-mono text-2xl text-white">Bio</h2>
        {settingsPage ? (<>
            <react_textarea_autosize_1.default name="description" onInput={(e) => {
                setData({
                    ...data,
                    bio: e.target.value
                });
            }} className="mt-1 w-full max-w-2xl px-0 text-sm tracking-wider leading-6 text-white bg-black font-mono border-0 border-b border-gray-800 focus:border-white resize-none focus:outline-none focus:ring-0" placeholder="Enter a short bio about yourself... (Markdown supported)" value={data.bio}/>
            <div className="flex justify-end w-full max-w-2xl">
              <p className="text-gray-400 font-mono text-sm">
                {data.bio.length}/256
              </p>
            </div>
          </>) : (<article className="mt-3 max-w-2xl text-sm tracking-wider leading-6 text-white font-mono prose prose-headings:text-white prose-a:text-white">
            <next_mdx_remote_1.MDXRemote {...data.bioMdx}/>
          </article>)}
      </div>

      {/* Edit buttons */}
      {settingsPage ? (<div className="fixed bottom-10 right-10 flex items-center space-x-3">
          <p className="text-sm text-gray-500">{error}</p>
          <button className={`${saving ? 'cursor-not-allowed' : ''} rounded-full border border-[#0070F3] hover:border-2 w-12 h-12 flex justify-center items-center transition-all`} disabled={saving} onClick={handleSave}>
            {saving ? (<icons_1.LoadingDots color="white"/>) : (<icons_1.CheckIcon className="h-4 w-4 text-white"/>)}
          </button>
          <link_1.default href={`/${user.username}`} shallow replace scroll={false}>
            <a className="rounded-full border border-gray-800 hover:border-white w-12 h-12 flex justify-center items-center transition-all">
              <icons_1.XIcon className="h-4 w-4 text-white"/>
            </a>
          </link_1.default>
        </div>) : session?.username === user.username ? (<link_1.default href={{ query: { settings: true } }} as="/settings" shallow replace scroll={false}>
          <a className="fixed bottom-10 right-10 rounded-full border bg-black border-gray-800 hover:border-white w-12 h-12 flex justify-center items-center transition-all">
            <icons_1.EditIcon className="h-4 w-4 text-white"/>
          </a>
        </link_1.default>) : null}
    </div>);
}
const tabs = [
    { name: 'Profile' },
    { name: 'Work History' },
    { name: 'Contact' }
];
