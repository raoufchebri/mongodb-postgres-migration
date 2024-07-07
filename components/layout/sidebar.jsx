"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/outline");
const directory_1 = __importDefault(require("./directory"));
function Sidebar({ sidebarOpen, setSidebarOpen, results, totalUsers }) {
    return (<react_2.Transition.Root show={sidebarOpen} as={react_1.Fragment}>
      <react_2.Dialog as="div" className="relative z-40 bg-black lg:hidden" onClose={setSidebarOpen}>
        <react_2.Transition.Child as={react_1.Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"/>
        </react_2.Transition.Child>

        <div className="fixed inset-0 flex z-40">
          <react_2.Transition.Child as={react_1.Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
            <react_2.Dialog.Panel className="relative flex-1 flex flex-col max-w-sm w-full bg-white focus:outline-none">
              <react_2.Transition.Child as={react_1.Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setSidebarOpen(false)}>
                    <span className="sr-only">Close sidebar</span>
                    <outline_1.XIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                  </button>
                </div>
              </react_2.Transition.Child>
              <directory_1.default results={results} totalUsers={totalUsers}/>
            </react_2.Dialog.Panel>
          </react_2.Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </react_2.Dialog>
    </react_2.Transition.Root>);
}
const navigation = [
    { name: 'Dashboard', href: '#', icon: outline_1.HomeIcon, current: false },
    { name: 'Calendar', href: '#', icon: outline_1.CalendarIcon, current: false },
    { name: 'Teams', href: '#', icon: outline_1.UserGroupIcon, current: false },
    { name: 'Directory', href: '#', icon: outline_1.SearchCircleIcon, current: true },
    { name: 'Announcements', href: '#', icon: outline_1.SpeakerphoneIcon, current: false },
    { name: 'Office Map', href: '#', icon: outline_1.MapIcon, current: false }
];
const secondaryNavigation = [
    { name: 'Apps', href: '#', icon: outline_1.ViewGridAddIcon },
    { name: 'Settings', href: '#', icon: outline_1.CogIcon }
];
const user = {
    name: 'Tom Cook',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};
