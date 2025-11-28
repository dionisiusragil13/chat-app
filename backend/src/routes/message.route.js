import express, { Router } from "express";

const router = express.Router();

router.get('/send', (req, res) => {
  res.send('GET request to the homepage')
})

export default router;