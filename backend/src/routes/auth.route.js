import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Login endpoint");
});
router.get("/logout", (req, res) => {
  res.send("logout endpoint");
});
router.get("/signup", (req, res) => {
  res.send("signup endpoint");
});

export default router;
