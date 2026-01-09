import { createClient } from './db';

async function main() {
  const db = await createClient();

  const user = await db.$procs.signUp({ args: { email: 'alice@zenstack.dev' } });
  console.log('Created user with "signUp" proc:', user);

  const feed = await db.$procs.getUserFeeds({ args: { userId: user.id } });
  console.log('Feeds from "getUserFeeds" proc:', feed);
}

main();
