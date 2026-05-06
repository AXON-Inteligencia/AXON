import initSqlJs from "sql.js";
import { drizzle } from "drizzle-orm/sql-js";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import fs from "node:fs";
import path from "node:path";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull().default(""),
  role: text("role").notNull().default("user"),
});

export const apps = sqliteTable("apps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  apkLink: text("apk_link").notNull().default(""),
  aboutApp: text("about_app").notNull().default(""),
  images: text("images").notNull().default("[]"),
  siteUrl: text("site_url").notNull().default(""),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  orderNumber: text("order_number").notNull(),
  address: text("address").notNull().default(""),
  product: text("product").notNull().default(""),
  trackingLink: text("tracking_link").notNull().default(""),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const trackingConfigs = sqliteTable("tracking_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull().default("Frete Transportadora"),
  buttonText: text("button_text").notNull().default("Liberamento de Pedido"),
  pixValue: text("pix_value").notNull().default("4,99"),
  pixKey: text("pix_key").notNull().default(""),
  message: text("message")
    .notNull()
    .default("Aguardando pagamento de taxa de liberação."),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  details: text("details").notNull().default(""),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  read: integer("read").notNull().default(0),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

const DB_PATH = path.resolve("dashboard.db");

let sqliteDb: any;

function loadDatabase() {
  const SQL = (initSqlJs as any).default ?? initSqlJs;
  return SQL().then((SqlJs: any) => {
    let database: any;
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      database = new SqlJs.Database(fileBuffer);
    } else {
      database = new SqlJs.Database();
    }
    return database;
  });
}

function saveDatabase() {
  if (sqliteDb) {
    const data = sqliteDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

let db: any;

export async function getDb() {
  if (!db) {
    sqliteDb = await loadDatabase();
    db = drizzle(sqliteDb, {
      schema: { users, apps, clients, trackingConfigs, activityLogs, notifications },
    });
  }
  return db;
}

export function persistDb() {
  saveDatabase();
}

export { db };
