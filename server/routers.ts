import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import superjson from "superjson";
import {
  loginSchema,
  createAppSchema,
  updateAppSchema,
  createClientSchema,
  trackingConfigSchema,
} from "@shared/schema.ts";
import {
  findUserByEmail,
  verifyPassword,
  getUserById,
  listApps,
  createApp,
  updateApp,
  deleteApp,
  listClients,
  createClient,
  deleteClient,
  getTrackingConfig,
  upsertTrackingConfig,
  registerUser,
  getAppById,
  getClientByOrderNumber,
  getTrackingConfigByUserId,
} from "./db.ts";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dashboard-secret-key-change-in-production"
);

export interface Context {
  userId: number | null;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export async function createToken(userId: number): Promise<string> {
  return new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as number };
  } catch {
    return null;
  }
}

const authRouter = t.router({
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    const user = await findUserByEmail(input.email);
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Email ou senha incorretos",
      });
    }
    const valid = await verifyPassword(input.password, user.password);
    if (!valid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Email ou senha incorretos",
      });
    }
    const token = await createToken(user.id);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }),

  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email já cadastrado",
        });
      }
      const { id } = await registerUser(input.email, input.password, input.name);
      const token = await createToken(id);
      return {
        token,
        user: { id, email: input.email, name: input.name, role: "user" },
      };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUserById(ctx.userId);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }),

  logout: protectedProcedure.mutation(async () => {
    return { success: true };
  }),
});

const appsRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const rawApps = await listApps(ctx.userId);
    return rawApps.map((app: any) => ({
      ...app,
      images: JSON.parse(app.images) as string[],
    }));
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const app = await getAppById(input.id);
      if (!app) return null;
      return {
        ...app,
        images: JSON.parse(app.images) as string[],
      };
    }),

  create: protectedProcedure
    .input(createAppSchema)
    .mutation(async ({ ctx, input }) => {
      return createApp(ctx.userId, input);
    }),

  update: protectedProcedure
    .input(updateAppSchema)
    .mutation(async ({ ctx, input }) => {
      return updateApp(ctx.userId, input);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return deleteApp(ctx.userId, input.id);
    }),
});

const clientsRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return listClients(ctx.userId);
  }),

  getByOrderNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const client = await getClientByOrderNumber(input.orderNumber);
      if (!client) return null;
      return client;
    }),

  create: protectedProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      return createClient(ctx.userId, input);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return deleteClient(ctx.userId, input.id);
    }),
});

const trackingRouter = t.router({
  getConfig: protectedProcedure.query(async ({ ctx }) => {
    return getTrackingConfig(ctx.userId);
  }),

  getPublicConfig: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return getTrackingConfigByUserId(input.userId);
    }),

  saveConfig: protectedProcedure
    .input(trackingConfigSchema)
    .mutation(async ({ ctx, input }) => {
      return upsertTrackingConfig(ctx.userId, input);
    }),
});

export const appRouter = t.router({
  auth: authRouter,
  apps: appsRouter,
  clients: clientsRouter,
  tracking: trackingRouter,
});

export type AppRouter = typeof appRouter;
