"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetcher;
async function fetcher(input, init) {
    const res = await fetch(input, init);
    if (!res.ok && res.status === 401) {
        throw new Error('Unauthorized');
    }
    return res.json();
}
