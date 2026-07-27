import express from "express";
const router = express();
export default router;

import getUserFromToken from "#middleware/getUserFromToken";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "#db/queries/orders";
import { createOrderProduct } from "#db/queries/orders_products";
import { getProductsByOrderId } from "#db/queries/products";

router.all("{*splat}", getUserFromToken, requireUser, (req, res, next) => {
  next();
});

router.post("/", requireBody(["date"]), async (req, res) => {
  const newOrder = {
    date: req.body.date,
    note: req.body.note,
    user_id: req.user.id,
  };
  const order = await createOrder(newOrder);
  res.status(201).send(order);
});

router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

router.param("id", async (req, res, next) => {
  const order = await getOrderById(req.params.id);

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
    const newOrderProduct = {
      order_id: req.order.id,
      product_id: req.body.productId,
      quantity: req.body.quantity,
    };
    const orderProduct = await createOrderProduct(newOrderProduct);
    res.status(201).send(orderProduct);
  },
);

router.get("/:id/products", async (req, res) => {
  const products = await getProductsByOrderId(req.order.id);
  res.send(products);
});
