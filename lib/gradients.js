"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGradient = exports.gradients = void 0;
// Source: https://hypercolor.dev/
exports.gradients = [
    'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
    'bg-gradient-to-l from-pink-300 via-purple-300 to-indigo-400',
    'bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100',
    'bg-gradient-to-r from-red-200 via-red-300 to-yellow-200',
    'bg-gradient-to-r from-green-200 via-green-300 to-blue-500',
    'bg-gradient-to-r from-indigo-300 to-purple-400',
    'bg-gradient-to-r from-green-200 to-green-500',
    'bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500'
];
/** Select a random gradient from the array of gradients based on a
 *  hash of the username string. If the username has already been hashed,
 *  reuse the same graident picked.
 */
function getGradient(username) {
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
    if (username) {
        const hash = hashCode(username);
        const index = hash % exports.gradients.length;
        return exports.gradients[Math.abs(index)];
    }
    else {
        return exports.gradients[Math.floor(Math.random() * exports.gradients.length)];
    }
}
exports.getGradient = getGradient;
