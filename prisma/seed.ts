import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function code(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `LMG-${suffix}`;
}

function daysAgo(n: number, hours = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() + hours);
  return d;
}

async function main() {
  console.log("Seeding logistics-app…");

  await prisma.trackingEvent.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.user.deleteMany();

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const hash = process.env.ADMIN_PASSWORD_HASH || (await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10));
  await prisma.user.create({
    data: { email, password: hash, name: "Logistics Admin", role: "ADMIN" },
  });

  const parcels: Array<{
    code: string;
    recipient: string;
    destination: string;
    service: string;
    status: string;
    events: Array<{ status: string; location: string; description: string; ts: Date }>;
  }> = [
    {
      code: code(),
      recipient: "Emma Dubois",
      destination: "Paris, France",
      service: "PARCEL",
      status: "DELIVERED",
      events: [
        { status: "CREATED", location: "Brussels, Belgium", description: "Shipping label created", ts: daysAgo(6) },
        { status: "IN_TRANSIT", location: "Liège, Belgium", description: "Departed sorting facility", ts: daysAgo(5) },
        { status: "CUSTOMS", location: "Paris, France", description: "Customs clearance completed", ts: daysAgo(3) },
        { status: "OUT_FOR_DELIVERY", location: "Paris, France", description: "Out for delivery", ts: daysAgo(1) },
        { status: "DELIVERED", location: "Paris, France", description: "Delivered to recipient", ts: daysAgo(0, -4) },
      ],
    },
    {
      code: code(),
      recipient: "James Smith",
      destination: "Manchester, UK",
      service: "ECOMMERCE",
      status: "IN_TRANSIT",
      events: [
        { status: "CREATED", location: "Antwerp, Belgium", description: "Parcel received at facility", ts: daysAgo(2) },
        { status: "IN_TRANSIT", location: "London Heathrow, UK", description: "Arrived at destination hub", ts: daysAgo(1) },
      ],
    },
    {
      code: code(),
      recipient: "Sofia Rossi",
      destination: "Milan, Italy",
      service: "MAIL",
      status: "CUSTOMS",
      events: [
        { status: "CREATED", location: "Machelen, Belgium", description: "Mail consignment registered", ts: daysAgo(3) },
        { status: "IN_TRANSIT", location: "Brussels, Belgium", description: "In transit to destination country", ts: daysAgo(2) },
        { status: "CUSTOMS", location: "Milan, Italy", description: "Held in customs for inspection", ts: daysAgo(0, -6) },
      ],
    },
  ];

  const clientEmail = process.env.CLIENT_EMAIL || "client@shop.com";
  const clientHash = await bcrypt.hash(process.env.CLIENT_PASSWORD || "client123", 10);
  const client = await prisma.user.create({
    data: { email: clientEmail, password: clientHash, name: "Notino EU", role: "CLIENT" },
  });
  console.log(`Client portal: ${clientEmail} / ${process.env.CLIENT_PASSWORD || "client123"}`);

  for (const p of parcels) {
    await prisma.parcel.create({
      data: {
        trackingCode: p.code,
        recipient: p.recipient,
        destination: p.destination,
        service: p.service,
        status: p.status,
        ownerId: client.id,
        events: {
          create: p.events.map((e) => ({
            status: e.status,
            location: e.location,
            description: e.description,
            timestamp: e.ts,
          })),
        },
      },
    });
    console.log(`Parcel ${p.code} → ${p.recipient} (${p.status})`);
  }

  console.log("Seed done.");
  console.log(`Admin: ${email}`);
  if (!process.env.ADMIN_PASSWORD_HASH) console.log(`Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
