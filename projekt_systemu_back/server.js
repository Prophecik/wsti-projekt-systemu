import express from "express";
import cors from "cors";
import { ImapFlow } from "imapflow";
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend działa");
});

app.listen(3000, () => {
    console.log("Server działa na porcie 3000");
});

async function startImap() {
    const client = new ImapFlow({
        host: process.env.IMAP_HOST,
        port: Number(process.env.IMAP_PORT),
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASS,
        },
    });

    await client.connect();
    console.log("Połączono z IMAP");

    let lock = await client.getMailboxLock("INBOX");

    try {
        for await (let msg of client.fetch("1:*", { envelope: true, source: true })) {
            console.log("-----");
            console.log("Nadawca:", msg.envelope.from);
            console.log("Temat:", msg.envelope.subject);
            console.log("Data:", msg.envelope.date);

            const saveTicket = await prisma.tickets.create({
                data: {
                    subject: msg.envelope.subject,
                    customerEmail: msg.envelope.from[0].address,
                    status: 1,
                }
            });
            console.log("Zapisano ticket ID:", saveTicket.id);
        }
    } finally {
        lock.release();
    }

    await client.logout();
}



startImap();
