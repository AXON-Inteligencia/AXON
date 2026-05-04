import { eq } from "drizzle-orm";
import { getDb, persistDb, users, apps, clients, trackingConfigs } from "../drizzle/schema.ts";
import bcrypt from "bcryptjs";
import type {
  CreateAppInput,
  UpdateAppInput,
  CreateClientInput,
  TrackingConfigInput,
} from "@shared/schema.ts";

export async function initializeDb() {
  const db = await getDb();

  const sqliteDb = (db as any).session?.client;
  if (sqliteDb?.run) {
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL DEFAULT '',
        role TEXT NOT NULL DEFAULT 'user'
      )
    `);
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS apps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        logo_url TEXT NOT NULL DEFAULT '',
        short_description TEXT NOT NULL DEFAULT '',
        apk_link TEXT NOT NULL DEFAULT '',
        about_app TEXT NOT NULL DEFAULT '',
        images TEXT NOT NULL DEFAULT '[]',
        site_url TEXT NOT NULL DEFAULT '',
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `);
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        order_number TEXT NOT NULL,
        address TEXT NOT NULL DEFAULT '',
        product TEXT NOT NULL DEFAULT '',
        tracking_link TEXT NOT NULL DEFAULT '',
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT ''
      )
    `);
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS tracking_configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL DEFAULT 'Frete Transportadora',
        button_text TEXT NOT NULL DEFAULT 'Liberamento de Pedido',
        pix_value TEXT NOT NULL DEFAULT '4,99',
        pix_key TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL DEFAULT 'Aguardando pagamento de taxa de liberação.',
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `);
    persistDb();
  }

  const existingUsers = db.select().from(users).all();
  if (existingUsers.length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    db.insert(users)
      .values({
        email: "admin@dashboard.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      })
      .run();
    persistDb();
  }
}

export async function findUserByEmail(email: string) {
  const db = await getDb();
  const result = db.select().from(users).where(eq(users.email, email)).all();
  return result[0] ?? null;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function getUserById(id: number) {
  const db = await getDb();
  const result = db.select().from(users).where(eq(users.id, id)).all();
  return result[0] ?? null;
}

export async function listApps(userId: number) {
  const db = await getDb();
  return db.select().from(apps).where(eq(apps.userId, userId)).all();
}

export async function createApp(userId: number, data: CreateAppInput) {
  const db = await getDb();
  const result = db
    .insert(apps)
    .values({
      name: data.name,
      logoUrl: data.logoUrl ?? "",
      shortDescription: data.shortDescription ?? "",
      apkLink: data.apkLink ?? "",
      aboutApp: data.aboutApp ?? "",
      images: JSON.stringify(data.images ?? []),
      siteUrl: data.siteUrl ?? "",
      userId,
    })
    .run();
  persistDb();
  return { id: Number(result.lastInsertRowid) };
}

export async function updateApp(userId: number, data: UpdateAppInput) {
  const db = await getDb();
  db.update(apps)
    .set({
      name: data.name,
      logoUrl: data.logoUrl ?? "",
      shortDescription: data.shortDescription ?? "",
      apkLink: data.apkLink ?? "",
      aboutApp: data.aboutApp ?? "",
      images: JSON.stringify(data.images ?? []),
      siteUrl: data.siteUrl ?? "",
    })
    .where(eq(apps.id, data.id))
    .run();
  persistDb();
  return { id: data.id };
}

export async function deleteApp(userId: number, appId: number) {
  const db = await getDb();
  db.delete(apps).where(eq(apps.id, appId)).run();
  persistDb();
  return { success: true };
}

export async function listClients(userId: number) {
  const db = await getDb();
  return db.select().from(clients).where(eq(clients.userId, userId)).all();
}

export async function createClient(userId: number, data: CreateClientInput) {
  const db = await getDb();
  const result = db
    .insert(clients)
    .values({
      name: data.name,
      orderNumber: data.orderNumber,
      address: data.address ?? "",
      product: data.product ?? "",
      trackingLink: data.trackingLink ?? "",
      userId,
    })
    .run();
  persistDb();
  return { id: Number(result.lastInsertRowid) };
}

export async function deleteClient(userId: number, clientId: number) {
  const db = await getDb();
  db.delete(clients).where(eq(clients.id, clientId)).run();
  persistDb();
  return { success: true };
}

export async function getTrackingConfig(userId: number) {
  const db = await getDb();
  const result = db
    .select()
    .from(trackingConfigs)
    .where(eq(trackingConfigs.userId, userId))
    .all();
  return result[0] ?? null;
}

export async function upsertTrackingConfig(userId: number, data: TrackingConfigInput) {
  const db = await getDb();
  const existing = await getTrackingConfig(userId);
  if (existing) {
    db.update(trackingConfigs)
      .set({
        title: data.title ?? existing.title,
        buttonText: data.buttonText ?? existing.buttonText,
        pixValue: data.pixValue ?? existing.pixValue,
        pixKey: data.pixKey ?? existing.pixKey,
        message: data.message ?? existing.message,
      })
      .where(eq(trackingConfigs.id, existing.id))
      .run();
    persistDb();
    return { id: existing.id };
  } else {
    const result = db
      .insert(trackingConfigs)
      .values({
        title: data.title ?? "Frete Transportadora",
        buttonText: data.buttonText ?? "Liberamento de Pedido",
        pixValue: data.pixValue ?? "4,99",
        pixKey: data.pixKey ?? "",
        message: data.message ?? "Aguardando pagamento de taxa de liberação.",
        userId,
      })
      .run();
    persistDb();
    return { id: Number(result.lastInsertRowid) };
  }
}

export async function registerUser(email: string, password: string, name: string) {
  const db = await getDb();
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = db
    .insert(users)
    .values({ email, password: hashedPassword, name, role: "user" })
    .run();
  persistDb();
  return { id: Number(result.lastInsertRowid) };
}
