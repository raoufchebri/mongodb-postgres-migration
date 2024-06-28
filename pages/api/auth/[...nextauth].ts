import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { TypeORMAdapter } from '@auth/typeorm-adapter';
import { DataSource } from 'typeorm';
import { User } from '../../../entities/User'; // Adjust the import path as needed

const dataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRESQL_URI,
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
};

export default NextAuth({
  adapter: TypeORMAdapter(dataSourceOptions),
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
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
