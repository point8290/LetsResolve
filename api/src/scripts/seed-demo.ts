/**
 * Seeds the public demo with realistic sample data.
 *
 * Every item uses a fixed id, so running this again resets the sample records
 * to their original state (records created by visitors are left alone).
 * Runs as part of the Render build when SEED_DEMO=true.
 */
import { BatchWriteItemCommand, WriteRequest } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { dyanmoClient } from "../config/awsConfig";
import Customer from "../model/Customer";
import Contact from "../model/Contact";
import Ticket from "../model/Ticket";
import Article from "../model/Article";
import Comment from "../model/Comment";

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const ago = (days: number, hours = 0) => new Date(now - days * DAY - hours * 3600 * 1000).toISOString();

const SUPPORT = "support@letsresolve.demo";

const customers: Customer[] = [
  { CustomerId: "demo-cust-northwind", Name: "Northwind Logistics", Domain: "northwind.example", Notes: "Enterprise plan. Renewal in Q1.", CreatedAt: ago(60), UpdatedAt: ago(5) },
  { CustomerId: "demo-cust-brightpath", Name: "BrightPath Learning", Domain: "brightpath.example", Notes: "Uses SSO. Prefers e-mail updates.", CreatedAt: ago(45), UpdatedAt: ago(2) },
  { CustomerId: "demo-cust-greenleaf", Name: "Greenleaf Foods", Domain: "greenleaf.example", Notes: "Pilot customer, 20 seats.", CreatedAt: ago(30), UpdatedAt: ago(1) },
];

const contacts: Contact[] = [
  { CustomerId: "demo-cust-northwind", ContactId: "demo-con-anita", Name: "Anita Rao", Email: "anita.rao@northwind.example", Phone: "+91 98200 11111", CreatedAt: ago(60), UpdatedAt: ago(60) },
  { CustomerId: "demo-cust-northwind", ContactId: "demo-con-james", Name: "James Carter", Email: "james.carter@northwind.example", CreatedAt: ago(40), UpdatedAt: ago(40) },
  { CustomerId: "demo-cust-brightpath", ContactId: "demo-con-meera", Name: "Meera Shah", Email: "meera@brightpath.example", CreatedAt: ago(45), UpdatedAt: ago(45) },
  { CustomerId: "demo-cust-greenleaf", ContactId: "demo-con-tom", Name: "Tom Becker", Email: "tom@greenleaf.example", Phone: "+1 555 0100", CreatedAt: ago(30), UpdatedAt: ago(30) },
];

const tickets: Ticket[] = [
  { TicketId: "demo-tkt-1001", Subject: "Invoice PDF shows the wrong billing address", Description: "Since last week's update, invoices generated for our EU entity show the US address.", Status: "open", Priority: "high", AssignedTo: SUPPORT, CustomerId: "demo-cust-northwind", ContactId: "demo-con-anita", Attachments: [], CreatedAt: ago(1, 3), UpdatedAt: ago(1, 3), CreatedBy: "anita.rao@northwind.example" },
  { TicketId: "demo-tkt-1002", Subject: "SSO login loops back to the sign-in page", Description: "Users on Chrome get redirected back to sign-in after entering credentials. Safari works.", Status: "in_progress", Priority: "urgent", AssignedTo: SUPPORT, CustomerId: "demo-cust-brightpath", ContactId: "demo-con-meera", Attachments: [], CreatedAt: ago(2), UpdatedAt: ago(0, 5), CreatedBy: "meera@brightpath.example" },
  { TicketId: "demo-tkt-1003", Subject: "Export to CSV times out for large reports", Description: "Exporting the yearly shipments report (about 120k rows) fails after 60 seconds.", Status: "in_progress", Priority: "medium", AssignedTo: SUPPORT, CustomerId: "demo-cust-northwind", ContactId: "demo-con-james", Attachments: [], CreatedAt: ago(4), UpdatedAt: ago(1), CreatedBy: "james.carter@northwind.example" },
  { TicketId: "demo-tkt-1004", Subject: "Add two more seats to our plan", Description: "We're onboarding two new team members next Monday.", Status: "resolved", Priority: "low", AssignedTo: SUPPORT, CustomerId: "demo-cust-greenleaf", ContactId: "demo-con-tom", Attachments: [], CreatedAt: ago(6), UpdatedAt: ago(5, 20), CreatedBy: "tom@greenleaf.example" },
  { TicketId: "demo-tkt-1005", Subject: "Password reset e-mail not arriving", Description: "Reset e-mails don't reach our domain. Other e-mails from you arrive fine.", Status: "resolved", Priority: "high", AssignedTo: SUPPORT, CustomerId: "demo-cust-brightpath", ContactId: "demo-con-meera", Attachments: [], CreatedAt: ago(9), UpdatedAt: ago(8), CreatedBy: "meera@brightpath.example" },
  { TicketId: "demo-tkt-1006", Subject: "Dashboard charts load slowly in the morning", Description: "Between 9 and 10 am the dashboard takes 15+ seconds to load.", Status: "closed", Priority: "medium", AssignedTo: SUPPORT, CustomerId: "demo-cust-northwind", ContactId: "demo-con-anita", Attachments: [], CreatedAt: ago(14), UpdatedAt: ago(11), CreatedBy: "anita.rao@northwind.example" },
  { TicketId: "demo-tkt-1007", Subject: "Question about data retention policy", Description: "How long do you keep deleted records, and can we request permanent deletion?", Status: "open", Priority: "low", AssignedTo: SUPPORT, CustomerId: "demo-cust-greenleaf", ContactId: "demo-con-tom", Attachments: [], CreatedAt: ago(0, 6), UpdatedAt: ago(0, 6), CreatedBy: "tom@greenleaf.example" },
];

