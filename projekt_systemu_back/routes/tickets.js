import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
    const tickets = await prisma.tickets.findMany();
    res.json(tickets);
});

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const ticket = await prisma.tickets.findUnique({
        where: { id }
    });

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    res.json(ticket);
});

router.post("/", async (req, res) => {
    const { subject, customerEmail } = req.body;

    const newTicket = await prisma.tickets.create({
        data: {
            subject,
            customerEmail,
            status: 1,
        }
    });

    res.json(newTicket);
});

export default router;
