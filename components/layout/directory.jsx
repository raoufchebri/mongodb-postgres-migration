"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const swr_1 = __importDefault(require("swr"));
const fetcher_1 = __importDefault(require("@/lib/fetcher"));
const use_debounce_1 = require("@/lib/hooks/use-debounce");
const react_1 = require("react");
const icons_1 = require("@/components/icons");
const directory_results_1 = __importDefault(require("./directory-results"));
function Directory({ results, totalUsers }) {
    const [query, setQuery] = (0, react_1.useState)('');
    const debouncedQuery = (0, use_debounce_1.useDebounce)(query, 200);
    const { data: searchedUsers } = (0, swr_1.default)(debouncedQuery.length > 0 && `api/user?query=${debouncedQuery}`, fetcher_1.default, {
        keepPreviousData: true
    });
    return (<aside className="flex-shrink-0 w-full bg-black sm:w-96 h-full overflow-scroll border-r border-gray-800">
      <div className="px-6 pt-6 pb-0 sticky top-0 bg-black z-20">
        <link_1.default href="/">
          <a>
            <div className="bg-dark-accent-1 hover:bg-dark-accent-2 transition-all rounded-2xl h-12 w-12 flex justify-center items-center">
              <icons_1.DirectoryIcon className="text-white"/>
            </div>
          </a>
        </link_1.default>
        <p className="mt-8 text-2xl text-white font-bold">Directory</p>
        <p className="mt-2 text-sm text-dark-accent-5">
          Search directory of {Intl.NumberFormat('en-us').format(totalUsers)}{' '}
          developers
        </p>
        <form className="py-8 flex space-x-4" action="#">
          <div className="flex-1 min-w-0">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative shadow-sm border-0 border-b-dark-accent-2 rounded-none border-b-[1px] ">
              <div className="absolute bg-black inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <icons_1.SearchIcon className="h-4 w-4 text-dark-accent-3"/>
              </div>
              <input type="search" name="search" id="search" className="text-white placeholder:text-dark-accent-3 focus:ring-transparent border-none bg-black focus:border-transparent block w-full pl-10 sm:text-sm rounded-md" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)}/>
            </div>
          </div>
        </form>
      </div>
      {/* Directory list */}
      <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" aria-label="Directory">
        {debouncedQuery.length === 0 ? (results.map(({ _id: letter, users }) => (<div key={letter} className="relative">
              <div className="bg-dark-accent-1 px-6 py-1 text-sm font-bold text-white uppercase">
                <h3>{letter}</h3>
              </div>
              <directory_results_1.default users={users}/>
            </div>))) : searchedUsers && searchedUsers.length > 0 ? (<directory_results_1.default users={searchedUsers}/>) : (<div className="px-6 py-6">
            <p className="text-center text-gray-500">No results found</p>
          </div>)}
      </nav>
    </aside>);
}
exports.default = Directory;
