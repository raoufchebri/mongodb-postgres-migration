import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  image: text('image'),
  bio: text('bio'),
  bioMdx: text('bioMdx'),
  followers: serial('followers').default(0),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
