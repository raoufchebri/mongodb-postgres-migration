import { Client } from 'pg';

const connectionString = 'postgresql://neondb_owner:3Z9OVPCQGawz@ep-ancient-violet-a52dmhci.us-east-2.aws.neon.tech/neondb?sslmode=require';

class Singleton {
  static _instance;
  client;
  clientPromise;
  constructor() {
    this.client = new Client({
      connectionString: connectionString,
    });
    this.clientPromise = this.client.connect();
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      global._pgClientPromise = this.clientPromise;
    }
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }
    return this._instance.client;
  }
}

const client = Singleton.instance;

// Export a module-scoped PostgreSQL client. By doing this in a
// separate module, the client can be shared across functions.
export default client;
