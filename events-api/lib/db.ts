import logger from "./logger";
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'
import config from '../config';
import { Logger } from 'drizzle-orm';

// create the connection
const connection = connect({
  host: config.database.host,
  username: config.database.username,
  password: config.database.password,
})

class MyLogger implements Logger {
    logQuery(query: string, params: unknown[]): void {
        logger.info(query)
    }
}

const db = drizzle(connection)

export { db };