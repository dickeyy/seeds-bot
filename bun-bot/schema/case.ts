import { datetime, mysqlTable, smallint, varchar } from "drizzle-orm/mysql-core";

export const cases = mysqlTable("cases", {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    moderator_id: varchar("moderator_id", { length: 255 }).notNull(),
    guild_id: varchar("guild_id", { length: 255 }).notNull(),
    reason: varchar("reason", { length: 255 }).notNull(),
    type: smallint("type").notNull().default(0),
    created_at: datetime("created_at").notNull().default(new Date()),
})