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
  updateUserProfile,
  getStats,
  listActivityLogs,
  createActivityLog,
  listNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  listAllUsers,
  deleteUser,
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

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        currentPassword: z.string().optional(),
        newPassword: z.string().min(6).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUserById(ctx.userId);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      if (user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o admin pode alterar credenciais" });
      }
      if (input.newPassword && input.currentPassword) {
        const valid = await verifyPassword(input.currentPassword, user.password);
        if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Senha atual incorreta" });
      }
      await updateUserProfile(ctx.userId, {
        name: input.name,
        email: input.email,
        password: input.newPassword,
      });
      await createActivityLog(ctx.userId, "Perfil atualizado", "Dados do perfil foram alterados");
      const updated = await getUserById(ctx.userId);
      return { id: updated!.id, email: updated!.email, name: updated!.name, role: updated!.role };
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
      const result = await createApp(ctx.userId, input);
      await createActivityLog(ctx.userId, "App criado", `App "${input.name}" foi criado`);
      await createNotification(ctx.userId, "App Criado", `O app "${input.name}" foi criado com sucesso!`, "success");
      return result;
    }),

  update: protectedProcedure
    .input(updateAppSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await updateApp(ctx.userId, input);
      await createActivityLog(ctx.userId, "App atualizado", `App "${input.name}" foi atualizado`);
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await createActivityLog(ctx.userId, "App deletado", `App #${input.id} foi deletado`);
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

const statsRouter = t.router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return getStats(ctx.userId);
  }),
});

const activityRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return listActivityLogs(ctx.userId);
  }),
});

const notificationsRouter = t.router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return listNotifications(ctx.userId);
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await markNotificationRead(ctx.userId, input.id);
      return { success: true };
    }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await markAllNotificationsRead(ctx.userId);
    return { success: true };
  }),
});

const adminRouter = t.router({
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUserById(ctx.userId);
    if (!user || user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao admin" });
    }
    return listAllUsers();
  }),

  createUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await getUserById(ctx.userId);
      if (!user || user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao admin" });
      }
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Email já cadastrado" });
      }
      const result = await registerUser(input.email, input.password, input.name);
      await createActivityLog(ctx.userId, "Usuário criado", `Novo usuário "${input.name}" (${input.email}) criado`);
      return result;
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = await getUserById(ctx.userId);
      if (!user || user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao admin" });
      }
      if (input.id === ctx.userId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Não pode deletar a si mesmo" });
      }
      await createActivityLog(ctx.userId, "Usuário deletado", `Usuário #${input.id} foi removido`);
      return deleteUser(input.id);
    }),
});

export const appRouter = t.router({
  auth: authRouter,
  apps: appsRouter,
  clients: clientsRouter,
  tracking: trackingRouter,
  stats: statsRouter,
  activity: activityRouter,
  notifications: notificationsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
