# Dashboard Multi App — Conexao Gangsta

Dashboard de gerenciamento de aplicativos com design cyberpunk neon. Construida com React 19, Express, tRPC e SQLite.

## Funcionalidades

- **Login** com email/senha e autenticacao JWT
- **Dashboard** com cards circulares de apps (criar, deletar, abrir site)
- **Criar/Editar Play Store** — modal com logotipo, nome, descricao, link APK, carrossel de imagens
- **Painel Transportadora** — cadastro de clientes, geracao de ordem de pedido, link de rastreio, configuracoes de rastreamento com preview ao vivo
- **Encurtador de Link** — atalho para encurtar links
- **Design cyberpunk neon** — tema escuro com acentos neon, sidebar azul, efeitos glow

## Inicio Rapido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor estara disponivel em `http://localhost:3000`

**Credenciais padrao:**
- Email: `admin@dashboard.com`
- Senha: `admin123`

## Scripts

- `npm run dev` — Servidor de desenvolvimento
- `npm run build` — Build para producao
- `npm start` — Iniciar producao
- `npm run check` — Verificacao TypeScript

## Estrutura

```
├── client/           # Frontend React
│   ├── src/
│   │   ├── pages/    # LoginPage, Dashboard
│   │   ├── components/  # Sidebar, AppCards, CreateAppModal, TransportPanel, LinkShortener
│   │   ├── lib/      # tRPC client, utils
│   │   └── index.css # Estilos globais cyberpunk
├── server/           # Backend Express + tRPC
│   ├── _core/        # Server entry point
│   ├── routers.ts    # tRPC procedures
│   └── db.ts         # Database functions
├── shared/           # Tipos compartilhados
├── drizzle/          # Schema do banco de dados
└── package.json
```

## Tecnologias

- React 19 + TypeScript
- Express 4 + tRPC 11
- SQLite (better-sqlite3) + Drizzle ORM
- Tailwind CSS 4
- Vite 6
