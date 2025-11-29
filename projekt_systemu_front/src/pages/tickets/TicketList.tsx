import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Ticket {
  id: number;
  subject: string;
  customerEmail: string;
  status: number;
}

export async function getTicket(ticketId: number) {
  try {
    const res = await axios.get(`http://localhost:3000/api/tickets/${ticketId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}



const TicketList = function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/tickets")
      .then(res => setTickets(res.data))
      .catch(err => console.error("Error fetching tickets:", err));
  }, []);


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Ticketu</TableHead>
          <TableHead>Temat zgłoszenia</TableHead>
          <TableHead>e-mail klienta</TableHead>
          <TableHead>Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map(ticket => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.id}</TableCell>
            <TableCell>{ticket.subject}</TableCell>
            <TableCell>{ticket.customerEmail}</TableCell>
            <TableCell><Button
              onClick={async () => {
                const details = await getTicket(ticket.id);
                console.log("Szczegóły:", details);
                // później przerobimy to na router / modala
              }}
            >
              Zobacz
            </Button></TableCell>
          </TableRow>

        ))}
      </TableBody>

    </Table>

  )
}

export default TicketList;
