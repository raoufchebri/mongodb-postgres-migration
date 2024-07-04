"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI; // your mongodb connection string
const options = {};
class Singleton {
    static _instance;
    client;
    clientPromise;
    constructor() {
        this.client = new mongodb_1.MongoClient(uri, options);
        this.clientPromise = this.client.connect();
        if (process.env.NODE_ENV === 'development') {
            // In development mode, use a global variable so that the value
            // is preserved across module reloads caused by HMR (Hot Module Replacement).
            global._mongoClientPromise = this.clientPromise;
        }
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new Singleton();
        }
        return this._instance.clientPromise;
    }
}
const clientPromise = Singleton.instance;
// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
exports.default = clientPromise;
