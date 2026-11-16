import {
  SEMENTE_GESTAO_FORNECEDORES,
  type EstadoBancoFornecedores,
  type Fornecedor,
  type ProcessoHomologacao,
  type CotacaoRFQ,
  type StatusDocumento,
  type StatusHomologacao,
  type Investida,
  type CategoriaCompras,
  type TipoDocumento,
  type UsuarioPlataforma,
} from './dados.js'
const banco: EstadoBancoFornecedores = structuredClone(SEMENTE_GESTAO_FORNECEDORES)
function agoraPtBr(): string {
  return new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
function hojePtBr(): string {
  return new Date().toLocaleDateString('pt-BR')
}
export function obterEstadoCompleto(investidaFiltro?: string) {
  const inv = investidaFiltro && investidaFiltro !== 'PLX' ? investidaFiltro : null
  const fornecedores = inv
    ? banco.fornecedores.filter(
        f => f.investidasHomologadas.includes(inv) || f.investidasHomologadas.length === 0
      )
    : banco.fornecedores
  const homologacoes = inv
    ? banco.homologacoes.filter(h => h.investida === inv || h.investida === 'PLX')
    : banco.homologacoes
  const cotacoes = inv
    ? banco.cotacoes.filter(c => c.investida === inv || c.investida === 'PLX')
    : banco.cotacoes
  // Cálculo dos KPIs operacionais do Cockpit (Home) e Indicadores
  const fornecedoresAtivos = fornecedores.filter(f => !f.bloqueado && f.statusHomologacao !== 'Reprovado').length
  const fornecedoresHomologados = fornecedores.filter(f => f.statusHomologacao === 'Homologado').length
  const pctHomologados = fornecedores.length > 0 ? Math.round((fornecedoresHomologados / fornecedores.length) * 1000) / 10 : 0
  const homologAguardando = homologacoes.filter(h => h.status === 'aguardando_analise').length
  const homologEmAnalise = homologacoes.filter(h => h.status === 'em_analise').length
  const homologComFornecedor = homologacoes.filter(h => h.status === 'com_fornecedor').length
  const homologFilaTotal = homologAguardando + homologEmAnalise + homologComFornecedor
  let docsVencidos = 0
  let docsVencendo30d = 0
  const alertasAtencao: Array<{
    id: string
    tipo: 'documento_vencido' | 'pendencia_fornecedor' | 'homologacao_parada' | 'cotacao_prazo' | 'cotacao_baixa_resposta'
    criticidade: 'bad' | 'att'
    fornecedorOuRef: string
    subtitulo: string
    detalhe: string
    investida: string
    acaoRotulo: string
    alvoModulo: string
    alvoId: string
  }> = []
  for (const f of fornecedores) {
    for (const d of f.documentos) {
      if (d.status === 'vencido' || d.status === 'rejeitado') {
        docsVencidos++
        alertasAtencao.push({
          id: `alt-doc-${f.id}-${d.id}`,
          tipo: 'documento_vencido',
          criticidade: 'bad',
          fornecedorOuRef: f.nomeFantasia,
          subtitulo: f.cnpj,
          detalhe: `${d.tipoNome} ${d.status === 'rejeitado' ? 'reprovado na análise' : `vencido há ${Math.abs(d.diasParaVencer || 3)} dias`}`,
          investida: f.investidasHomologadas[0] || 'PLX',
          acaoRotulo: 'Cobrar documento',
          alvoModulo: 'fornecedor',
          alvoId: f.id,
        })
      } else if (d.status === 'proximo_vencimento') {
        docsVencendo30d++
      }
    }
  }
  for (const h of homologacoes) {
    if ((h.status === 'aguardando_analise' || h.status === 'com_fornecedor') && h.diasNaEtapa >= 2) {
      alertasAtencao.push({
        id: `alt-hom-${h.id}`,
        tipo: h.status === 'com_fornecedor' ? 'pendencia_fornecedor' : 'homologacao_parada',
        criticidade: h.diasNaEtapa >= h.slaDias ? 'bad' : 'att',
        fornecedorOuRef: h.fornecedorNome,
        subtitulo: `${h.id} · ${h.categoria}`,
        detalhe:
          h.status === 'com_fornecedor'
            ? `Homologação devolvida ao fornecedor há ${h.diasNaEtapa} dias (${h.pendenciasAbertas} pendência aberta)`
            : `Homologação aguardando análise há ${h.diasNaEtapa} dias (SLA ${h.slaDias}d)`,
        investida: h.investida,
        acaoRotulo: 'Analisar fila',
        alvoModulo: 'homologacao',
        alvoId: h.id,
      })
    }
  }
  const cotacoesAbertasLista = cotacoes.filter(c =>
    ['Aberta', 'Recebendo propostas', 'Em análise', 'Em negociação'].includes(c.status)
  )
  const cotacoesEncerrando48h = cotacoesAbertasLista.filter(c => c.horasRestantes > 0 && c.horasRestantes <= 48).length
  let convitesTotaisAbertos = 0
  let respostasRecebidasAbertas = 0
  let fornecedoresPendentesRfq = 0
  for (const c of cotacoesAbertasLista) {
    const conv = c.fornecedoresConvidados.length
    const resp = c.fornecedoresConvidados.filter(fc => fc.respondeu).length
    convitesTotaisAbertos += conv
    respostasRecebidasAbertas += resp
    fornecedoresPendentesRfq += Math.max(0, conv - resp)
    if (c.horasRestantes > 0 && c.horasRestantes <= 48) {
      alertasAtencao.push({
        id: `alt-cot-prazo-${c.id}`,
        tipo: 'cotacao_prazo',
        criticidade: resp < 2 ? 'bad' : 'att',
        fornecedorOuRef: `${c.id} · ${c.titulo}`,
        subtitulo: `Comprador: ${c.comprador}`,
        detalhe: `Encerra em ${c.horasRestantes}h com ${resp} de ${conv} propostas recebidas`,
        investida: c.investida,
        acaoRotulo: 'Abrir cotação',
        alvoModulo: 'cotacao',
        alvoId: c.id,
      })
    } else if (conv >= 3 && resp < 2) {
      alertasAtencao.push({
        id: `alt-cot-resp-${c.id}`,
        tipo: 'cotacao_baixa_resposta',
        criticidade: 'att',
        fornecedorOuRef: `${c.id} · ${c.titulo}`,
        subtitulo: `Comprador: ${c.comprador}`,
        detalhe: `Baixa adesão até o momento: apenas ${resp} de ${conv} fornecedores responderam`,
        investida: c.investida,
        acaoRotulo: 'Cobrar propostas',
        alvoModulo: 'cotacao',
        alvoId: c.id,
      })
    }
  }
  return {
    atualizadoEm: agoraPtBr(),
    kpis: {
      fornecedoresTotal: fornecedores.length,
      fornecedoresAtivos,
      fornecedoresHomologados,
      pctHomologados,
      homologAguardando,
      homologEmAnalise,
      homologComFornecedor,
      homologFilaTotal,
      docsVencidos,
      docsVencendo30d,
      cotacoesAbertas: cotacoesAbertasLista.length,
      cotacoesEncerrando48h,
      convitesTotaisAbertos,
      respostasRecebidasAbertas,
      fornecedoresPendentesRfq,
      pendenciasCriticas: alertasAtencao.filter(a => a.criticidade === 'bad').length,
      tempoMedioHomologacaoDias: 3.4,
      slaDentroPrazoPct: 86.5,
      tempoMedioRfqDias: 6.2,
    },
    alertasAtencao,
    investidas: banco.investidas,
    categorias: banco.categorias,
    tiposDocumento: banco.tiposDocumento,
    regrasHomologacao: banco.regrasHomologacao,
    usuarios: banco.usuarios,
    fornecedores,
    homologacoes,
    cotacoes,
  }
}
export function convidarFornecedor(dados: {
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  email: string
  contatoNome: string
  telefone?: string
  categoria: string
  subcategoria: string
  cidade: string
  uf: string
  investidasAlvo: string[]
  usuario: string
}): { fornecedor: Fornecedor; homologacao: ProcessoHomologacao } {
  const seq = banco.fornecedores.length + 1
  const id = `FOR-${String(seq).padStart(3, '0')}`
  const token = `plx-portal-${id.toLowerCase()}-${Date.now().toString(36)}`
  const catObj = banco.categorias.find(c => c.nome === dados.categoria) || banco.categorias[0]
  const novoFornecedor: Fornecedor = {
    id,
    razaoSocial: dados.razaoSocial.trim(),
    nomeFantasia: (dados.nomeFantasia || dados.razaoSocial).trim(),
    cnpj: dados.cnpj.trim(),
    inscricaoEstadual: 'Em preenchimento',
    regimeTributario: 'A confirmar no Portal',
    porte: 'Médio Porte',
    categoriaId: catObj.id,
    categoria: catObj.nome,
    subcategoria: dados.subcategoria || (catObj.subcategorias[0]?.nome ?? 'Geral'),
    cidade: dados.cidade || 'São Paulo',
    uf: dados.uf || 'SP',
    endereco: 'Aguardando preenchimento no Portal do Fornecedor',
    cep: '00000-000',
    contatoComercial: {
      nome: dados.contatoNome || 'Responsável Comercial',
      email: dados.email.trim(),
      telefone: dados.telefone || '(11) 99999-0000',
      cargo: 'Comercial',
    },
    contatoFinanceiro: {
      nome: dados.contatoNome || 'Financeiro',
      email: dados.email.trim(),
      banco: 'A informar',
      agencia: '-',
      conta: '-',
      pix: dados.cnpj.trim(),
    },
    socios: ['Aguardando Contrato Social'],
    investidasHomologadas: [],
    statusHomologacao: 'Convidado',
    statusDocumental: 'Pendente envio',
    docsVencidos: 0,
    docsVencendo30d: 0,
    docsPendentes: 5,
    elegibilidade: 'Com ressalva',
    bloqueado: false,
    notaHomologacao: null,
    ultimaAtualizacao: hojePtBr(),
    portalToken: token,
    documentos: [
      { id: `d-${seq}-1`, tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '-', validade: 'Sem validade', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: 'Solicitado no convite.' },
      { id: `d-${seq}-2`, tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '-', validade: 'Sem validade', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: 'Solicitado no convite.' },
      { id: `d-${seq}-3`, tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '-', validade: '180 dias', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: 'Solicitado no convite.' },
      { id: `d-${seq}-4`, tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '-', validade: '180 dias', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: 'Solicitado no convite.' },
      { id: `d-${seq}-5`, tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '-', validade: '30 dias', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: 'Solicitado no convite.' },
    ],
    historico: [
      {
        id: `h-${Date.now()}`,
        dataHora: agoraPtBr(),
        tipo: 'convite',
        titulo: 'Convite enviado para cadastro e homologação',
        detalhe: `Link de acesso ao Portal do Fornecedor enviado para ${dados.email} (Escopo: ${(dados.investidasAlvo || ['PLX']).join(', ')}).`,
        usuario: dados.usuario || 'Davi Bigotto',
      },
    ],
  }
  banco.fornecedores.unshift(novoFornecedor)
  const novaHomolog: ProcessoHomologacao = {
    id: `HOM-2026-0${45 + banco.homologacoes.length}`,
    fornecedorId: novoFornecedor.id,
    fornecedorNome: novoFornecedor.nomeFantasia,
    razaoSocial: novoFornecedor.razaoSocial,
    cnpj: novoFornecedor.cnpj,
    investida: dados.investidasAlvo?.[0] || 'PLX',
    categoria: novoFornecedor.categoria,
    subcategoria: novoFornecedor.subcategoria,
    status: 'aguardando_analise',
    rotuloStatus: 'Aguardando análise',
    diasNaEtapa: 0,
    slaDias: catObj.slaHomologacaoDias,
    pendenciasAbertas: 5,
    listaPendencias: ['Aguardando envio inicial dos documentos obrigatórios no Portal do Fornecedor'],
    responsavel: 'Fernanda Ribeiro',
    ultimaAtualizacao: agoraPtBr(),
    observacoesAnalista: 'Fornecedor recém-convidado. Link ativo no Portal do Fornecedor.',
    checklist: [
      { id: `ck-${seq}-1`, item: 'Dados cadastrais e bancários', tipo: 'cadastro', status: 'pendente', detalhe: 'Aguardando preenchimento pelo fornecedor.' },
      { id: `ck-${seq}-2`, item: 'Cartão CNPJ', tipo: 'documento', docId: `d-${seq}-1`, status: 'pendente', detalhe: 'Pendente de envio.' },
      { id: `ck-${seq}-3`, item: 'Contrato Social', tipo: 'documento', docId: `d-${seq}-2`, status: 'pendente', detalhe: 'Pendente de envio.' },
      { id: `ck-${seq}-4`, item: 'CND Federal', tipo: 'documento', docId: `d-${seq}-3`, status: 'pendente', detalhe: 'Pendente de envio.' },
      { id: `ck-${seq}-5`, item: 'CNDT Trabalhista', tipo: 'documento', docId: `d-${seq}-4`, status: 'pendente', detalhe: 'Pendente de envio.' },
      { id: `ck-${seq}-6`, item: 'CRF/FGTS', tipo: 'documento', docId: `d-${seq}-5`, status: 'pendente', detalhe: 'Pendente de envio.' },
    ],
  }
  banco.homologacoes.unshift(novaHomolog)
  return { fornecedor: novoFornecedor, homologacao: novaHomolog }
}
export function avaliarDocumentoFornecedor(dados: {
  fornecedorId: string
  docId: string
  acao: 'aprovar' | 'reprovar' | 'pedir_correcao' | 'simular_reenvio'
  observacao?: string
  usuario: string
}) {
  const forn = banco.fornecedores.find(f => f.id === dados.fornecedorId)
  if (!forn) throw new Error('Fornecedor não localizado.')
  const doc = forn.documentos.find(d => d.id === dados.docId)
  if (!doc) throw new Error('Documento não localizado.')
  let novoStatusDoc: StatusDocumento = doc.status
  let statusChecklist: 'ok' | 'att' | 'bad' | 'pendente' = 'ok'
  let tituloHist = ''
  if (dados.acao === 'aprovar') {
    novoStatusDoc = 'valido'
    statusChecklist = 'ok'
    if (doc.emissao === '-') doc.emissao = hojePtBr()
    if (!doc.arquivo) doc.arquivo = `${doc.tipoNome.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${forn.id.toLowerCase()}.pdf`
    if (doc.diasParaVencer !== null && doc.diasParaVencer < 0) {
      doc.diasParaVencer = 180
      doc.validade = '15/05/2027'
    }
    tituloHist = `Documento aprovado: ${doc.tipoNome}`
  } else if (dados.acao === 'reprovar') {
    novoStatusDoc = 'rejeitado'
    statusChecklist = 'bad'
    tituloHist = `Documento reprovado: ${doc.tipoNome}`
  } else if (dados.acao === 'pedir_correcao') {
    novoStatusDoc = 'pendente'
    statusChecklist = 'att'
    tituloHist = `Correção solicitada ao fornecedor: ${doc.tipoNome}`
  } else if (dados.acao === 'simular_reenvio') {
    novoStatusDoc = 'em_analise'
    statusChecklist = 'pendente'
    doc.emissao = hojePtBr()
    doc.validade = doc.tipoId === 'doc-fgts' ? '16/12/2026' : '15/05/2027'
    doc.diasParaVencer = doc.tipoId === 'doc-fgts' ? 30 : 180
    doc.arquivo = `${doc.tipoNome.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_renovado_nov26.pdf`
    doc.tamanhoKb = 312
    tituloHist = `Nova versão enviada pelo fornecedor: ${doc.tipoNome}`
  }
  doc.status = novoStatusDoc
  doc.ultimaAtualizacao = hojePtBr()
  if (dados.observacao) {
    doc.observacaoAnalista = dados.observacao.trim()
  }
  // Recalcular contadores documentais do fornecedor
  forn.docsVencidos = forn.documentos.filter(d => d.status === 'vencido' || d.status === 'rejeitado').length
  forn.docsVencendo30d = forn.documentos.filter(d => d.status === 'proximo_vencimento').length
  forn.docsPendentes = forn.documentos.filter(d => d.status === 'pendente').length
  if (forn.docsVencidos > 0) forn.statusDocumental = 'Com vencidos'
  else if (forn.docsPendentes > 0) forn.statusDocumental = 'Pendente envio'
  else if (forn.documentos.some(d => d.status === 'em_analise')) forn.statusDocumental = 'Em validação'
  else if (forn.docsVencendo30d > 0) forn.statusDocumental = 'Próximo do vencimento'
  else forn.statusDocumental = 'Completo'
  forn.ultimaAtualizacao = hojePtBr()
  forn.historico.unshift({
    id: `h-${Date.now()}`,
    dataHora: agoraPtBr(),
    tipo: 'documento',
    titulo: tituloHist,
    detalhe: dados.observacao || doc.observacaoAnalista,
    usuario: dados.usuario || 'Fernanda Ribeiro',
  })
  // Sincronizar com processo de homologação correspondente
  for (const hom of banco.homologacoes.filter(h => h.fornecedorId === forn.id)) {
    const ck = hom.checklist.find(c => c.docId === doc.id || c.item.toLowerCase().includes(doc.tipoNome.toLowerCase().slice(0, 8)))
    if (ck) {
      ck.status = statusChecklist
      ck.detalhe = dados.observacao || doc.observacaoAnalista
    }
    hom.pendenciasAbertas = hom.checklist.filter(c => c.status === 'bad' || c.status === 'pendente').length
    hom.ultimaAtualizacao = agoraPtBr()
  }
  return forn
}
export function decidirHomologacao(dados: {
  homologacaoId: string
  decisao: 'aprovar' | 'reprovar' | 'devolver_fornecedor' | 'iniciar_analise'
  parecer: string
  investidasAprovadas?: string[]
  usuario: string
}) {
  const hom = banco.homologacoes.find(h => h.id === dados.homologacaoId)
  if (!hom) throw new Error('Processo de homologação não encontrado.')
  const forn = banco.fornecedores.find(f => f.id === hom.fornecedorId)
  let novoStatusHom: StatusHomologacao = hom.status
  let rotulo = hom.rotuloStatus
  let tituloEvento = ''
  if (dados.decisao === 'aprovar') {
    novoStatusHom = 'aprovada'
    rotulo = 'Homologado'
    hom.pendenciasAbertas = 0
    hom.checklist.forEach(c => {
      if (c.status === 'pendente') c.status = 'ok'
    })
    if (forn) {
      forn.statusHomologacao = 'Homologado'
      forn.elegibilidade = forn.docsVencidos > 0 ? 'Com ressalva' : 'Apto'
      forn.notaHomologacao = forn.notaHomologacao || 92
      const invs = dados.investidasAprovadas?.length ? dados.investidasAprovadas : [hom.investida]
      for (const sg of invs) {
        if (!forn.investidasHomologadas.includes(sg)) forn.investidasHomologadas.push(sg)
      }
      forn.documentos.forEach(d => {
        if (d.status === 'em_analise') d.status = 'valido'
      })
      forn.statusDocumental = forn.docsVencidos > 0 ? 'Com vencidos' : 'Completo'
    }
    tituloEvento = `Homologação ${hom.id} aprovada (${hom.investida})`
  } else if (dados.decisao === 'reprovar') {
    novoStatusHom = 'reprovada'
    rotulo = 'Reprovada'
    if (forn) {
      forn.statusHomologacao = 'Reprovado'
      forn.elegibilidade = 'Impedido'
    }
    tituloEvento = `Homologação ${hom.id} reprovada`
  } else if (dados.decisao === 'devolver_fornecedor') {
    novoStatusHom = 'com_fornecedor'
    rotulo = 'Com fornecedor'
    if (dados.parecer) {
      hom.listaPendencias.unshift(dados.parecer.trim())
      hom.pendenciasAbertas = hom.listaPendencias.length
    }
    if (forn) {
      forn.statusHomologacao = 'Pendente fornecedor'
    }
    tituloEvento = `Homologação ${hom.id} devolvida ao fornecedor com pendência`
  } else if (dados.decisao === 'iniciar_analise') {
    novoStatusHom = 'em_analise'
    rotulo = 'Em análise'
    hom.responsavel = dados.usuario || 'Fernanda Ribeiro'
    if (forn && forn.statusHomologacao === 'Aguardando análise') {
      forn.statusHomologacao = 'Em análise'
    }
    tituloEvento = `Análise técnica iniciada na homologação ${hom.id}`
  }
  hom.status = novoStatusHom
  hom.rotuloStatus = rotulo
  hom.ultimaAtualizacao = agoraPtBr()
  if (dados.parecer) {
    hom.observacoesAnalista = dados.parecer.trim()
    hom.parecerFinal = dados.parecer.trim()
  }
  if (forn) {
    forn.ultimaAtualizacao = hojePtBr()
    forn.historico.unshift({
      id: `h-${Date.now()}`,
      dataHora: agoraPtBr(),
      tipo: 'homologacao',
      titulo: tituloEvento,
      detalhe: dados.parecer || hom.observacoesAnalista,
      usuario: dados.usuario || 'Fernanda Ribeiro',
    })
  }
  return { homologacao: hom, fornecedor: forn }
}
export function criarNovaCotacao(dados: {
  titulo: string
  descricao: string
  categoria: string
  subcategoria: string
  investida: string
  comprador: string
  prazo: string
  condicoesSolicitadas: CotacaoRFQ['condicoesSolicitadas']
  itens: Array<{ codigo: string; descricao: string; quantidade: number; unidade: string; especificacao: string; precoReferenciaUnit: number }>
  fornecedorIds: string[]
  rascunho?: boolean
}): CotacaoRFQ {
  const num = 156 + banco.cotacoes.length
  const id = `COT-0${num}`
  const itensFormatados = dados.itens.map((it, idx) => ({
    id: `IT-${num}-${idx + 1}`,
    codigo: it.codigo || `SKU-${idx + 1}`,
    descricao: it.descricao,
    quantidade: Number(it.quantidade) || 1,
    unidade: it.unidade || 'UN',
    especificacao: it.especificacao || 'Conforme especificação padrão Plurix',
    precoReferenciaUnit: Number(it.precoReferenciaUnit) || 0,
  }))
  const valorEstimado = itensFormatados.reduce((acc, it) => acc + it.quantidade * it.precoReferenciaUnit, 0)
  const convidados = dados.fornecedorIds
    .map(fid => banco.fornecedores.find(f => f.id === fid))
    .filter((f): f is Fornecedor => !!f)
    .map(f => ({
      fornecedorId: f.id,
      nomeFantasia: f.nomeFantasia,
      cnpj: f.cnpj,
      statusHomologacao: f.statusHomologacao,
      docVencido: f.docsVencidos > 0,
      bloqueado: f.bloqueado,
      respondeu: false,
      statusConvite: 'Aguardando resposta' as const,
    }))
  const nova: CotacaoRFQ = {
    id,
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim(),
    categoria: dados.categoria,
    subcategoria: dados.subcategoria || 'Geral',
    investida: dados.investida || 'PLX',
    comprador: dados.comprador || 'Davi Bigotto',
    abertura: hojePtBr(),
    prazo: dados.prazo || '26/11/2026 18:00',
    horasRestantes: 168,
    status: dados.rascunho ? 'Rascunho' : 'Aberta',
    valorEstimado: valorEstimado > 0 ? valorEstimado : null,
    condicoesSolicitadas: dados.condicoesSolicitadas,
    itens: itensFormatados,
    fornecedoresConvidados: convidados,
    propostas: [],
    adjudicacao: {
      modo: 'lote',
      vencedorLoteFornecedorId: null,
      vencedoresPorItem: {},
      justificativaDecisao: '',
    },
    historico: [
      {
        id: `hc-${Date.now()}`,
        dataHora: agoraPtBr(),
        tipo: 'abertura',
        titulo: dados.rascunho ? 'Cotação salva em rascunho' : `Cotação ${id} publicada e enviada a ${convidados.length} fornecedor(es)`,
        detalhe: `Escopo: ${dados.investida} · ${itensFormatados.length} item(ns) · Prazo: ${dados.prazo}`,
        usuario: dados.comprador || 'Davi Bigotto',
      },
    ],
  }
  banco.cotacoes.unshift(nova)
  return nova
}
export function adjudicarCotacao(dados: {
  cotacaoId: string
  modo: 'item' | 'lote'
  vencedorLoteFornecedorId: string | null
  vencedoresPorItem: Record<string, string>
  justificativaDecisao: string
  encerrarCotacao: boolean
  usuario: string
}) {
  const cot = banco.cotacoes.find(c => c.id === dados.cotacaoId)
  if (!cot) throw new Error('Cotação não encontrada.')
  cot.adjudicacao = {
    modo: dados.modo,
    vencedorLoteFornecedorId: dados.vencedorLoteFornecedorId,
    vencedoresPorItem: dados.vencedoresPorItem || {},
    justificativaDecisao: dados.justificativaDecisao.trim(),
    aprovadoPor: dados.usuario || 'Davi Bigotto',
    aprovadoEm: agoraPtBr(),
  }
  if (dados.encerrarCotacao) {
    cot.status = 'Encerrada'
    cot.horasRestantes = 0
  } else if (cot.status === 'Aberta' || cot.status === 'Recebendo propostas') {
    cot.status = 'Em negociação'
  }
  cot.historico.unshift({
    id: `hc-${Date.now()}`,
    dataHora: agoraPtBr(),
    tipo: 'decisao',
    titulo: dados.encerrarCotacao
      ? `Decisão registrada e cotação encerrada (${dados.modo === 'lote' ? 'Por lote global' : 'Por item'})`
      : `Equalização atualizada (${dados.modo === 'lote' ? 'Por lote global' : 'Por item'})`,
    detalhe: dados.justificativaDecisao || 'Seleção de vencedor atualizada no Mapa Comparativo.',
    usuario: dados.usuario || 'Davi Bigotto',
  })
  return cot
}
export function salvarConfiguracao(dados: {
  tipo: 'investida' | 'categoria' | 'subcategoria' | 'tipo_documento' | 'regra_homologacao' | 'usuario'
  payload: Record<string, unknown>
}) {
  if (dados.tipo === 'investida') {
    const p = dados.payload as unknown as Investida
    const existente = banco.investidas.find(i => i.sigla === p.sigla)
    if (existente) {
      Object.assign(existente, p)
    } else {
      banco.investidas.push({
        sigla: String(p.sigla || 'NV').toUpperCase(),
        razaoSocial: String(p.razaoSocial || ''),
        nomeFantasia: String(p.nomeFantasia || ''),
        cnpj: String(p.cnpj || '00.000.000/0001-00'),
        uf: String(p.uf || 'SP'),
        filiais: Number(p.filiais) || 1,
        situacao: 'Ativa',
        cadastro: hojePtBr(),
      })
    }
  } else if (dados.tipo === 'categoria') {
    const p = dados.payload as { nome: string; descricao: string; criticidade: 'P1' | 'P2' | 'P3'; slaHomologacaoDias: number; subcategoriaInicial?: string }
    const novaCat: CategoriaCompras = {
      id: `cat-${Date.now()}`,
      nome: p.nome,
      descricao: p.descricao || '',
      criticidade: p.criticidade || 'P2',
      slaHomologacaoDias: Number(p.slaHomologacaoDias) || 5,
      situacao: 'Ativa',
      subcategorias: p.subcategoriaInicial
        ? [{ id: `sub-${Date.now()}`, nome: p.subcategoriaInicial, fornecedoresAtivos: 0, situacao: 'Ativa' }]
        : [],
    }
    banco.categorias.push(novaCat)
  } else if (dados.tipo === 'subcategoria') {
    const p = dados.payload as { categoriaId: string; nome: string }
    const cat = banco.categorias.find(c => c.id === p.categoriaId)
    if (cat) {
      cat.subcategorias.push({
        id: `sub-${Date.now()}`,
        nome: p.nome,
        fornecedoresAtivos: 0,
        situacao: 'Ativa',
      })
    }
  } else if (dados.tipo === 'tipo_documento') {
    const p = dados.payload as unknown as TipoDocumento
    banco.tiposDocumento.push({
      id: `doc-${Date.now()}`,
      nome: String(p.nome),
      descricao: String(p.descricao || ''),
      validadeDias: p.validadeDias ? Number(p.validadeDias) : null,
      obrigatorio: Boolean(p.obrigatorio),
      categoriasAplicaveis: Array.isArray(p.categoriasAplicaveis) ? p.categoriasAplicaveis : ['Todas as categorias'],
      investidasAplicaveis: Array.isArray(p.investidasAplicaveis) ? p.investidasAplicaveis : ['PLX'],
      situacao: 'Ativo',
    })
  } else if (dados.tipo === 'regra_homologacao') {
    const p = dados.payload as { id: string; ativa?: boolean; valorParametro?: string }
    const reg = banco.regrasHomologacao.find(r => r.id === p.id)
    if (reg) {
      if (typeof p.ativa === 'boolean') reg.ativa = p.ativa
      if (typeof p.valorParametro === 'string') reg.valorParametro = p.valorParametro
    }
  } else if (dados.tipo === 'usuario') {
    const p = dados.payload as unknown as UsuarioPlataforma
    banco.usuarios.push({
      id: `usr-${Date.now()}`,
      nome: String(p.nome),
      email: String(p.email),
      papel: p.papel || 'Comprador',
      investidas: Array.isArray(p.investidas) && p.investidas.length ? p.investidas : ['PLX'],
      situacao: 'Ativo',
      ultimoAcesso: 'Convite enviado',
    })
  }
  return obterEstadoCompleto()
}
export function responderAssistenteFornecedores(pergunta: string): {
  resposta: string
  consultas: string[]
  proximas: string[]
} {
  const est = obterEstadoCompleto()
  const q = pergunta.toLowerCase()
  if (q.includes('vencid') || q.includes('certid') || q.includes('documento')) {
    const vencidos = est.fornecedores.filter(f => f.docsVencidos > 0)
    const nomes = vencidos.map(f => `${f.nomeFantasia} (${f.docsVencidos} doc)`).join(', ')
    return {
      resposta: `Hoje a Plurix possui **${est.kpis.docsVencidos} documentos vencidos ou reprovados** e **${est.kpis.docsVencendo30d} vencendo nos próximos 30 dias**. Os fornecedores com certidão vencida ou reprovada são: ${nomes}. Pela regra RGH-01, o fechamento de pedido fica travado até a renovação no Portal do Fornecedor.`,
      consultas: ['resumo_documental', 'fornecedores_com_vencidos'],
      proximas: [
        'Quais cotações encerram nas próximas 48 horas?',
        'Qual a diferença entre as propostas da COT-0142?',
        'Quais homologações estão paradas na fila?',
      ],
    }
  }
  if (q.includes('142') || q.includes('limpeza') || q.includes('comparativ') || q.includes('equaliza')) {
    return {
      resposta: `Na **COT-0142 (Materiais de limpeza e químicos técnicos)** para o AMG, todas as 3 empresas convidadas responderam contra o valor estimado de R$ 192,4k. No lote global completo, a **Limpeza Brilhante** tem o menor total equalizado (R$ 179,3k, frete CIF e homologação 100% regular). Já na seleção combinada por item (Pinheiro nos itens IT-01 e IT-02 e Embalagens Aurora nos itens IT-03 e IT-04), o desembolso cai para R$ 175,5k com frete equalizado, condicionado à renovação da CND Federal da Pinheiro e do CRF/FGTS da Aurora.`,
      consultas: ['detalhe_cotacao_COT-0142', 'mapa_equalizacao_COT-0142'],
      proximas: [
        'Quais fornecedores estão com documento vencido?',
        'Como está a fila de homologação hoje?',
        'Quais cotações ainda têm poucas respostas?',
      ],
    }
  }
  if (q.includes('homolog')) {
    return {
      resposta: `Na fila de homologação da Plurix há **${est.kpis.homologFilaTotal} processos ativos**: ${est.kpis.homologAguardando} aguardando análise, ${est.kpis.homologEmAnalise} em análise e ${est.kpis.homologComFornecedor} devolvidos ao fornecedor. O tempo médio de homologação está em **${est.kpis.tempoMedioHomologacaoDias} dias**, com **${est.kpis.slaDentroPrazoPct}%** dentro do SLA.`,
      consultas: ['fila_homologacoes', 'indicadores_sla'],
      proximas: [
        'Qual a situação da TecnoServ Informática?',
        'Quais fornecedores estão com documento vencido?',
        'Qual a análise do mapa comparativo da COT-0142?',
      ],
    }
  }
  return {
    resposta: `Na base da Plurix temos **${est.kpis.fornecedoresTotal} fornecedores cadastrados** (${est.kpis.fornecedoresHomologados} homologados, ${est.kpis.pctHomologados}% da base), **${est.kpis.cotacoesAbertas} cotações em andamento** (${est.kpis.cotacoesEncerrando48h} encerrando em até 48h) e **${est.kpis.pendenciasCriticas} pendências críticas** que pedem ação imediata da equipe de Compras.`,
    consultas: ['painel_geral_compras', 'alertas_atencao'],
    proximas: [
      'Quais fornecedores estão com documento vencido?',
      'Qual a diferença entre as propostas da COT-0142?',
      'Como está a fila de homologação hoje?',
    ],
  }
}
