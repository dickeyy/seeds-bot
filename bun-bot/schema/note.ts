import { datetime, mysqlTable, smallint, varchar } from "drizzle-orm/mysql-core";

export const notes = mysqlTable("notes", {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    moderator_id: varchar("moderator_id", { length: 255 }).notNull(),
    guild_id: varchar("guild_id", { length: 255 }).notNull(),
    content: varchar("content", { length: 255 }).notNull(),
    created_at: datetime("created_at").notNull().default(new Date()),
})