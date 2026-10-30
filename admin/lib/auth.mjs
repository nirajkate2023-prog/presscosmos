// PressCosmos admin — authentication.
//
// One operator account, stored outside git in admin/.auth.json as a salted
// scrypt hash. Passwords are never written in plain text anywhere, and the
// file is chmod 600 where the platform supports it.

import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, writeFileSync, chmodSync } from 'node:fs';

import { AUTH_FILE, readJson } from '../../tools/overrides.mjs';

const KEYLEN = 64;
const PARAMS = { N: 16384, r: 8, p: 1 };
const MIN_PASSWORD = 10;
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

/* --------------------------------------------------------------- password */

export const hashPassword = (password) => {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, KEYLEN, PARAMS);
  return ['scrypt', PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('hex'), key.toString('hex')].join('$');
};

export const verifyPassword = (password, stored) => {
  try {
    const [scheme, N, r, p, salt, key] = String(stored).split('$');
    if (scheme !== 'scrypt') return false;
    const expected = Buffer.from(key, 'hex');
    const actual = scryptSync(password, Buffer.from(salt, 'hex'), expected.length, { N: Number(N), r: Number(r), p: Number(p) });
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
};

export const describePassword = (password) => {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    return `Password must be at least ${MIN_PASSWORD} characters.`;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one letter and one number.';
  }
  return null;
};

/* ------------------------------------------------------------------ store */

export const isConfigured = () => existsSync(AUTH_FILE);
export const readAuth = () => readJson(AUTH_FILE, null);

export const writeAuth = (username, password) => {
  writeFileSync(AUTH_FILE, `${JSON.stringify({
    username,
    hash: hashPassword(password),
    updatedAt: new Date().toISOString(),
  }, null, 2)}\n`, 'utf8');
  try {
    chmodSync(AUTH_FILE, 0o600);
  } catch {
    // Windows and some filesystems ignore POSIX modes; not fatal.
  }
};

export const changePassword = (password) => {
  const auth = readAuth();
  if (!auth) throw new Error('Admin is not configured yet.');
  writeAuth(auth.username, password);
};

/* --------------------------------------------------------------- sessions */

const sessions = new Map();

export const createSession = (username) => {
  const token = randomBytes(32).toString('hex');
  const session = {
    username,
    csrf: randomBytes(24).toString('hex'),
    expires: Date.now() + SESSION_TTL_MS,
  };
  sessions.set(token, session);
  return { token, session };
};

export const getSession = (token) => {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  session.expires = Date.now() + SESSION_TTL_MS;
  return session;
};

export const destroySession = (token) => sessions.delete(token);

/* ------------------------------------------------------------ login limit */

const MAX_FAILURES = 6;
const LOCKOUT_MS = 15 * 60 * 1000;
const failures = new Map();

const failureEntry = (key) => {
  const entry = failures.get(key);
  if (entry && entry.blockedUntil && entry.blockedUntil < Date.now()) {
    failures.delete(key);
    return { count: 0, blockedUntil: 0 };
  }
  return entry || { count: 0, blockedUntil: 0 };
};

export const lockStatus = (key) => {
  const entry = failureEntry(key);
  if (entry.blockedUntil > Date.now()) {
    return Math.ceil((entry.blockedUntil - Date.now()) / 60000);
  }
  return 0;
};

export const recordFailure = (key) => {
  const entry = failureEntry(key);
  entry.count += 1;
  if (entry.count >= MAX_FAILURES) entry.blockedUntil = Date.now() + LOCKOUT_MS;
  failures.set(key, entry);
};

export const clearFailures = (key) => failures.delete(key);
