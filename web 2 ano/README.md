# Alimenta+

> **Conectando alimentos a quem precisa.** Transformando desperdício em esperança através da tecnologia.

Plataforma tecnológica inovadora para combater a insegurança alimentar, reduzir o desperdício de alimentos e conectar doadores a pessoas que necessitam de ajuda.

![Alimenta+](https://img.shields.io/badge/Alimenta+-Sustentabilidade-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

---

## Sobre o Projeto

O **Alimenta+** utiliza geolocalização, inteligência artificial, gamificação e análise de dados para:

- Conectar doadores (mercados, restaurantes, padarias) a famílias e ONGs
- Reduzir o desperdício de alimentos próprios para consumo
- Priorizar doações urgentes com a **Food Rescue AI**
- Gamificar a solidariedade com pontos e certificados digitais
- Demonstrar impacto social em tempo real

Desenvolvido para apresentação em **Feira de Ciências**, simulando uma startup pronta para lançamento.

---

## Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React, TypeScript, Tailwind CSS, Framer Motion, React Router, React Query, Recharts, Leaflet |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Banco** | PostgreSQL |
| **Auth** | JWT, bcrypt |
| **Outros** | Multer (upload), Docker Compose |

---

## Funcionalidades

### Usuários
- Doador, ONG, Família Beneficiária, Voluntário, Administrador

### Core
- Cadastro, login, recuperação de senha, verificação de e-mail
- Cadastro de doações com foto, categoria, validade e geolocalização
- Mapa interativo com filtros e busca por proximidade
- Fluxo completo: solicitar → aprovar → agendar → entregar
- Sistema de voluntários com histórico e avaliações

### Food Rescue AI
- Classificação de urgência (Alta/Média/Baixa)
- Priorização inteligente por proximidade
- Sugestão de rotas de entrega
- Previsão de desperdício e alertas automáticos

### Gamificação
- Pontuação Solidária (Semente → Broto → Árvore → Floresta Solidária)
- Conquistas e certificados digitais
- Ranking solidário

### Impacto Social
- Dashboard com métricas em tempo real
- Calculadora de impacto social
- Projeção para São José do Rio Preto
- Gráficos e relatórios

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (para PostgreSQL)
- npm ou yarn

---

## Instalação

### 1. Clone e entre no projeto

```bash
cd "web 2 ano"
```

### 2. Inicie o PostgreSQL

```bash
docker-compose up -d
```

### 3. Configure o Backend

```bash
cd backend
npm install
npm run db:setup
npm run dev
```

O backend estará em `http://localhost:3333`

### 4. Configure o Frontend

```bash
cd ../frontend
npm install
npm run dev
```

O frontend estará em `http://localhost:5173`

---

## Contas de Demonstração

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Administrador | admin@alimenta.com | 123456 |
| Doador | bompreco@alimenta.com | 123456 |
| ONG | ong@alimenta.com | 123456 |
| Família | familia.silva@alimenta.com | 123456 |
| Voluntário | carlos@alimenta.com | 123456 |

---

## Dados Demonstrativos

O sistema vem populado com:

- **2.847 kg** de alimentos salvos
- **1.324** famílias beneficiadas
- **8.542** refeições geradas
- **412** voluntários ativos
- **327** estabelecimentos parceiros
- 12 doações ativas em São José do Rio Preto

---

## Estrutura do Projeto

```
alimenta-plus/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Modelos do banco
│   │   └── seed.ts          # Dados demonstrativos
│   └── src/
│       ├── controllers/     # Lógica das rotas
│       ├── middleware/      # Auth, upload
│       ├── routes/          # Rotas REST
│       ├── services/        # IA, gamificação
│       └── index.ts         # Entry point
├── frontend/
│   └── src/
│       ├── components/      # UI reutilizável
│       ├── pages/           # Páginas da aplicação
│       ├── services/        # API client
│       ├── context/         # Auth context
│       └── types/           # TypeScript types
├── docker-compose.yml
└── README.md
```

---

## API REST

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login |
| GET | `/api/donations` | Listar doações |
| POST | `/api/donations` | Criar doação |
| GET | `/api/analytics/dashboard` | Dashboard |
| GET | `/api/analytics/ranking` | Ranking |
| GET | `/api/analytics/ai/insights` | Food Rescue AI |
| POST | `/api/analytics/calculator` | Calculadora de impacto |

Documentação completa disponível em `/api/health`.

---

## Páginas

- `/` — Landing Page
- `/login` — Login
- `/cadastro` — Cadastro
- `/dashboard` — Dashboard
- `/doacoes/nova` — Nova Doação
- `/doacoes` — Lista de Doações
- `/doacoes/:id` — Detalhes
- `/mapa` — Mapa Interativo
- `/ranking` — Ranking Solidário
- `/perfil` — Perfil
- `/impacto` — Impacto Social
- `/ia` — Food Rescue AI
- `/voluntarios` — Voluntários
- `/estatisticas` — Estatísticas
- `/admin` — Painel Admin

---

## Feira de Ciências

### Destaques para apresentação

1. **Impacto em Tempo Real** — Projeção para São José do Rio Preto
2. **Calculadora de Impacto** — Interativa na landing e dashboard
3. **Food Rescue AI** — Demonstração de IA classificando urgência
4. **Mapa ao vivo** — Doações geolocalizadas
5. **Gamificação** — Ranking e conquistas

---

## Licença

Projeto educacional desenvolvido para Feira de Ciências 2026.

---

<p align="center">
  <strong>Alimenta+</strong> — Tecnologia a favor da vida. 🌱
</p>
