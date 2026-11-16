import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  obterEstadoCompleto,
  convidarFornecedor,
  avaliarDocumentoFornecedor,
  decidirHomologacao,
  criarNovaCotacao,
  adjudicarCotacao,
  responderAssistenteFornecedores,
} from '../src/services/gestaoFornecedores/servico.js'

describe('Gestão de Fornecedores, Homologação e Cotações (Plurix Hub)', () => {
  it('calcula os KPIs e alertas acionáveis da Plurix consolidada e por investida', () => {
    const estadoPlx = obterEstadoCompleto('PLX')
    assert.ok(estadoPlx.kpis.fornecedoresTotal >= 12)
    assert.ok(estadoPlx.kpis.cotacoesAbertas >= 4)
    assert.ok(estadoPlx.alertasAtencao.length > 0)

    const estadoAmg = obterEstadoCompleto('AMG')
    assert.ok(estadoAmg.fornecedores.length > 0)
  })

  it('convida novo fornecedor e gera processo de homologação na fila', () => {
    const res = convidarFornecedor({
      razaoSocial: 'SulFrio Refrigeração Comercial Ltda.',
      nomeFantasia: 'SulFrio',
      cnpj: '12.345.678/0001-99',
      email: 'contato@sulfrio.com.br',
      contatoNome: 'Carlos Sul',
      categoria: 'Facilities',
      subcategoria: 'Manutenção e Climatização',
      cidade: 'Curitiba',
      uf: 'PR',
      investidasAlvo: ['AMG', 'PRN'],
      usuario: 'Davi Bigotto',
    })
    assert.equal(res.fornecedor.statusHomologacao, 'Convidado')
    assert.equal(res.homologacao.status, 'aguardando_analise')
  })

  it('avalia documentos individuais e decide homologação com rastreabilidade', () => {
    const forn = avaliarDocumentoFornecedor({
      fornecedorId: 'FOR-004',
      docId: 'd-405',
      acao: 'aprovar',
      observacao: 'CRF/FGTS conferido na Caixa.',
      usuario: 'Fernanda Ribeiro',
    })
    const doc = forn.documentos.find(d => d.id === 'd-405')
    assert.equal(doc?.status, 'valido')

    const dec = decidirHomologacao({
      homologacaoId: 'HOM-2026-041',
      decisao: 'aprovar',
      parecer: 'Documentação 100% regular para SPO.',
      investidasAprovadas: ['SPO'],
      usuario: 'Fernanda Ribeiro',
    })
    assert.equal(dec.homologacao.status, 'aprovada')
    assert.equal(dec.fornecedor?.statusHomologacao, 'Homologado')
  })

  it('cria nova cotação (RFQ) e adjudica vencedor no mapa comparativo', () => {
    const nova = criarNovaCotacao({
      titulo: 'Aquisição de Pallets PBR para CDs',
      descricao: 'Lote semestral de reposição logística',
      categoria: 'Logística',
      subcategoria: 'Fretes e Transporte',
      investida: 'BOA',
      comprador: 'Ricardo Almeida',
      prazo: '29/11/2026 18:00',
      condicoesSolicitadas: {
        pagamentoPadrao: '45 DDL',
        tipoFretePreferencial: 'CIF CD Jundiaí',
        localEntrega: 'CD Jundiaí SP',
        impostosRegra: 'Inclusos',
        validadeMinimaDias: 30,
        observacoesGerais: 'Madeira tratada com selo ABNT.',
      },
      itens: [
        { codigo: 'PAL-01', descricao: 'Pallet PBR1 Madeira Eucalipto', quantidade: 500, unidade: 'UN', especificacao: 'Norma ABNT', precoReferenciaUnit: 58 },
      ],
      fornecedorIds: ['FOR-009', 'FOR-002'],
    })
    assert.ok(nova.id.startsWith('COT-'))
    assert.equal(nova.status, 'Aberta')

    const adj = adjudicarCotacao({
      cotacaoId: 'COT-0142',
      modo: 'lote',
      vencedorLoteFornecedorId: 'FOR-003',
      vencedoresPorItem: {},
      justificativaDecisao: 'Menor preço global completo com frete CIF e certidões 100% regulares.',
      encerrarCotacao: false,
      usuario: 'Davi Bigotto',
    })
    assert.equal(adj.adjudicacao.vencedorLoteFornecedorId, 'FOR-003')
  })

  it('responde consultas do assistente com números reais da base', () => {
    const r = responderAssistenteFornecedores('Qual a diferença entre as propostas da COT-0142?')
    assert.ok(r.resposta.includes('COT-0142'))
    assert.equal(r.proximas.length, 3)
  })
})

