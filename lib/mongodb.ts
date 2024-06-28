import { Client } from 'pg';

const connectionString = process.env.POSTGRESQL_URI as string; // your PostgreSQL connection string

declare global {
  var _pgClientPromise: Promise<Client>;
}

class Singleton {
  private static _instance: Singleton;
  private client: Client;
  private clientPromise: Promise<Client>;
  private constructor() {
    this.client = new Client({ connectionString });
    this.clientPromise = this.client.connect();
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      global._pgClientPromise = this.clientPromise;
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }
    return this._instance.clientPromise;
  }
}
const clientPromise = Singleton.instance;

// Export a module-scoped PostgreSQL client promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
