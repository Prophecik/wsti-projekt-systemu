import { ImapFlow } from "imapflow";
import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function streamToString(stream) {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("data", chunk => (data += chunk.toString()));
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
    });
}

async function getMailText(client, uid) {
    const dl = await client.download(uid, "TEXT");
    if (!dl) return "";
    const content = dl.content;

    if (Buffer.isBuffer(content)) return content.toString("utf8");
    if (typeof content === "string") return content;
    if (typeof content.read === "function") return await streamToString(content);

    return "";
}

async function processMessage(client, uid) {
    const msg = await client.fetchOne(uid, {
        envelope: true,
        source: true,
        bodyStructure: true
    });

    const text = await getMailText(client, uid);

    const ticket = await prisma.tickets.create({
        data: {
            subject: msg.envelope.subject,
            customerEmail: msg.envelope.from[0].address,
            status: 1
        }
    });

    await prisma.messages.create({
        data: {
            sender: msg.envelope.from[0].address,
            content: text,
            ticketId: ticket.id
        }
    });

    console.log("Nowy mail zapisany → ticket:", ticket.id);
}

export async function startImap() {
    const client = new ImapFlow({
        host: process.env.IMAP_HOST,
        port: Number(process.env.IMAP_PORT),
        secure: true,
        auth: {
            user: process.env.IMAP_USER,
            pass: process.env.IMAP_PASS
        },
        logger: false
    });

    await client.connect();

    // nasłuchiwanie nowych maili
    client.on("exists", async () => {
        const uids = await client.search({ all: true });
        const lastUid = uids[uids.length - 1];
        await processMessage(client, lastUid);
    });

    // odczyt istniejących maili
    const lock = await client.getMailboxLock("INBOX");
    const uids = await client.search({ all: true });

    try {
        for (const uid of uids) {
            await processMessage(client, uid);
        }
    } finally {
        lock.release();
    }
}
