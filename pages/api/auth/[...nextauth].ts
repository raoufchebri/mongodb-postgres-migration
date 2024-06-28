import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { TypeORMAdapter } from '@next-auth/typeorm-adapter';
import { createConnection } from 'typeorm';

const connectionPromise = createConnection({
  type: 'postgres',
  url: process.env.POSTGRESQL_URI,
  synchronize: true,
  logging: true,
  entities: [
    // Add your entities here
  ],
});

export default NextAuth({
  adapter: TypeORMAdapter(connectionPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          followers: profile.followers,
          verified: true
        };
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.username = (user as any).username;
      }
      return session;
    }
  }
});
