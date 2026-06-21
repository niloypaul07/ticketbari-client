import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder("ipv4first");

const globalForMongo = globalThis;
const mongoUri = process.env.MONGODB_URI || "";
const client =
  globalForMongo._mongoClient ??
  new MongoClient(mongoUri, { family: 4, serverSelectionTimeoutMS: 30000 });
if (!globalForMongo._mongoClient) globalForMongo._mongoClient = client;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,

  database: mongodbAdapter(client.db("ticketbari")),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      enabled: Boolean(
        process.env.GOOGLE_CLIENT_ID &&
          process.env.GOOGLE_CLIENT_ID !== "your_google_client_id"
      ),
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        input: false,
      },
      isFraud: {
        type: "boolean",
        defaultValue: false,
        required: false,
        input: false,
      },
    },
  },

  trustedOrigins: (process.env.CLIENT_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
    .concat([process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL].filter(Boolean)),
});
