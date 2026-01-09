import { ZenStackClient } from '@zenstackhq/orm';
import { SqlJsDialect } from '@zenstackhq/orm/dialects/sql.js';
import initSqlJs from 'sql.js';
import { schema } from './zenstack/schema';

export async function createClient() {
  // initialize sql.js engine
  const SQL = await initSqlJs();

  // create database client with sql.js dialect
  const db = new ZenStackClient(schema, {
    dialect: new SqlJsDialect({ sqlJs: new SQL.Database() }),
    procedures: {
      getUserFeeds: ({ client, args }) => {
        return client.post.findMany({
          where: { authorId: args.userId },
          orderBy: { createdAt: 'desc' },
          take: args.limit
        });
      },

      signUp: ({ client, args }) => {
        // create a new user with a welcome post
        return client.user.create({
          data: {
            email: args.email,
            posts: {
              create: { title: 'Welcome Post', published: true }
            }
          }
        });
      }
    }
  });

  // push schema to the database
  // the `$pushSchema` API is for testing purposes only
  await db.$pushSchema();

  return db;
}
