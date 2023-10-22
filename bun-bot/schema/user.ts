import { boolean, datetime, int, json, mysqlTable, smallint, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("guilds", {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    discriminator: varchar("discriminator", { length: 255 }).notNull(),
    global_name: varchar("global_name", { length: 255 }),
    avatar: varchar("avatar", { length: 255 }),
    bot: boolean("bot").notNull().default(false),
    economy: json("economy").notNull().default({
        coins: int("coins").notNull().default(0),
    }),
})