const comment = (ticketId: string, id: string, type: Comment["Type"], body: string, author: string, at: string): Comment => ({
  TicketId: ticketId, SortKey: `${at}#${id}`, CommentId: id, Type: type, Body: body, AuthorEmail: author, CreatedAt: at,
});

const comments: Comment[] = [
  comment("demo-tkt-1002", "demo-cmt-1", "status_change", "Status changed from Open to In progress", SUPPORT, ago(1, 20)),
  comment("demo-tkt-1002", "demo-cmt-2", "comment", "Reproduced on Chrome 128. The session cookie is being dropped because of a SameSite setting. Fix is in review.", SUPPORT, ago(1, 18)),
  comment("demo-tkt-1002", "demo-cmt-3", "priority_change", "Priority changed from High to Urgent", SUPPORT, ago(0, 5)),
  comment("demo-tkt-1003", "demo-cmt-4", "comment", "Moving the export to a background job with an e-mailed download link.", SUPPORT, ago(1)),
  comment("demo-tkt-1004", "demo-cmt-5", "comment", "Two seats added. The new users can sign in now.", SUPPORT, ago(5, 20)),
  comment("demo-tkt-1004", "demo-cmt-6", "status_change", "Status changed from Open to Resolved", SUPPORT, ago(5, 20)),
  comment("demo-tkt-1005", "demo-cmt-7", "comment", "Their mail server rejected our sender. Added SPF and DKIM records; resets now arrive.", SUPPORT, ago(8)),
];

const articles: Article[] = [
  { ArticleId: "demo-art-sso", Title: "Fixing SSO sign-in loops in Chrome", Description: "If users are sent back to the sign-in page after entering credentials, clear cookies for the app domain and make sure third-party cookies are allowed for your identity provider. Admins can check the SSO configuration under Settings → Security.", Author: SUPPORT, Attachments: [], CreatedAt: ago(20), UpdatedAt: ago(1) },
  { ArticleId: "demo-art-seats", Title: "Adding or removing seats", Description: "Account owners can change the number of seats from Billing → Plan. Changes apply immediately and are prorated on the next invoice.", Author: SUPPORT, Attachments: [], CreatedAt: ago(35), UpdatedAt: ago(35) },
  { ArticleId: "demo-art-email", Title: "Password reset e-mails not arriving", Description: "Ask your IT team to allow our sending domain and check spam quarantine. If your domain uses strict DMARC, our support team can help confirm SPF and DKIM alignment.", Author: SUPPORT, Attachments: [], CreatedAt: ago(8), UpdatedAt: ago(8) },
];

async function writeAll(table: string, items: object[]) {
  for (let i = 0; i < items.length; i += 25) {
    const requests: WriteRequest[] = items.slice(i, i + 25).map((item) => ({
      PutRequest: { Item: marshall(item, { removeUndefinedValues: true }) },
    }));
    await dyanmoClient.send(new BatchWriteItemCommand({ RequestItems: { [table]: requests } }));
  }
  console.log(`seeded ${items.length} → ${table}`);
}

async function main() {
  await writeAll("Customer", customers);
  await writeAll("Contact", contacts);
  await writeAll("Ticket", tickets);
  await writeAll("Comment", comments);
  await writeAll("Article", articles);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
