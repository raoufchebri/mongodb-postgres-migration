import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { TypeORMAdapter } from '@auth/typeorm-adapter';

export default NextAuth({
  adapter: TypeORMAdapter({
    type: 'postgres',
    url: process.env.POSTGRESQL_URI,
    synchronize: true,
    logging: true,
    entities: [
      // Add your entities here
    ],
  }),
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
      return session;
    }
  }
});
