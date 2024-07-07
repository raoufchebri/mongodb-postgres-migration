"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.user = (0, pg_core_1.pgTable)('user', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    username: (0, pg_core_1.text)('username').notNull().unique(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    image: (0, pg_core_1.text)('image'),
    bio: (0, pg_core_1.text)('bio'),
    followers: (0, pg_core_1.integer)('followers').default(0),
    verified: (0, pg_core_1.boolean)('verified').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().$onUpdateFn(() => (0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
