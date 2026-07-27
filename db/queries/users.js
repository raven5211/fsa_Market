import db from "#db/client";
import { createToken } from "#utils/jwt";
import bcrypt from "bcrypt";

export async function createUser({ username, password }) {
  const hash = await bcrypt.hash(password, 12);
  const sql = `
    INSERT INTO users
      (username, password)
    VALUES
      ($1, $2)
    RETURNING *
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username, hash]);

  const token = createToken({ id: user.id });
  return token;
}

export async function authenticate({ username, password }) {
  const sql = `
    SELECT *
    FROM users
    WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);

  if (!user) {
    const error = new Error("invalid credentials");
    error.status = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const error = new Error("invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = createToken({ id: user.id });
  return token;
}

export async function getUserById(id) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
