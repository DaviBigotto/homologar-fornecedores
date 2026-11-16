# Plurix — Procurement 360

Plataforma corporativa de **Gestão de Fornecedores, Homologação e Cotações (RFQ)** desenvolvida para a **Plurix**.

---

## 🎯 Principais Funcionalidades

- **Cockpit Operacional (Início):** KPIs acionáveis em tempo real (fornecedores ativos, homologações aguardando/em análise, certidões vencidas, cotações abertas e prazos críticos de 48h).
- **Base de Fornecedores 360°:** Visão consolidada com filtros por razão social, CNPJ, categoria, investida, status de homologação e elegibilidade comercial.
- **Fila e Análise de Homologação:** Avaliação individual de documentos societários e certidões (CND Federal, CNDT, CRF/FGTS, Alv家に) com checklist visual e parecer rastreável.
- **Módulo de Cotações (RFQ):** Wizard guiado de criação, equalização de propostas lado a lado e mapa comparativo por item ou lote global.
- **Configurações Centralizadas:** Gestão de Investidas/Empresas, Categorias de Compras, Tipos de Documentos, Regras de Homologação e Usuários.
- **Portal do Fornecedor Integrado:** Acesso seguro para envio de certidões, preenchimento cadastral e resposta às cotações.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+

### Instalação e Execução Local
```bash
# Instalar dependências
npm install

# Iniciar servidor em desenvolvimento
npm run dev

# Ou iniciar em produção local
npm start
```
Acesse no navegador: `http://localhost:3000/gestao-fornecedores` (ou `http://localhost:3000/`)

### Testes Automatizados e Tipagem
```bash
# Executar testes unitários e de integração
npm test

# Verificação estática de tipos
npm run typecheck
```

---

## ☁️ Deploy na Vercel

O projeto já conta com [vercel.json](file:///vercel.json) configurado para Serverless Functions e assets estáticos:
1. Conecte este repositório no dashboard da [Vercel](https://vercel.com).
2. O framework preset é detectado automaticamente ou selecione **Other**.
3. Clique em **Deploy**.

