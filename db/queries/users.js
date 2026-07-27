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
