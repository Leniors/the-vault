import { Client, Account, Databases, Teams } from "node-appwrite";

const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!); // Must be set in .env

const account = new Account(serverClient);
const databases = new Databases(serverClient);
const teams = new Teams(serverClient);

export { serverClient, account, databases, teams };
