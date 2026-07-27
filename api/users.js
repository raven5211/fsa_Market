import express from "express";
const router = express();
export default router;

import requireBody from "#middleware/requireBody";

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, next) => {
    const newUser = req.body;
    res.send("post /users/register test");
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, next) => {
    const userCredentials = req.body;
    res.send("post /users/login test");
  },
);
