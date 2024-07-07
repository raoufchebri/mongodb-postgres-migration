"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DirectoryResults;
const link_1 = __importDefault(require("next/link"));
const blur_image_1 = __importDefault(require("../blur-image"));
const icons_1 = require("@/components/icons");
function DirectoryResults({ users }) {
    return (<ul role="list" className="relative z-0 directory-divide-y">
      {users.map((user) => (<li key={user.username}>
          <link_1.default href={`/${user.username}`} legacyBehavior>
            <a>
              <div className="relative px-6 py-4 flex items-center space-x-3 focus-within:ring-0">
                <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden">
                  <blur_image_1.default src={user.image} alt={user.name} width={300} height={300}/>
                </div>
                <div className="flex-1 min-w-0">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true"/>
                  <div className="flex items-center space-x-1">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                    </p>
                    {user.verified && (<icons_1.CheckInCircleIcon className="w-4 h-4 text-white"/>)}
                  </div>
                  <p className="text-sm text-dark-accent-5 truncate">
                    @{user.username}
                  </p>
                </div>
              </div>
            </a>
          </link_1.default>
        </li>))}
    </ul>);
}
