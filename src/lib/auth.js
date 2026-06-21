import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const globalForAuth = globalThis;

function createAuth() {
  const mongoUri = process.env.MONGODB_URI;
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not set");
  }

  const client =
    globalForAuth._mongoClient ??
    new MongoClient(mongoUri, { serverSelectionTimeoutMS: 30000 });
  if (!globalForAuth._mongoClient) globalForAuth._mongoClient = client;

  const baseURL =
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const trustedOrigins = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
    .concat([process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL].filter(Boolean));

  return betterAuth({
    secret,
    baseURL,
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
    trustedOrigins,
  });
}

export function getAuth() {
  if (!globalForAuth._betterAuth) {
    globalForAuth._betterAuth = createAuth();
  }
  return globalForAuth._betterAuth;
}
