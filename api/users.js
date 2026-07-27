import express from "express";
const router = express();
export default router;

import requireBody from "#middleware/requireBody";

import { authenticate, createUser } from "#db/queries/users";

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const newUser = req.body;
    const token = await createUser(newUser);
    res.status(201).send(token);
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const userCredentials = req.body;
    const token = await authenticate(userCredentials);
    res.send(token);
  },
);
