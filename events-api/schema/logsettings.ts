import { boolean, datetime, int, json, mysqlTable, smallint, varchar } from "drizzle-orm/mysql-core";

export const logsettings = mysqlTable("logsettings", {
    guild_id: varchar("guild_id", { length: 255 }).primaryKey().notNull(),
    types: json("types").notNull(),
    enabled_types: json("enabled_types").notNull(),
})