import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  obterEstadoCompleto,
  convidarFornecedor,
  avaliarDocumentoFornecedor,
  decidirHomologacao,
  criarNovaCotacao,
  adjudicarCotacao,
  salvarConfiguracao,
} from './services/gestaoFornecedores/servico.js'

export interface OpcoesRouterFornecedores {
  getUser?: (req: express.Request) => string | null
}

function resolverCaminhoHtml(): string {
  const candidatos = [
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'views/pages/gestao_fornecedores.html'),
    path.resolve(process.cwd(), 'src/views/pages/gestao_fornecedores.html'),
    path.resolve(process.cwd(), 'public/index.html'),
  ]
  for (const c of candidatos) {
    if (fs.existsSync(c)) return c
  }
  return candidatos[1]
}

export function createGestaoFornecedoresRouter(opcoes: OpcoesRouterFornecedores = {}): express.Router {
  const router = express.Router()
  router.use(express.json({ limit: '5mb' }))

  const caminhoHtml = resolverCaminhoHtml()

  router.get('/', (_req, res) => {
    const html = fs.readFileSync(caminhoHtml, 'utf-8')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(html)
  })

  router.get('/api/estado', (req, res) => {
    try {
      const investida = typeof req.query.investida === 'string' ? req.query.investida : undefined
      const dados = obterEstadoCompleto(investida)
      res.json({ success: true, data: dados })
    } catch {
      res.status(500).json({ success: false, error: 'Erro ao carregar os dados de fornecedores e cotações.' })
    }
  })

  router.post('/api/fornecedores/convidar', (req, res) => {
    try {
      const { razaoSocial, cnpj, email } = req.body || {}
      if (!razaoSocial || !cnpj || !email) {
        res.status(400).json({ success: false, error: 'Campos obrigatórios não informados (Razão social, CNPJ e E-mail).' })
        return
      }
      const user = opcoes.getUser?.(req) || 'Davi Bigotto'
      const resultado = convidarFornecedor({ ...req.body, usuario: user })
      res.json({ success: true, data: resultado })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message || 'Erro ao convidar fornecedor.' })
    }
  })

  router.post('/api/documentos/avaliar', (req, res) => {
    try {
      const { fornecedorId, docId, acao, observacao } = req.body || {}
      if (!fornecedorId || !docId || !acao) {
        res.status(400).json({ success: false, error: 'Campos obrigatórios não informados para avaliação do documento.' })
        return
      }
      const user = opcoes.getUser?.(req) || 'Fernanda Ribeiro'
      const forn = avaliarDocumentoFornecedor({ fornecedorId, docId, acao, observacao, usuario: user })
      res.json({ success: true, data: forn })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message || 'Erro ao avaliar documento.' })
    }
  })

  router.post('/api/homologacoes/decidir', (req, res) => {
    try {
      const { homologacaoId, decisao, parecer, investidasAprovadas } = req.body || {}
      if (!homologacaoId || !decisao) {
        res.status(400).json({ success: false, error: 'Informe a homologação e a decisão.' })
        return
      }
      const user = opcoes.getUser?.(req) || 'Fernanda Ribeiro'
      const resultado = decidirHomologacao({
        homologacaoId,
        decisao,
        parecer: parecer || '',
        investidasAprovadas,
        usuario: user,
      })
      res.json({ success: true, data: resultado })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message || 'Erro ao registrar decisão da homologação.' })
    }
  })

  router.post('/api/cotacoes/criar', (req, res) => {
    try {
      const { titulo, categoria, investida, itens } = req.body || {}
      if (!titulo || !categoria || !Array.isArray(itens) || itens.length === 0) {
        res.status(400).json({ success: false, error: 'Informe título, categoria e pelo menos 1 item para a cotação.' })
        return
      }
      const nova = criarNovaCotacao({
        titulo,
        descricao: req.body.descricao || '',
        categoria,
        subcategoria: req.body.subcategoria || 'Geral',
        investida: investida || 'PLX',
        comprador: req.body.comprador || 'Davi Bigotto',
        prazo: req.body.prazo || '26/11/2026 18:00',
        condicoesSolicitadas: req.body.condicoesSolicitadas || {
          pagamentoPadrao: '45 DDL',
          tipoFretePreferencial: 'CIF incluso',
          localEntrega: 'CDs Plurix',
          impostosRegra: 'Impostos inclusos',
          validadeMinimaDias: 30,
          observacoesGerais: '',
        },
        itens,
        fornecedorIds: Array.isArray(req.body.fornecedorIds) ? req.body.fornecedorIds : [],
        rascunho: Boolean(req.body.rascunho),
      })
      res.json({ success: true, data: nova })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message || 'Erro ao criar cotação.' })
    }
  })

  router.post('/api/cotacoes/adjudicar', (req, res) => {
    try {
      const { cotacaoId, modo, vencedorLoteFornecedorId, vencedoresPorItem, justificativaDecisao, encerrarCotacao } = req.body || {}
      if (!cotacaoId || !modo) {
        res.status(400).json({ success: false, error: 'Informe a cotação e o modo de seleção.' })
        return
      }
      const user = opcoes.getUser?.(req) || 'Davi Bigotto'
      const cot = adjudicarCotacao({
        cotacaoId,
        modo,
        vencedorLoteFornecedorId: vencedorLoteFornecedorId || null,
        vencedoresPorItem: vencedoresPorItem || {},
        justificativaDecisao: justificativaDecisao || '',
        encerrarCotacao: Boolean(encerrarCotacao),
        usuario: user,
      })
      res.json({ success: true, data: cot })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message || 'Erro ao adjudicar cotação.' })
    }
  })

  router.post('/api/configuracoes/salvar', (req, res) => {
    try {
      const { tipo, payload } = req.body || {}
      if (!tipo || !payload) {
        res.status(400).json({ success: false, error: 'Informe o tipo de configuração e os dados.' })
        return
      }
      const estado = salvarConfiguracao({ tipo, payload })
      res.json({ success: true, data: estado })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message || 'Erro ao salvar configuração.' })
    }
  })

  return router
}
