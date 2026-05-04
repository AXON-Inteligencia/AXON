import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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

const sqlite = new Database("dashboard.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, {
  schema: { users, apps, clients, trackingConfigs },
});
