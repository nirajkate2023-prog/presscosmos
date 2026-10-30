// PressCosmos admin — set or reset the admin password.
//
// Run: npm run admin:passwd
//
// Prompts on the terminal with the input hidden. For automation, set
// PC_ADMIN_PASSWORD (and optionally PC_ADMIN_USERNAME) instead of typing them.

import { createInterface } from 'node:readline';

import { isConfigured, readAuth, writeAuth, describePassword } from './lib/auth.mjs';

const askHidden = (question) => new Promise((resolve) => {
  process.stdout.write(question);
  const stdin = process.stdin;

  if (!stdin.isTTY) {
    const rl = createInterface({ input: stdin, output: process.stdout });
    return rl.once('line', (line) => { rl.close(); resolve(line.trim()); });
  }

  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  let value = '';

  const finish = () => {
    stdin.setRawMode(false);
    stdin.pause();
    stdin.removeListener('data', onData);
    process.stdout.write('\n');
    resolve(value);
  };

  const onData = (char) => {
    if (char === '\r' || char === '\n') return finish();
    if (char === '\u0003') { process.stdout.write('\n'); process.exit(1); }
    if (char === '\u007f') { value = value.slice(0, -1); return; }
    value += char;
  };

  stdin.on('data', onData);
});

const ask = (question, fallback = '') => new Promise((resolve) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`${question}${fallback ? ` (${fallback})` : ''}: `, (answer) => {
    rl.close();
    resolve(answer.trim() || fallback);
  });
});

const main = async () => {
  const existing = readAuth();
  console.log('');
  console.log(existing ? 'PressCosmos admin — reset password' : 'PressCosmos admin — create account');
  console.log('');

  const envUser = process.env.PC_ADMIN_USERNAME;
  const envPass = process.env.PC_ADMIN_PASSWORD;

  const username = existing?.username || envUser || await ask('Username', 'admin');
  const password = envPass || await askHidden('New password (hidden, min 10 characters): ');

  const problem = describePassword(password);
  if (problem) {
    console.error(`\n  ${problem}\n`);
    process.exit(1);
  }

  if (!envPass) {
    const again = await askHidden('Confirm password: ');
    if (again !== password) {
      console.error('\n  The passwords did not match.\n');
      process.exit(1);
    }
  }

  writeAuth(username, password);
  console.log(`\n  Password set for "${username}".`);
  console.log(`  Stored as a salted scrypt hash in admin/.auth.json (never committed).\n`);
};

main().catch((err) => {
  console.error(`\n  ${err.message}\n`);
  process.exit(1);
});
