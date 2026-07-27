import express from "express";
const router = express();
export default router;

import getUserFromToken from "#middleware/getUserFromToken";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router.all("{*splat}", getUserFromToken, requireUser, (req, res, next) => {
  next();
});

router.post("/", requireBody(["date"]), async (req, res) => {
  const newOrder = {
    date: req.body.date,
    note: req.body.note,
    user_id: req.user.id,
  };
  res.send("post /orders test");
});

router.get("/", async (req, res) => {
  const orders;
  res.send("get /orders test");
});

router.param("id", async (req, res, next) => {
  const order;

  if (!order) return res.status(404).send("order not found");
  if (order.user_id !== req.user.id)
    return res.status(403).send("not authorized");

  req.order = order;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.order);
});

router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const newProduct = {
      product_id: req.body.productId,
      quantity: req.body.quantity,
    };
    res.send("post /orders/:id/products test");
  },
);

router.get("/:id/products", async (req, res) => {
  const products;
  res.send("get /orders/:id/products");
});
