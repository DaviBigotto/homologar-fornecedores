// Dados centralizados e tipagens de domínio da plataforma de Gestão de Fornecedores, Homologação e Cotações (RFQ).
// Estruturado para substituição transparente por banco Postgres compartilhado (ferramentas_plurix) e API do Portal do Fornecedor.
export type StatusFornecedor =
  | 'Homologado'
  | 'Em análise'
  | 'Aguardando análise'
  | 'Pendente fornecedor'
  | 'Convidado'
  | 'Cadastro em andamento'
  | 'Homologação vencida'
  | 'Bloqueado'
  | 'Reprovado'
export type StatusDocumento =
  | 'valido'
  | 'proximo_vencimento'
  | 'vencido'
  | 'pendente'
  | 'em_analise'
  | 'rejeitado'
export type StatusHomologacao =
  | 'aguardando_analise'
  | 'em_analise'
  | 'com_fornecedor'
  | 'aprovada'
  | 'reprovada'
export type StatusCotacao =
  | 'Rascunho'
  | 'Convite programado'
  | 'Aberta'
  | 'Recebendo propostas'
  | 'Em análise'
  | 'Em negociação'
  | 'Encerrada'
  | 'Cancelada'
export interface Investida {
  sigla: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  uf: string
  filiais: number
  situacao: 'Ativa' | 'Inativa'
  cadastro: string
}
export interface Subcategoria {
  id: string
  nome: string
  fornecedoresAtivos: number
  situacao: 'Ativa' | 'Inativa'
}
export interface CategoriaCompras {
  id: string
  nome: string
  descricao: string
  criticidade: 'P1' | 'P2' | 'P3'
  slaHomologacaoDias: number
  situacao: 'Ativa' | 'Inativa'
  subcategorias: Subcategoria[]
}
export interface TipoDocumento {
  id: string
  nome: string
  descricao: string
  validadeDias: number | null // null = Sem validade
  obrigatorio: boolean
  categoriasAplicaveis: string[]
  investidasAplicaveis: string[]
  situacao: 'Ativo' | 'Inativo'
}
export interface RegraHomologacao {
  id: string
  codigo: string
  titulo: string
  descricao: string
  escopo: string
  valorParametro: string
  ativa: boolean
}
export interface UsuarioPlataforma {
  id: string
  nome: string
  email: string
  papel: 'Administrador' | 'Comprador' | 'Analista de homologação' | 'Gestor' | 'Consulta'
  investidas: string[]
  situacao: 'Ativo' | 'Inativo'
  ultimoAcesso: string
}
export interface DocumentoFornecedor {
  id: string
  tipoId: string
  tipoNome: string
  obrigatorio: boolean
  emissao: string
  validade: string
  diasParaVencer: number | null
  status: StatusDocumento
  arquivo: string
  tamanhoKb: number
  ultimaAtualizacao: string
  observacaoAnalista: string
}
export interface EventoHistorico {
  id: string
  dataHora: string
  tipo: string
  titulo: string
  detalhe: string
  usuario: string
}
export interface Fornecedor {
  id: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoEstadual: string
  regimeTributario: string
  porte: string
  categoriaId: string
  categoria: string
  subcategoria: string
  cidade: string
  uf: string
  endereco: string
  cep: string
  contatoComercial: { nome: string; email: string; telefone: string; cargo: string }
  contatoFinanceiro: { nome: string; email: string; banco: string; agencia: string; conta: string; pix: string }
  socios: string[]
  investidasHomologadas: string[]
  statusHomologacao: StatusFornecedor
  statusDocumental: 'Completo' | 'Com vencidos' | 'Próximo do vencimento' | 'Pendente envio' | 'Em validação' | 'Rejeitado'
  docsVencidos: number
  docsVencendo30d: number
  docsPendentes: number
  elegibilidade: 'Apto' | 'Com ressalva' | 'Impedido'
  bloqueado: boolean
  motivoBloqueio?: string
  notaHomologacao: number | null
  ultimaAtualizacao: string
  portalToken: string
  documentos: DocumentoFornecedor[]
  historico: EventoHistorico[]
}
export interface ItemChecklistHomolog {
  id: string
  item: string
  tipo: 'cadastro' | 'documento' | 'compliance'
  docId?: string
  status: 'ok' | 'att' | 'bad' | 'pendente'
  detalhe: string
}
export interface ProcessoHomologacao {
  id: string
  fornecedorId: string
  fornecedorNome: string
  razaoSocial: string
  cnpj: string
  investida: string
  categoria: string
  subcategoria: string
  status: StatusHomologacao
  rotuloStatus: string
  diasNaEtapa: number
  slaDias: number
  pendenciasAbertas: number
  listaPendencias: string[]
  responsavel: string
  ultimaAtualizacao: string
  observacoesAnalista: string
  parecerFinal?: string
  checklist: ItemChecklistHomolog[]
}
export interface ItemCotacao {
  id: string
  codigo: string
  descricao: string
  quantidade: number
  unidade: string
  especificacao: string
  precoReferenciaUnit: number
}
export interface FornecedorConvidadoCotacao {
  fornecedorId: string
  nomeFantasia: string
  cnpj: string
  statusHomologacao: StatusFornecedor
  docVencido: boolean
  bloqueado: boolean
  respondeu: boolean
  dataResposta?: string
  statusConvite: 'Respondido' | 'Visualizado' | 'Aguardando resposta' | 'Declinado'
}
export interface ItemPropostaFornecedor {
  itemId: string
  precoUnitario: number | null
  precoTotal: number | null
  aliquotaImpostoPct: number
  prazoEntregaDias: number
  marcaModelo: string
  divergenciaEspecificacao?: string
}
export interface PropostaCotacao {
  id: string
  fornecedorId: string
  fornecedorNome: string
  cnpj: string
  statusHomologacao: StatusFornecedor
  homologado: boolean
  docVencido: boolean
  enviadaEm: string
  condicaoPagamento: string
  prazoEntregaMedioDias: number
  tipoFrete: 'CIF (incluso)' | 'FOB (por conta do comprador)'
  valorFreteTotal: number
  impostosInclusos: boolean
  aliquotaMediaPct: number
  validadeProposta: string
  observacoes: string
  incompleta: boolean
  divergencias: string[]
  itens: ItemPropostaFornecedor[]
  subtotalItens: number
  totalEqualizado: number
}
export interface CotacaoRFQ {
  id: string
  titulo: string
  descricao: string
  categoria: string
  subcategoria: string
  investida: string
  comprador: string
  abertura: string
  prazo: string
  horasRestantes: number
  status: StatusCotacao
  valorEstimado: number | null
  condicoesSolicitadas: {
    pagamentoPadrao: string
    tipoFretePreferencial: string
    localEntrega: string
    impostosRegra: string
    validadeMinimaDias: number
    observacoesGerais: string
  }
  itens: ItemCotacao[]
  fornecedoresConvidados: FornecedorConvidadoCotacao[]
  propostas: PropostaCotacao[]
  adjudicacao: {
    modo: 'item' | 'lote'
    vencedorLoteFornecedorId: string | null
    vencedoresPorItem: Record<string, string>
    justificativaDecisao: string
    aprovadoPor?: string
    aprovadoEm?: string
  }
  historico: EventoHistorico[]
}
export interface EstadoBancoFornecedores {
  investidas: Investida[]
  categorias: CategoriaCompras[]
  tiposDocumento: TipoDocumento[]
  regrasHomologacao: RegraHomologacao[]
  usuarios: UsuarioPlataforma[]
  fornecedores: Fornecedor[]
  homologacoes: ProcessoHomologacao[]
  cotacoes: CotacaoRFQ[]
}
export const SEMENTE_GESTAO_FORNECEDORES: EstadoBancoFornecedores = {
  investidas: [
    { sigla: 'PLX', razaoSocial: 'Plurix Participações e Gestão S.A.', nomeFantasia: 'Plurix Holding', cnpj: '39.410.100/0001-01', uf: 'SP', filiais: 2, situacao: 'Ativa', cadastro: '10/01/2026' },
    { sigla: 'AMG', razaoSocial: 'Companhia Sulamericana de Distribuição S.A.', nomeFantasia: 'Amigão Supermercados', cnpj: '07.111.222/0001-45', uf: 'PR', filiais: 64, situacao: 'Ativa', cadastro: '12/01/2026' },
    { sigla: 'BOA', razaoSocial: 'Supermercados Boa Ltda.', nomeFantasia: 'Boa Supermercados', cnpj: '45.888.910/0001-12', uf: 'SP', filiais: 19, situacao: 'Ativa', cadastro: '12/01/2026' },
    { sigla: 'AVE', razaoSocial: 'Supermercados Avenida Ltda.', nomeFantasia: 'Supermercados Avenida', cnpj: '51.222.333/0001-80', uf: 'SP', filiais: 28, situacao: 'Ativa', cadastro: '15/01/2026' },
    { sigla: 'PRN', razaoSocial: 'Paraná Supermercados Ltda.', nomeFantasia: 'Paraná Supermercados', cnpj: '78.900.120/0001-33', uf: 'PR', filiais: 12, situacao: 'Ativa', cadastro: '18/01/2026' },
    { sigla: 'SPO', razaoSocial: 'Superpão Comércio de Alimentos S.A.', nomeFantasia: 'Superpão', cnpj: '81.440.500/0001-90', uf: 'PR', filiais: 38, situacao: 'Ativa', cadastro: '04/02/2026' },
    { sigla: 'JPY', razaoSocial: 'Japi Comércio Varejista Ltda.', nomeFantasia: 'Japi Mercados', cnpj: '62.301.400/0001-09', uf: 'SP', filiais: 17, situacao: 'Ativa', cadastro: '10/02/2026' },
  ],
  categorias: [
    {
      id: 'cat-facilities',
      nome: 'Facilities',
      descricao: 'Serviços contínuos de apoio operacional às lojas e centros de distribuição.',
      criticidade: 'P1',
      slaHomologacaoDias: 5,
      situacao: 'Ativa',
      subcategorias: [
        { id: 'sub-limpeza', nome: 'Limpeza Terceirizada', fornecedoresAtivos: 4, situacao: 'Ativa' },
        { id: 'sub-seguranca', nome: 'Segurança Patrimonial', fornecedoresAtivos: 2, situacao: 'Ativa' },
        { id: 'sub-manutencao', nome: 'Manutenção e Climatização', fornecedoresAtivos: 3, situacao: 'Ativa' },
        { id: 'sub-copa', nome: 'Copa e Café', fornecedoresAtivos: 2, situacao: 'Ativa' },
      ],
    },
    {
      id: 'cat-embalagens',
      nome: 'Embalagens e Insumos',
      descricao: 'Insumos de frente de caixa, padaria, açougue, hortifrúti e higienização técnica.',
      criticidade: 'P1',
      slaHomologacaoDias: 4,
      situacao: 'Ativa',
      subcategorias: [
        { id: 'sub-descartaveis', nome: 'Descartáveis e Bandejas', fornecedoresAtivos: 4, situacao: 'Ativa' },
        { id: 'sub-quimicos', nome: 'Químicos e Higienização', fornecedoresAtivos: 3, situacao: 'Ativa' },
        { id: 'sub-bobinas', nome: 'Sacolas e Bobinas PDV', fornecedoresAtivos: 3, situacao: 'Ativa' },
      ],
    },
    {
      id: 'cat-ti',
      nome: 'TI e Telecom',
      descricao: 'Hardware de loja, coletores, conectividade, cloud e serviços gerenciados.',
      criticidade: 'P2',
      slaHomologacaoDias: 5,
      situacao: 'Ativa',
      subcategorias: [
        { id: 'sub-serv-ti', nome: 'Serviços de TI e Suporte', fornecedoresAtivos: 3, situacao: 'Ativa' },
        { id: 'sub-pdv', nome: 'Automação e Frente de Caixa', fornecedoresAtivos: 2, situacao: 'Ativa' },
        { id: 'sub-telecom', nome: 'Links e Conectividade', fornecedoresAtivos: 2, situacao: 'Ativa' },
      ],
    },
    {
      id: 'cat-logistica',
      nome: 'Logística',
      descricao: 'Transporte entre CDs e lojas, armazenagem refrigerada e movimentação interna.',
      criticidade: 'P1',
      slaHomologacaoDias: 5,
      situacao: 'Ativa',
      subcategorias: [
        { id: 'sub-fretes', nome: 'Fretes e Transporte', fornecedoresAtivos: 3, situacao: 'Ativa' },
        { id: 'sub-armazenagem', nome: 'Armazenagem', fornecedoresAtivos: 1, situacao: 'Ativa' },
        { id: 'sub-empilhadeiras', nome: 'Empilhadeiras e Locação', fornecedoresAtivos: 2, situacao: 'Ativa' },
      ],
    },
    {
      id: 'cat-marketing',
      nome: 'Marketing e PDV',
      descricao: 'Impressão de tabloides, comunicação visual de gôndola e enxoval operacional.',
      criticidade: 'P3',
      slaHomologacaoDias: 3,
      situacao: 'Ativa',
      subcategorias: [
        { id: 'sub-grafica', nome: 'Gráfica e Tabloides', fornecedoresAtivos: 2, situacao: 'Ativa' },
        { id: 'sub-uniformes', nome: 'Uniformes Operacionais', fornecedoresAtivos: 2, situacao: 'Ativa' },
      ],
    },
    {
      id: 'cat-obras',
      nome: 'Obras e Engenharia',
      descricao: 'Reformas de lojas, retrofit, refrigeração industrial e mobiliário técnico.',
      criticidade: 'P1',
      slaHomologacaoDias: 7,
      situacao: 'Ativa',
      subcategorias: [
        { id: 'sub-civil', nome: 'Construção Civil e Retrofit', fornecedoresAtivos: 2, situacao: 'Ativa' },
        { id: 'sub-refrig', nome: 'Refrigeração Alimentar', fornecedoresAtivos: 2, situacao: 'Ativa' },
      ],
    },
  ],
  tiposDocumento: [
    {
      id: 'doc-cnpj',
      nome: 'Cartão CNPJ',
      descricao: 'Comprovante de inscrição e situação cadastral ativa na Receita Federal.',
      validadeDias: null,
      obrigatorio: true,
      categoriasAplicaveis: ['Todas as categorias'],
      investidasAplicaveis: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      situacao: 'Ativo',
    },
    {
      id: 'doc-contrato',
      nome: 'Contrato Social',
      descricao: 'Contrato social ou última alteração consolidada registrada na Junta Comercial.',
      validadeDias: null,
      obrigatorio: true,
      categoriasAplicaveis: ['Todas as categorias'],
      investidasAplicaveis: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      situacao: 'Ativo',
    },
    {
      id: 'doc-cnd-fed',
      nome: 'CND Federal',
      descricao: 'Certidão negativa ou positiva com efeito de negativa de tributos federais e dívida ativa.',
      validadeDias: 180,
      obrigatorio: true,
      categoriasAplicaveis: ['Todas as categorias'],
      investidasAplicaveis: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      situacao: 'Ativo',
    },
    {
      id: 'doc-cndt',
      nome: 'CNDT',
      descricao: 'Certidão negativa de débitos trabalhistas emitida pelo Tribunal Superior do Trabalho.',
      validadeDias: 180,
      obrigatorio: true,
      categoriasAplicaveis: ['Todas as categorias'],
      investidasAplicaveis: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      situacao: 'Ativo',
    },
    {
      id: 'doc-fgts',
      nome: 'CRF/FGTS',
      descricao: 'Certificado de regularidade do FGTS emitido pela Caixa Econômica Federal.',
      validadeDias: 30,
      obrigatorio: true,
      categoriasAplicaveis: ['Todas as categorias'],
      investidasAplicaveis: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      situacao: 'Ativo',
    },
    {
      id: 'doc-alvara',
      nome: 'Alvará de Funcionamento',
      descricao: 'Alvará municipal de localização e funcionamento vigente.',
      validadeDias: 365,
      obrigatorio: true,
      categoriasAplicaveis: ['Facilities', 'Logística', 'Obras e Engenharia'],
      investidasAplicaveis: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      situacao: 'Ativo',
    },
    {
      id: 'doc-estadual',
      nome: 'Certidão Estadual',
      descricao: 'Certidão negativa de débitos tributários estaduais (ICMS).',
      validadeDias: 90,
      obrigatorio: false,
      categoriasAplicaveis: ['Embalagens e Insumos', 'TI e Telecom', 'Marketing e PDV'],
      investidasAplicaveis: ['AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      situacao: 'Ativo',
    },
    {
      id: 'doc-municipal',
      nome: 'Certidão Municipal',
      descricao: 'Certidão negativa de débitos mobiliários municipais (ISSQN).',
      validadeDias: 90,
      obrigatorio: false,
      categoriasAplicaveis: ['Facilities', 'TI e Telecom', 'Obras e Engenharia'],
      investidasAplicaveis: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      situacao: 'Ativo',
    },
  ],
  regrasHomologacao: [
    {
      id: 'reg-01',
      codigo: 'RGH-01',
      titulo: 'Exigência de regularidade fiscal para adjudicação',
      descricao: 'Fornecedor só pode ser declarado vencedor definitivo na cotação se Cartão CNPJ, CND Federal, CNDT e CRF/FGTS estiverem válidos.',
      escopo: 'Todas as investidas (PLX)',
      valorParametro: 'Obrigatório na adjudicação',
      ativa: true,
    },
    {
      id: 'reg-02',
      codigo: 'RGH-02',
      titulo: 'Participação de fornecedor com homologação em análise na RFQ',
      descricao: 'Permite convidar fornecedor em fase de homologação para responder cotação, travando o fechamento do pedido até aprovação final.',
      escopo: 'Categorias P2 e P3',
      valorParametro: 'Permitido com trava no pedido',
      ativa: true,
    },
    {
      id: 'reg-03',
      codigo: 'RGH-03',
      titulo: 'Alerta preventivo de vencimento documental',
      descricao: 'Dispara aviso na fila Precisa de atenção e notifica o fornecedor no Portal do Fornecedor antes do vencimento da certidão.',
      escopo: 'Todas as categorias',
      valorParametro: '30 dias antes do vencimento',
      ativa: true,
    },
    {
      id: 'reg-04',
      codigo: 'RGH-04',
      titulo: 'Mínimo de propostas válidas para encerramento sem justificativa',
      descricao: 'Cotações acima de R$ 50k exigem no mínimo 3 propostas comparáveis ou justificativa formal de fornecedor único ou urgência.',
      escopo: 'Acima de R$ 50k',
      valorParametro: '3 propostas mínimas',
      ativa: true,
    },
    {
      id: 'reg-05',
      codigo: 'RGH-05',
      titulo: 'Portal do Fornecedor para autosserviço externo',
      descricao: 'Gera link único autenticável por token para que o fornecedor convidado envie certidões, atualize dados bancários e responda RFQs.',
      escopo: 'Todas as investidas (PLX)',
      valorParametro: 'Habilitado com token de 15 dias',
      ativa: true,
    },
  ],
  usuarios: [
    { id: 'usr-01', nome: 'Davi Bigotto', email: 'davi.bigotto@plurix.com.br', papel: 'Administrador', investidas: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'], situacao: 'Ativo', ultimoAcesso: '16/11/2026 10:45' },
    { id: 'usr-02', nome: 'Mariana Costa', email: 'mariana.costa@plurix.com.br', papel: 'Comprador', investidas: ['AMG', 'PRN', 'SPO'], situacao: 'Ativo', ultimoAcesso: '16/11/2026 09:30' },
    { id: 'usr-03', nome: 'Ricardo Almeida', email: 'ricardo.almeida@plurix.com.br', papel: 'Comprador', investidas: ['BOA', 'AVE', 'JPY'], situacao: 'Ativo', ultimoAcesso: '16/11/2026 10:12' },
    { id: 'usr-04', nome: 'Fernanda Ribeiro', email: 'fernanda.ribeiro@plurix.com.br', papel: 'Analista de homologação', investidas: ['PLX', 'AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'], situacao: 'Ativo', ultimoAcesso: '16/11/2026 10:40' },
    { id: 'usr-05', nome: 'Carlos Eduardo', email: 'carlos.eduardo@plurix.com.br', papel: 'Gestor', investidas: ['PLX'], situacao: 'Ativo', ultimoAcesso: '15/11/2026 18:20' },
    { id: 'usr-06', nome: 'Juliana Mendes', email: 'juliana.mendes@plurix.com.br', papel: 'Consulta', investidas: ['BOA', 'JPY'], situacao: 'Ativo', ultimoAcesso: '14/11/2026 16:05' },
  ],
  fornecedores: [
    {
      id: 'FOR-001',
      razaoSocial: 'Distribuidora Pinheiro & Filhos Higiene Profissional Ltda.',
      nomeFantasia: 'Pinheiro Distribuidora',
      cnpj: '91.000.003/0001-80',
      inscricaoEstadual: '336.118.920.114',
      regimeTributario: 'Lucro Real',
      porte: 'Médio Porte',
      categoriaId: 'cat-embalagens',
      categoria: 'Embalagens e Insumos',
      subcategoria: 'Químicos e Higienização',
      cidade: 'Hortolândia',
      uf: 'SP',
      endereco: 'Av. da Emancipação, 2450, Distrito Industrial',
      cep: '13184-010',
      contatoComercial: { nome: 'Roberto Pinheiro', email: 'comercial@pinheirodist.com.br', telefone: '(19) 3865-4400', cargo: 'Gerente de Contas Key Account' },
      contatoFinanceiro: { nome: 'Patrícia Lopes', email: 'nfe@pinheirodist.com.br', banco: '341 Itaú', agencia: '0412', conta: '99124-5', pix: '91.000.003/0001-80' },
      socios: ['Antônio Pinheiro Neto', 'Roberto Pinheiro'],
      investidasHomologadas: ['AMG', 'BOA', 'AVE'],
      statusHomologacao: 'Homologado',
      statusDocumental: 'Com vencidos',
      docsVencidos: 1,
      docsVencendo30d: 1,
      docsPendentes: 0,
      elegibilidade: 'Com ressalva',
      bloqueado: false,
      notaHomologacao: 88,
      ultimaAtualizacao: '15/11/2026',
      portalToken: 'plx-portal-pinheiro-91000003',
      documentos: [
        { id: 'd-101', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '10/01/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cartao_cnpj_pinheiro_2026.pdf', tamanhoKb: 245, ultimaAtualizacao: '10/01/2026', observacaoAnalista: 'Inscrição ativa conferida na Receita Federal.' },
        { id: 'd-102', tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '14/03/2024', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: '4a_alteracao_social_pinheiro.pdf', tamanhoKb: 1840, ultimaAtualizacao: '12/01/2026', observacaoAnalista: 'Quadro societário e poderes de assinatura validados.' },
        { id: 'd-103', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '27/04/2026', validade: '24/10/2026', diasParaVencer: -23, status: 'vencido', arquivo: 'cnd_federal_pinheiro_abr26.pdf', tamanhoKb: 410, ultimaAtualizacao: '24/10/2026', observacaoAnalista: 'Certidão vencida há 23 dias. Solicitar renovação antes de liberar novo pedido.' },
        { id: 'd-104', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '10/08/2026', validade: '06/02/2027', diasParaVencer: 82, status: 'valido', arquivo: 'cndt_tst_pinheiro_ago26.pdf', tamanhoKb: 320, ultimaAtualizacao: '10/08/2026', observacaoAnalista: 'Nada consta trabalhista regular.' },
        { id: 'd-105', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '28/10/2026', validade: '26/11/2026', diasParaVencer: 10, status: 'proximo_vencimento', arquivo: 'crf_fgts_pinheiro_out26.pdf', tamanhoKb: 290, ultimaAtualizacao: '28/10/2026', observacaoAnalista: 'Vence em 10 dias. Alerta preventivo enviado ao portal.' },
      ],
      historico: [
        { id: 'h-1', dataHora: '15/11/2026 14:10', tipo: 'cotacao', titulo: 'Proposta enviada na RFQ COT-0142', detalhe: 'Fornecedor enviou proposta comercial para Materiais de limpeza, reposição trimestral.', usuario: 'Portal do Fornecedor' },
        { id: 'h-2', dataHora: '24/10/2026 08:00', tipo: 'alerta', titulo: 'Documento vencido detectado', detalhe: 'CND Federal atingiu a data de vencimento (24/10/2026).', usuario: 'Rotina Automática PLX' },
        { id: 'h-3', dataHora: '18/01/2026 11:30', tipo: 'homologacao', titulo: 'Homologação aprovada para AMG, BOA e AVE', detalhe: 'Parecer favorável emitido após conferência documental e financeira.', usuario: 'Fernanda Ribeiro' },
        { id: 'h-4', dataHora: '10/01/2026 09:15', tipo: 'convite', titulo: 'Fornecedor convidado e cadastro concluído', detalhe: 'Cadastro completo submetido via Portal do Fornecedor.', usuario: 'Davi Bigotto' },
      ],
    },
    {
      id: 'FOR-002',
      razaoSocial: 'Embalagens Aurora Indústria Plástica e Celulose Ltda.',
      nomeFantasia: 'Embalagens Aurora',
      cnpj: '91.000.002/0001-36',
      inscricaoEstadual: '671.092.411.119',
      regimeTributario: 'Lucro Real',
      porte: 'Grande Porte',
      categoriaId: 'cat-embalagens',
      nomeCategoria: 'Embalagens e Insumos',
      categoria: 'Embalagens e Insumos',
      subcategoria: 'Descartáveis e Bandejas',
      cidade: 'Sumaré',
      uf: 'SP',
      endereco: 'Rod. Anhanguera, km 112, Polo Industrial',
      cep: '13178-900',
      contatoComercial: { nome: 'Luciana Martins', email: 'luciana@embalagensaurora.com.br', telefone: '(19) 3873-9000', cargo: 'Diretora Comercial Varejo' },
      contatoFinanceiro: { nome: 'Marcos Viana', email: 'financeiro@embalagensaurora.com.br', banco: '237 Bradesco', agencia: '1290', conta: '44501-2', pix: '91.000.002/0001-36' },
      socios: ['Aurora Participações Industriais S.A.'],
      investidasHomologadas: ['AMG', 'BOA', 'AVE', 'PRN', 'SPO', 'JPY'],
      statusHomologacao: 'Homologado',
      statusDocumental: 'Com vencidos',
      docsVencidos: 1,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: 'Com ressalva',
      bloqueado: false,
      notaHomologacao: 94,
      ultimaAtualizacao: '14/11/2026',
      portalToken: 'plx-portal-aurora-91000002',
      documentos: [
        { id: 'd-201', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '05/01/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cnpj_aurora_ind.pdf', tamanhoKb: 210, ultimaAtualizacao: '05/01/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-202', tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '20/09/2025', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'estatuto_aurora_2025.pdf', tamanhoKb: 2150, ultimaAtualizacao: '05/01/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-203', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '15/07/2026', validade: '11/01/2027', diasParaVencer: 56, status: 'valido', arquivo: 'cnd_federal_aurora.pdf', tamanhoKb: 380, ultimaAtualizacao: '15/07/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-204', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '01/08/2026', validade: '28/01/2027', diasParaVencer: 73, status: 'valido', arquivo: 'cndt_aurora.pdf', tamanhoKb: 340, ultimaAtualizacao: '01/08/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-205', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '14/10/2026', validade: '13/11/2026', diasParaVencer: -3, status: 'vencido', arquivo: 'crf_fgts_aurora_out26.pdf', tamanhoKb: 280, ultimaAtualizacao: '13/11/2026', observacaoAnalista: 'CRF/FGTS vencido há 3 dias. Renovação automática Caixa solicitada.' },
      ],
      historico: [
        { id: 'h-201', dataHora: '14/11/2026 16:40', tipo: 'cotacao', titulo: 'Proposta enviada na RFQ COT-0142', detalhe: 'Proposta completa com frete CIF para todas as lojas do AMG e do BOA.', usuario: 'Portal do Fornecedor' },
        { id: 'h-202', dataHora: '13/11/2026 08:00', tipo: 'alerta', titulo: 'CRF/FGTS vencido há 3 dias', detalhe: 'Notificação automática enviada para luciana@embalagensaurora.com.br.', usuario: 'Rotina Automática PLX' },
      ],
    } as unknown as Fornecedor,
    {
      id: 'FOR-003',
      razaoSocial: 'Limpeza Brilhante Serviços e Produtos de Higiene Ltda.',
      nomeFantasia: 'Limpeza Brilhante',
      cnpj: '91.000.001/0001-91',
      inscricaoEstadual: '114.889.012.110',
      regimeTributario: 'Lucro Presumido',
      porte: 'Médio Porte',
      categoriaId: 'cat-facilities',
      categoria: 'Facilities',
      subcategoria: 'Limpeza Terceirizada',
      cidade: 'Campinas',
      uf: 'SP',
      endereco: 'Rua Conceição, 890, Centro Empresarial',
      cep: '13010-916',
      contatoComercial: { nome: 'Sérgio Cavalcanti', email: 'sergio@limpezabrilhante.com.br', telefone: '(19) 3231-7788', cargo: 'Sócio Diretor' },
      contatoFinanceiro: { nome: 'Aline Prado', email: 'faturamento@limpezabrilhante.com.br', banco: '033 Santander', agencia: '3104', conta: '1300492-9', pix: '91.000.001/0001-91' },
      socios: ['Sérgio Cavalcanti', 'Helena Cavalcanti'],
      investidasHomologadas: ['AMG', 'BOA', 'JPY'],
      statusHomologacao: 'Homologado',
      statusDocumental: 'Completo',
      docsVencidos: 0,
      docsVencendo30d: 1,
      docsPendentes: 0,
      elegibilidade: 'Apto',
      bloqueado: false,
      notaHomologacao: 96,
      ultimaAtualizacao: '15/11/2026',
      portalToken: 'plx-portal-brilhante-91000001',
      documentos: [
        { id: 'd-301', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '02/02/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cnpj_brilhante.pdf', tamanhoKb: 220, ultimaAtualizacao: '02/02/2026', observacaoAnalista: 'Válido.' },
        { id: 'd-302', tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '10/05/2025', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'contrato_social_brilhante.pdf', tamanhoKb: 1520, ultimaAtualizacao: '02/02/2026', observacaoAnalista: 'Válido.' },
        { id: 'd-303', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '19/08/2026', validade: '15/02/2027', diasParaVencer: 91, status: 'valido', arquivo: 'cnd_federal_brilhante.pdf', tamanhoKb: 390, ultimaAtualizacao: '19/08/2026', observacaoAnalista: 'Válido.' },
        { id: 'd-304', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '22/08/2026', validade: '18/02/2027', diasParaVencer: 94, status: 'valido', arquivo: 'cndt_brilhante.pdf', tamanhoKb: 310, ultimaAtualizacao: '22/08/2026', observacaoAnalista: 'Válido.' },
        { id: 'd-305', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '02/11/2026', validade: '02/12/2026', diasParaVencer: 16, status: 'proximo_vencimento', arquivo: 'crf_fgts_brilhante_nov26.pdf', tamanhoKb: 270, ultimaAtualizacao: '02/11/2026', observacaoAnalista: 'Válido, vence em 16 dias.' },
        { id: 'd-306', tipoId: 'doc-alvara', tipoNome: 'Alvará de Funcionamento', obrigatorio: true, emissao: '10/03/2026', validade: '10/03/2027', diasParaVencer: 114, status: 'valido', arquivo: 'alvara_campinas_brilhante.pdf', tamanhoKb: 510, ultimaAtualizacao: '10/03/2026', observacaoAnalista: 'Alvará municipal vigente.' },
      ],
      historico: [
        { id: 'h-301', dataHora: '15/11/2026 09:45', tipo: 'cotacao', titulo: 'Proposta comercial enviada na RFQ COT-0142', detalhe: 'Menor preço global identificado na abertura preliminar.', usuario: 'Portal do Fornecedor' },
        { id: 'h-302', dataHora: '02/11/2026 10:20', tipo: 'documento', titulo: 'CRF/FGTS renovado pelo fornecedor', detalhe: 'Nova certidão válida até 02/12/2026 aprovada.', usuario: 'Fernanda Ribeiro' },
      ],
    },
    {
      id: 'FOR-004',
      razaoSocial: 'Tinta & Traço Indústria Gráfica e Editorial Ltda.',
      nomeFantasia: 'Tinta & Traço Gráfica',
      cnpj: '91.000.004/0001-25',
      inscricaoEstadual: '908.114.225.001',
      regimeTributario: 'Lucro Presumido',
      porte: 'Médio Porte',
      categoriaId: 'cat-marketing',
      categoria: 'Marketing e PDV',
      subcategoria: 'Gráfica e Tabloides',
      cidade: 'Maringá',
      uf: 'PR',
      endereco: 'Av. Colombo, 5810, Zona 07',
      cep: '87020-000',
      contatoComercial: { nome: 'Cláudio Nogueira', email: 'claudio@tintaetraco.com.br', telefone: '(44) 3028-5500', cargo: 'Executivo de Contas Varejo' },
      contatoFinanceiro: { nome: 'Renata Nogueira', email: 'fin@tintaetraco.com.br', banco: '748 Sicredi', agencia: '0718', conta: '55210-8', pix: '91.000.004/0001-25' },
      socios: ['Cláudio Nogueira', 'Renata Nogueira'],
      investidasHomologadas: ['AMG', 'PRN'],
      statusHomologacao: 'Em análise',
      statusDocumental: 'Em validação',
      docsVencidos: 0,
      docsVencendo30d: 1,
      docsPendentes: 0,
      elegibilidade: 'Com ressalva',
      bloqueado: false,
      notaHomologacao: null,
      ultimaAtualizacao: '16/11/2026',
      portalToken: 'plx-portal-tintatraco-91000004',
      documentos: [
        { id: 'd-401', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '14/11/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cartao_cnpj_tintatraco.pdf', tamanhoKb: 230, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Conferido com CNAE de impressão de material publicitário.' },
        { id: 'd-402', tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '12/08/2024', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'contrato_social_tintatraco.pdf', tamanhoKb: 1680, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Alteração consolidada válida.' },
        { id: 'd-403', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '05/06/2026', validade: '02/12/2026', diasParaVencer: 16, status: 'proximo_vencimento', arquivo: 'cnd_fed_tintatraco.pdf', tamanhoKb: 395, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Positiva com efeito de negativa, vence em 16 dias.' },
        { id: 'd-404', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '10/11/2026', validade: '09/05/2027', diasParaVencer: 174, status: 'valido', arquivo: 'cndt_tintatraco_nov26.pdf', tamanhoKb: 310, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Certidão trabalhista validada.' },
        { id: 'd-405', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '01/11/2026', validade: '30/11/2026', diasParaVencer: 14, status: 'em_analise', arquivo: 'crf_fgts_tintatraco_nov26.pdf', tamanhoKb: 275, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Aguardando conferência do código de autenticidade na Caixa.' },
      ],
      historico: [
        { id: 'h-401', dataHora: '14/11/2026 15:20', tipo: 'homologacao', titulo: 'Análise iniciada para expansão ao SPO e BOA', detalhe: 'Documentos enviados pelo fornecedor entraram em análise técnica.', usuario: 'Fernanda Ribeiro' },
      ],
    },
    {
      id: 'FOR-005',
      razaoSocial: 'TecnoServ Soluções em Infraestrutura e Redes Ltda.',
      nomeFantasia: 'TecnoServ Informática',
      cnpj: '91.000.005/0001-70',
      inscricaoEstadual: '122.450.890.111',
      regimeTributario: 'Lucro Presumido',
      porte: 'Médio Porte',
      categoriaId: 'cat-ti',
      categoria: 'TI e Telecom',
      subcategoria: 'Serviços de TI e Suporte',
      cidade: 'São Paulo',
      uf: 'SP',
      endereco: 'Av. Eng. Luís Carlos Berrini, 1681, Conj. 92',
      cep: '04571-011',
      contatoComercial: { nome: 'André Vasconcelos', email: 'andre@tecnoservti.com.br', telefone: '(11) 3045-8800', cargo: 'Gerente de Negócios B2B' },
      contatoFinanceiro: { nome: 'Camila Rocha', email: 'cob@tecnoservti.com.br', banco: '341 Itaú', agencia: '8210', conta: '19200-4', pix: '91.000.005/0001-70' },
      socios: ['André Vasconcelos', 'Paulo Henrique Dias'],
      investidasHomologadas: [],
      statusHomologacao: 'Pendente fornecedor',
      statusDocumental: 'Rejeitado',
      docsVencidos: 1,
      docsVencendo30d: 0,
      docsPendentes: 1,
      elegibilidade: 'Impedido',
      bloqueado: false,
      notaHomologacao: null,
      ultimaAtualizacao: '14/11/2026',
      portalToken: 'plx-portal-tecnoserv-91000005',
      documentos: [
        { id: 'd-501', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '12/11/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cnpj_tecnoserv.pdf', tamanhoKb: 240, ultimaAtualizacao: '12/11/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-502', tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '04/04/2023', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'contrato_tecnoserv.pdf', tamanhoKb: 1920, ultimaAtualizacao: '12/11/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-503', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '10/09/2026', validade: '09/03/2027', diasParaVencer: 113, status: 'valido', arquivo: 'cnd_fed_tecnoserv.pdf', tamanhoKb: 360, ultimaAtualizacao: '12/11/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-504', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '11/11/2026', validade: '10/05/2027', diasParaVencer: 175, status: 'valido', arquivo: 'cndt_tecnoserv.pdf', tamanhoKb: 305, ultimaAtualizacao: '12/11/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-505', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '01/09/2026', validade: '30/09/2026', diasParaVencer: -47, status: 'rejeitado', arquivo: 'crf_fgts_tecnoserv_set26.pdf', tamanhoKb: 265, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Documento reprovado: o arquivo anexado refere-se à competência de setembro e está vencido. Anexar CRF vigente.' },
      ],
      historico: [
        { id: 'h-501', dataHora: '14/11/2026 11:15', tipo: 'rejeicao', titulo: 'Devolvida ao fornecedor por pendência em CRF/FGTS', detalhe: 'Solicitada substituição do CRF/FGTS vencido via Portal do Fornecedor.', usuario: 'Fernanda Ribeiro' },
        { id: 'h-502', dataHora: '12/11/2026 16:00', tipo: 'documento', titulo: 'Documentação inicial submetida', detalhe: 'Fornecedor enviou 5 documentos para homologação em BOA e AVE.', usuario: 'Portal do Fornecedor' },
      ],
    },
    {
      id: 'FOR-006',
      razaoSocial: 'Casa Nova Utilidades e Suprimentos Corporativos Ltda.',
      nomeFantasia: 'Casa Nova Utilidades',
      cnpj: '91.000.006/0001-14',
      inscricaoEstadual: '145.998.312.118',
      regimeTributario: 'Simples Nacional',
      porte: 'EPP',
      categoriaId: 'cat-facilities',
      categoria: 'Facilities',
      subcategoria: 'Copa e Café',
      cidade: 'São Paulo',
      uf: 'SP',
      endereco: 'Rua Clélia, 1420, Lapa',
      cep: '05042-000',
      contatoComercial: { nome: 'Beatriz Sampaio', email: 'beatriz@casanovautil.com.br', telefone: '(11) 3862-1190', cargo: 'Gerente Comercial' },
      contatoFinanceiro: { nome: 'Beatriz Sampaio', email: 'financeiro@casanovautil.com.br', banco: '001 Banco do Brasil', agencia: '1892-4', conta: '77410-1', pix: '91.000.006/0001-14' },
      socios: ['Beatriz Sampaio'],
      investidasHomologadas: [],
      statusHomologacao: 'Aguardando análise',
      statusDocumental: 'Em validação',
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: 'Com ressalva',
      bloqueado: false,
      notaHomologacao: null,
      ultimaAtualizacao: '15/11/2026',
      portalToken: 'plx-portal-casanova-91000006',
      documentos: [
        { id: 'd-601', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '14/11/2026', validade: 'Sem validade', diasParaVencer: null, status: 'em_analise', arquivo: 'cnpj_casanova.pdf', tamanhoKb: 215, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Aguardando triagem da fila.' },
        { id: 'd-602', tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '19/02/2022', validade: 'Sem validade', diasParaVencer: null, status: 'em_analise', arquivo: 'contrato_casanova.pdf', tamanhoKb: 1410, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Aguardando triagem da fila.' },
        { id: 'd-603', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '01/10/2026', validade: '30/03/2027', diasParaVencer: 134, status: 'em_analise', arquivo: 'cnd_fed_casanova.pdf', tamanhoKb: 380, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Aguardando triagem da fila.' },
        { id: 'd-604', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '05/10/2026', validade: '03/04/2027', diasParaVencer: 138, status: 'em_analise', arquivo: 'cndt_casanova.pdf', tamanhoKb: 295, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Aguardando triagem da fila.' },
        { id: 'd-605', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '10/11/2026', validade: '09/12/2026', diasParaVencer: 23, status: 'em_analise', arquivo: 'crf_fgts_casanova.pdf', tamanhoKb: 260, ultimaAtualizacao: '14/11/2026', observacaoAnalista: 'Aguardando triagem da fila.' },
      ],
      historico: [
        { id: 'h-601', dataHora: '14/11/2026 17:30', tipo: 'homologacao', titulo: 'Submissão completa enviada pelo fornecedor', detalhe: 'Fornecedor finalizou o preenchimento no Portal do Fornecedor e entrou na fila Aguardando análise.', usuario: 'Portal do Fornecedor' },
      ],
    },
    {
      id: 'FOR-007',
      razaoSocial: 'ClimaFrio Engenharia Térmica e Refrigeração Industrial S.A.',
      nomeFantasia: 'ClimaFrio Engenharia',
      cnpj: '82.410.500/0001-55',
      inscricaoEstadual: '901.442.810-00',
      regimeTributario: 'Lucro Real',
      porte: 'Grande Porte',
      categoriaId: 'cat-facilities',
      categoria: 'Facilities',
      subcategoria: 'Manutenção e Climatização',
      cidade: 'Curitiba',
      uf: 'PR',
      endereco: 'Rua João Bettega, 3100, CIC',
      cep: '81350-000',
      contatoComercial: { nome: 'Eng. Gustavo Klabin', email: 'gustavo@climafrio.eng.br', telefone: '(41) 3347-2000', cargo: 'Diretor de Contratos' },
      contatoFinanceiro: { nome: 'Eliane Borges', email: 'financeiro@climafrio.eng.br', banco: '341 Itaú', agencia: '3812', conta: '10098-1', pix: '82.410.500/0001-55' },
      socios: ['Gustavo Klabin', 'Henrique Klabin'],
      investidasHomologadas: ['AMG', 'BOA', 'AVE', 'PRN', 'SPO'],
      statusHomologacao: 'Homologado',
      statusDocumental: 'Completo',
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: 'Apto',
      bloqueado: false,
      notaHomologacao: 98,
      ultimaAtualizacao: '15/11/2026',
      portalToken: 'plx-portal-climafrio-82410500',
      documentos: [
        { id: 'd-701', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '10/01/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cnpj_climafrio.pdf', tamanhoKb: 225, ultimaAtualizacao: '10/01/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-702', tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '18/04/2025', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'estatuto_climafrio.pdf', tamanhoKb: 2400, ultimaAtualizacao: '10/01/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-703', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '01/09/2026', validade: '28/02/2027', diasParaVencer: 104, status: 'valido', arquivo: 'cnd_fed_climafrio.pdf', tamanhoKb: 390, ultimaAtualizacao: '01/09/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-704', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '05/09/2026', validade: '04/03/2027', diasParaVencer: 108, status: 'valido', arquivo: 'cndt_climafrio.pdf', tamanhoKb: 315, ultimaAtualizacao: '05/09/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-705', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '05/11/2026', validade: '05/12/2026', diasParaVencer: 19, status: 'valido', arquivo: 'crf_fgts_climafrio.pdf', tamanhoKb: 270, ultimaAtualizacao: '05/11/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-706', tipoId: 'doc-alvara', tipoNome: 'Alvará de Funcionamento', obrigatorio: true, emissao: '15/02/2026', validade: '15/02/2027', diasParaVencer: 91, status: 'valido', arquivo: 'alvara_climafrio_curitiba.pdf', tamanhoKb: 480, ultimaAtualizacao: '15/02/2026', observacaoAnalista: 'Regular.' },
      ],
      historico: [
        { id: 'h-701', dataHora: '15/11/2026 11:00', tipo: 'cotacao', titulo: 'Proposta enviada na RFQ COT-0147', detalhe: 'Proposta técnica e comercial enviada para manutenção preventiva de HVAC.', usuario: 'Portal do Fornecedor' },
      ],
    },
    {
      id: 'FOR-008',
      razaoSocial: 'ArTemp Sistemas de Climatização Comercial Ltda.',
      nomeFantasia: 'ArTemp Climatização',
      cnpj: '67.190.220/0001-18',
      inscricaoEstadual: '244.819.002.115',
      regimeTributario: 'Lucro Presumido',
      porte: 'Médio Porte',
      categoriaId: 'cat-facilities',
      categoria: 'Facilities',
      subcategoria: 'Manutenção e Climatização',
      cidade: 'Londrina',
      uf: 'PR',
      endereco: 'Av. Tiradentes, 1920, Jardim Shangri-lá',
      cep: '86070-545',
      contatoComercial: { nome: 'Marcelo Tavares', email: 'marcelo@artemp.com.br', telefone: '(43) 3328-9100', cargo: 'Gerente Técnico Comercial' },
      contatoFinanceiro: { nome: 'Simone Tavares', email: 'adm@artemp.com.br', banco: '341 Itaú', agencia: '0194', conta: '33812-0', pix: '67.190.220/0001-18' },
      socios: ['Marcelo Tavares', 'Simone Tavares'],
      investidasHomologadas: ['AMG', 'PRN'],
      statusHomologacao: 'Homologado',
      statusDocumental: 'Completo',
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: 'Apto',
      bloqueado: false,
      notaHomologacao: 91,
      ultimaAtualizacao: '15/11/2026',
      portalToken: 'plx-portal-artemp-67190220',
      documentos: [
        { id: 'd-801', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '12/02/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cnpj_artemp.pdf', tamanhoKb: 210, ultimaAtualizacao: '12/02/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-802', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '20/08/2026', validade: '16/02/2027', diasParaVencer: 92, status: 'valido', arquivo: 'cnd_fed_artemp.pdf', tamanhoKb: 375, ultimaAtualizacao: '20/08/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-803', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '18/08/2026', validade: '14/02/2027', diasParaVencer: 90, status: 'valido', arquivo: 'cndt_artemp.pdf', tamanhoKb: 300, ultimaAtualizacao: '18/08/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-804', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '04/11/2026', validade: '04/12/2026', diasParaVencer: 18, status: 'valido', arquivo: 'crf_fgts_artemp.pdf', tamanhoKb: 265, ultimaAtualizacao: '04/11/2026', observacaoAnalista: 'Regular.' },
      ],
      historico: [
        { id: 'h-801', dataHora: '15/11/2026 15:40', tipo: 'cotacao', titulo: 'Convidado na RFQ COT-0147 (ainda sem resposta)', detalhe: 'Lembrete automático de prazo enviado em 16/11.', usuario: 'Mariana Costa' },
      ],
    },
    {
      id: 'FOR-009',
      razaoSocial: 'TransRota Logística Refrigerada e Seca S.A.',
      nomeFantasia: 'TransRota Logística',
      cnpj: '55.710.890/0001-40',
      inscricaoEstadual: '790.221.300.112',
      regimeTributario: 'Lucro Real',
      porte: 'Grande Porte',
      categoriaId: 'cat-logistica',
      categoria: 'Logística',
      subcategoria: 'Fretes e Transporte',
      cidade: 'Jundiaí',
      uf: 'SP',
      endereco: 'Rod. Dom Gabriel Paulino Bueno Couto, km 68',
      cep: '13212-240',
      contatoComercial: { nome: 'Rodrigo Peixoto', email: 'rodrigo@transrota.com.br', telefone: '(11) 4582-6000', cargo: 'Head Comercial Dedicados' },
      contatoFinanceiro: { nome: 'Vanessa Lima', email: 'cte@transrota.com.br', banco: '237 Bradesco', agencia: '0891', conta: '88210-9', pix: '55.710.890/0001-40' },
      socios: ['Grupo TransRota Brasil S.A.'],
      investidasHomologadas: ['BOA', 'AVE', 'JPY', 'AMG'],
      statusHomologacao: 'Homologado',
      statusDocumental: 'Completo',
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: 'Apto',
      bloqueado: false,
      notaHomologacao: 95,
      ultimaAtualizacao: '14/11/2026',
      portalToken: 'plx-portal-transrota-55710890',
      documentos: [
        { id: 'd-901', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '08/01/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cnpj_transrota.pdf', tamanhoKb: 230, ultimaAtualizacao: '08/01/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-902', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '12/09/2026', validade: '11/03/2027', diasParaVencer: 115, status: 'valido', arquivo: 'cnd_fed_transrota.pdf', tamanhoKb: 400, ultimaAtualizacao: '12/09/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-903', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '15/09/2026', validade: '14/03/2027', diasParaVencer: 118, status: 'valido', arquivo: 'cndt_transrota.pdf', tamanhoKb: 310, ultimaAtualizacao: '15/09/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-904', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '06/11/2026', validade: '06/12/2026', diasParaVencer: 20, status: 'valido', arquivo: 'crf_fgts_transrota.pdf', tamanhoKb: 270, ultimaAtualizacao: '06/11/2026', observacaoAnalista: 'Regular.' },
      ],
      historico: [
        { id: 'h-901', dataHora: '14/11/2026 18:00', tipo: 'cotacao', titulo: 'Proposta enviada na RFQ COT-0151', detalhe: 'Proposta para rota CD Jundiaí para lojas BOA e JPY.', usuario: 'Portal do Fornecedor' },
      ],
    },
    {
      id: 'FOR-010',
      razaoSocial: 'Kobrasol Confecções Profissionais e EPIs Ltda.',
      nomeFantasia: 'Kobrasol Uniformes',
      cnpj: '73.812.900/0001-62',
      inscricaoEstadual: '254.119.882',
      regimeTributario: 'Lucro Presumido',
      porte: 'Médio Porte',
      categoriaId: 'cat-marketing',
      categoria: 'Marketing e PDV',
      subcategoria: 'Uniformes Operacionais',
      cidade: 'Blumenau',
      uf: 'SC',
      endereco: 'Rua 7 de Setembro, 2890, Centro',
      cep: '89010-204',
      contatoComercial: { nome: 'Daniela Zimmermann', email: 'daniela@kobrasoluniformes.com.br', telefone: '(47) 3322-4500', cargo: 'Gerente Comercial Nacional' },
      contatoFinanceiro: { nome: 'Jonas Zimmermann', email: 'fin@kobrasoluniformes.com.br', banco: '085 Ailos', agencia: '0101', conta: '99812-3', pix: '73.812.900/0001-62' },
      socios: ['Daniela Zimmermann', 'Jonas Zimmermann'],
      investidasHomologadas: ['SPO', 'PRN', 'AMG'],
      statusHomologacao: 'Homologado',
      statusDocumental: 'Completo',
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: 'Apto',
      bloqueado: false,
      notaHomologacao: 93,
      ultimaAtualizacao: '15/11/2026',
      portalToken: 'plx-portal-kobrasol-73812900',
      documentos: [
        { id: 'd-1001', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '15/01/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cnpj_kobrasol.pdf', tamanhoKb: 220, ultimaAtualizacao: '15/01/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-1002', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '01/10/2026', validade: '30/03/2027', diasParaVencer: 134, status: 'valido', arquivo: 'cnd_fed_kobrasol.pdf', tamanhoKb: 390, ultimaAtualizacao: '01/10/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-1003', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '03/10/2026', validade: '01/04/2027', diasParaVencer: 136, status: 'valido', arquivo: 'cndt_kobrasol.pdf', tamanhoKb: 310, ultimaAtualizacao: '03/10/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-1004', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '08/11/2026', validade: '08/12/2026', diasParaVencer: 22, status: 'valido', arquivo: 'crf_fgts_kobrasol.pdf', tamanhoKb: 270, ultimaAtualizacao: '08/11/2026', observacaoAnalista: 'Regular.' },
      ],
      historico: [
        { id: 'h-1001', dataHora: '15/11/2026 16:10', tipo: 'cotacao', titulo: 'Proposta enviada na RFQ COT-0149', detalhe: 'Proposta comercial enviada para enxoval de loja.', usuario: 'Portal do Fornecedor' },
      ],
    },
    {
      id: 'FOR-011',
      razaoSocial: 'Construtora Vale Norte Obras Comerciais Ltda.',
      nomeFantasia: 'Construtora Vale Norte',
      cnpj: '91.000.008/0001-03',
      inscricaoEstadual: '096/1148920',
      regimeTributario: 'Lucro Real',
      porte: 'Grande Porte',
      categoriaId: 'cat-obras',
      categoria: 'Obras e Engenharia',
      subcategoria: 'Construção Civil e Retrofit',
      cidade: 'Porto Alegre',
      uf: 'RS',
      endereco: 'Av. Carlos Gomes, 1100, Auxiliadora',
      cep: '90480-001',
      contatoComercial: { nome: 'Eng. Otávio Silveira', email: 'otavio@valenorteeng.com.br', telefone: '(51) 3328-9900', cargo: 'Diretor de Engenharia' },
      contatoFinanceiro: { nome: 'Carla Silveira', email: 'medicoes@valenorteeng.com.br', banco: '041 Banrisul', agencia: '0100', conta: '0611920-4', pix: '91.000.008/0001-03' },
      socios: ['Otávio Silveira', 'Carla Silveira'],
      investidasHomologadas: [],
      statusHomologacao: 'Bloqueado',
      statusDocumental: 'Com vencidos',
      docsVencidos: 2,
      docsVencendo30d: 0,
      docsPendentes: 1,
      elegibilidade: 'Impedido',
      bloqueado: true,
      motivoBloqueio: 'Apontamento trabalhista recorrente e CNDT positiva sem efeito de negativa.',
      notaHomologacao: 42,
      ultimaAtualizacao: '10/11/2026',
      portalToken: 'plx-portal-valenorte-91000008',
      documentos: [
        { id: 'd-1101', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '10/01/2026', validade: 'Sem validade', diasParaVencer: null, status: 'valido', arquivo: 'cnpj_valenorte.pdf', tamanhoKb: 215, ultimaAtualizacao: '10/01/2026', observacaoAnalista: 'Regular.' },
        { id: 'd-1102', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '15/04/2026', validade: '12/10/2026', diasParaVencer: -35, status: 'vencido', arquivo: 'cndt_valenorte_abr26.pdf', tamanhoKb: 340, ultimaAtualizacao: '10/11/2026', observacaoAnalista: 'Certidão positiva com pendências trabalhistas não garantidas.' },
        { id: 'd-1103', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '01/09/2026', validade: '30/09/2026', diasParaVencer: -47, status: 'vencido', arquivo: 'crf_fgts_valenorte.pdf', tamanhoKb: 260, ultimaAtualizacao: '10/11/2026', observacaoAnalista: 'Vencido há 47 dias.' },
      ],
      historico: [
        { id: 'h-1101', dataHora: '10/11/2026 14:00', tipo: 'bloqueio', titulo: 'Fornecedor bloqueado preventivamente pelo Compliance', detalhe: 'Impedido de receber novas RFQs até regularização da CNDT e CRF/FGTS.', usuario: 'Fernanda Ribeiro' },
      ],
    },
    {
      id: 'FOR-012',
      razaoSocial: 'EcoPack Soluções Sustentáveis em Papel e Bobinas Ltda.',
      nomeFantasia: 'EcoPack Bobinas',
      cnpj: '99.000.123/0001-90',
      inscricaoEstadual: '412.900.118.110',
      regimeTributario: 'Lucro Presumido',
      porte: 'Médio Porte',
      categoriaId: 'cat-embalagens',
      categoria: 'Embalagens e Insumos',
      subcategoria: 'Sacolas e Bobinas PDV',
      cidade: 'Sorocaba',
      uf: 'SP',
      endereco: 'Av. Independência, 4120, Éden',
      cep: '18103-000',
      contatoComercial: { nome: 'Tiago Barros', email: 'tiago@ecopackpdv.com.br', telefone: '(15) 3228-7100', cargo: 'Gerente Comercial' },
      contatoFinanceiro: { nome: 'Mônica Barros', email: 'financeiro@ecopackpdv.com.br', banco: '341 Itaú', agencia: '0511', conta: '61209-1', pix: '99.000.123/0001-90' },
      socios: ['Tiago Barros'],
      investidasHomologadas: [],
      statusHomologacao: 'Convidado',
      statusDocumental: 'Pendente envio',
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 5,
      elegibilidade: 'Com ressalva',
      bloqueado: false,
      notaHomologacao: null,
      ultimaAtualizacao: '15/11/2026',
      portalToken: 'plx-portal-ecopack-99000123',
      documentos: [
        { id: 'd-1201', tipoId: 'doc-cnpj', tipoNome: 'Cartão CNPJ', obrigatorio: true, emissao: '-', validade: 'Sem validade', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: '15/11/2026', observacaoAnalista: 'Aguardando upload pelo fornecedor no Portal.' },
        { id: 'd-1202', tipoId: 'doc-contrato', tipoNome: 'Contrato Social', obrigatorio: true, emissao: '-', validade: 'Sem validade', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: '15/11/2026', observacaoAnalista: 'Aguardando upload pelo fornecedor no Portal.' },
        { id: 'd-1203', tipoId: 'doc-cnd-fed', tipoNome: 'CND Federal', obrigatorio: true, emissao: '-', validade: '180 dias', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: '15/11/2026', observacaoAnalista: 'Aguardando upload pelo fornecedor no Portal.' },
        { id: 'd-1204', tipoId: 'doc-cndt', tipoNome: 'CNDT', obrigatorio: true, emissao: '-', validade: '180 dias', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: '15/11/2026', observacaoAnalista: 'Aguardando upload pelo fornecedor no Portal.' },
        { id: 'd-1205', tipoId: 'doc-fgts', tipoNome: 'CRF/FGTS', obrigatorio: true, emissao: '-', validade: '30 dias', diasParaVencer: null, status: 'pendente', arquivo: '', tamanhoKb: 0, ultimaAtualizacao: '15/11/2026', observacaoAnalista: 'Aguardando upload pelo fornecedor no Portal.' },
      ],
      historico: [
        { id: 'h-1201', dataHora: '15/11/2026 10:00', tipo: 'convite', titulo: 'Convite de homologação enviado', detalhe: 'Link do Portal do Fornecedor enviado para tiago@ecopackpdv.com.br.', usuario: 'Ricardo Almeida' },
      ],
    },
  ],
  homologacoes: [
    {
      id: 'HOM-2026-041',
      fornecedorId: 'FOR-004',
      fornecedorNome: 'Tinta & Traço Gráfica',
      razaoSocial: 'Tinta & Traço Indústria Gráfica e Editorial Ltda.',
      cnpj: '91.000.004/0001-25',
      investida: 'SPO',
      categoria: 'Marketing e PDV',
      subcategoria: 'Gráfica e Tabloides',
      status: 'em_analise',
      rotuloStatus: 'Em análise',
      diasNaEtapa: 2,
      slaDias: 3,
      pendenciasAbertas: 0,
      listaPendencias: [],
      responsavel: 'Fernanda Ribeiro',
      ultimaAtualizacao: '16/11/2026 09:40',
      observacoesAnalista: 'Cadastro societário e bancário conferidos. CND Federal é positiva com efeito de negativa e vence em 16 dias. Falta apenas validar autenticidade do CRF/FGTS para liberar.',
      checklist: [
        { id: 'ck-41-1', item: 'Dados cadastrais e bancários', tipo: 'cadastro', status: 'ok', detalhe: 'Titularidade da conta PJ Sicredi compatível com o CNPJ.' },
        { id: 'ck-41-2', item: 'Cartão CNPJ', tipo: 'documento', docId: 'd-401', status: 'ok', detalhe: 'Situação cadastral Ativa na Receita Federal.' },
        { id: 'ck-41-3', item: 'Contrato Social', tipo: 'documento', docId: 'd-402', status: 'ok', detalhe: 'Poderes de representação validados.' },
        { id: 'ck-41-4', item: 'CND Federal', tipo: 'documento', docId: 'd-403', status: 'att', detalhe: 'Válida, porém vence em 16 dias (02/12/2026).' },
        { id: 'ck-41-5', item: 'CNDT Trabalhista', tipo: 'documento', docId: 'd-404', status: 'ok', detalhe: 'Certidão negativa válida até 09/05/2027.' },
        { id: 'ck-41-6', item: 'CRF/FGTS', tipo: 'documento', docId: 'd-405', status: 'pendente', detalhe: 'Em análise de autenticidade na Caixa.' },
      ],
    },
    {
      id: 'HOM-2026-042',
      fornecedorId: 'FOR-005',
      fornecedorNome: 'TecnoServ Informática',
      razaoSocial: 'TecnoServ Soluções em Infraestrutura e Redes Ltda.',
      cnpj: '91.000.005/0001-70',
      investida: 'BOA',
      categoria: 'TI e Telecom',
      subcategoria: 'Serviços de TI e Suporte',
      status: 'com_fornecedor',
      rotuloStatus: 'Com fornecedor',
      diasNaEtapa: 2,
      slaDias: 5,
      pendenciasAbertas: 1,
      listaPendencias: ['Substituir CRF/FGTS vencido em 30/09/2026 por certidão vigente'],
      responsavel: 'Fernanda Ribeiro',
      ultimaAtualizacao: '14/11/2026 11:15',
      observacoesAnalista: 'Devolvida ao fornecedor via Portal para substituição do CRF/FGTS.',
      checklist: [
        { id: 'ck-42-1', item: 'Dados cadastrais e bancários', tipo: 'cadastro', status: 'ok', detalhe: 'Conta Itaú PJ conferida.' },
        { id: 'ck-42-2', item: 'Cartão CNPJ', tipo: 'documento', docId: 'd-501', status: 'ok', detalhe: 'Situação Ativa.' },
        { id: 'ck-42-3', item: 'Contrato Social', tipo: 'documento', docId: 'd-502', status: 'ok', detalhe: 'Contrato consolidado ok.' },
        { id: 'ck-42-4', item: 'CND Federal', tipo: 'documento', docId: 'd-503', status: 'ok', detalhe: 'Válida até 09/03/2027.' },
        { id: 'ck-42-5', item: 'CNDT Trabalhista', tipo: 'documento', docId: 'd-504', status: 'ok', detalhe: 'Válida até 10/05/2027.' },
        { id: 'ck-42-6', item: 'CRF/FGTS', tipo: 'documento', docId: 'd-505', status: 'bad', detalhe: 'Reprovado: documento anexado está vencido desde 30/09/2026.' },
      ],
    },
    {
      id: 'HOM-2026-043',
      fornecedorId: 'FOR-006',
      fornecedorNome: 'Casa Nova Utilidades',
      razaoSocial: 'Casa Nova Utilidades e Suprimentos Corporativos Ltda.',
      cnpj: '91.000.006/0001-14',
      investida: 'AMG',
      categoria: 'Facilities',
      subcategoria: 'Copa e Café',
      status: 'aguardando_analise',
      rotuloStatus: 'Aguardando análise',
      diasNaEtapa: 2,
      slaDias: 5,
      pendenciasAbertas: 0,
      listaPendencias: [],
      responsavel: 'Sem responsável',
      ultimaAtualizacao: '14/11/2026 17:30',
      observacoesAnalista: 'Fornecedor enviou pacote documental completo pelo Portal. Aguardando atribuição de analista.',
      checklist: [
        { id: 'ck-43-1', item: 'Dados cadastrais e bancários', tipo: 'cadastro', status: 'ok', detalhe: 'Preenchimento 100% concluído no Portal.' },
        { id: 'ck-43-2', item: 'Cartão CNPJ', tipo: 'documento', docId: 'd-601', status: 'pendente', detalhe: 'Aguardando conferência.' },
        { id: 'ck-43-3', item: 'Contrato Social', tipo: 'documento', docId: 'd-602', status: 'pendente', detalhe: 'Aguardando conferência.' },
        { id: 'ck-43-4', item: 'CND Federal', tipo: 'documento', docId: 'd-603', status: 'pendente', detalhe: 'Aguardando conferência.' },
        { id: 'ck-43-5', item: 'CNDT Trabalhista', tipo: 'documento', docId: 'd-604', status: 'pendente', detalhe: 'Aguardando conferência.' },
        { id: 'ck-43-6', item: 'CRF/FGTS', tipo: 'documento', docId: 'd-605', status: 'pendente', detalhe: 'Aguardando conferência.' },
      ],
    },
    {
      id: 'HOM-2026-044',
      fornecedorId: 'FOR-001',
      fornecedorNome: 'Pinheiro Distribuidora',
      razaoSocial: 'Distribuidora Pinheiro & Filhos Higiene Profissional Ltda.',
      cnpj: '91.000.003/0001-80',
      investida: 'PRN',
      categoria: 'Embalagens e Insumos',
      subcategoria: 'Químicos e Higienização',
      status: 'aguardando_analise',
      rotuloStatus: 'Aguardando análise',
      diasNaEtapa: 4,
      slaDias: 4,
      pendenciasAbertas: 1,
      listaPendencias: ['CND Federal vencida há 23 dias precisa ser renovada para extensão ao PRN'],
      responsavel: 'Fernanda Ribeiro',
      ultimaAtualizacao: '13/11/2026 16:00',
      observacoesAnalista: 'Pedido de extensão de escopo para o PRN. Necessário cobrar CND Federal atualizada.',
      checklist: [
        { id: 'ck-44-1', item: 'Dados cadastrais e bancários', tipo: 'cadastro', status: 'ok', detalhe: 'Já homologado em AMG, BOA e AVE.' },
        { id: 'ck-44-2', item: 'Cartão CNPJ', tipo: 'documento', docId: 'd-101', status: 'ok', detalhe: 'Válido.' },
        { id: 'ck-44-3', item: 'Contrato Social', tipo: 'documento', docId: 'd-102', status: 'ok', detalhe: 'Válido.' },
        { id: 'ck-44-4', item: 'CND Federal', tipo: 'documento', docId: 'd-103', status: 'bad', detalhe: 'Vencida em 24/10/2026.' },
        { id: 'ck-44-5', item: 'CNDT Trabalhista', tipo: 'documento', docId: 'd-104', status: 'ok', detalhe: 'Válida até 06/02/2027.' },
        { id: 'ck-44-6', item: 'CRF/FGTS', tipo: 'documento', docId: 'd-105', status: 'att', detalhe: 'Vence em 10 dias (26/11/2026).' },
      ],
    },
    {
      id: 'HOM-2026-039',
      fornecedorId: 'FOR-007',
      fornecedorNome: 'ClimaFrio Engenharia',
      razaoSocial: 'ClimaFrio Engenharia Térmica e Refrigeração Industrial S.A.',
      cnpj: '82.410.500/0001-55',
      investida: 'PLX',
      categoria: 'Facilities',
      subcategoria: 'Manutenção e Climatização',
      status: 'aprovada',
      rotuloStatus: 'Homologado',
      diasNaEtapa: 3,
      slaDias: 5,
      pendenciasAbertas: 0,
      listaPendencias: [],
      responsavel: 'Fernanda Ribeiro',
      ultimaAtualizacao: '05/11/2026 14:20',
      observacoesAnalista: 'Documentação 100% regular e capacidade técnica comprovada por atestados CREA.',
      parecerFinal: 'Aprovado sem ressalvas para todas as investidas da Plurix.',
      checklist: [
        { id: 'ck-39-1', item: 'Dados cadastrais e bancários', tipo: 'cadastro', status: 'ok', detalhe: 'Validado.' },
        { id: 'ck-39-2', item: 'Cartão CNPJ', tipo: 'documento', docId: 'd-701', status: 'ok', detalhe: 'Validado.' },
        { id: 'ck-39-3', item: 'Contrato Social', tipo: 'documento', docId: 'd-702', status: 'ok', detalhe: 'Validado.' },
        { id: 'ck-39-4', item: 'CND Federal', tipo: 'documento', docId: 'd-703', status: 'ok', detalhe: 'Validado.' },
        { id: 'ck-39-5', item: 'CNDT Trabalhista', tipo: 'documento', docId: 'd-704', status: 'ok', detalhe: 'Validado.' },
        { id: 'ck-39-6', item: 'CRF/FGTS', tipo: 'documento', docId: 'd-705', status: 'ok', detalhe: 'Validado.' },
      ],
    },
    {
      id: 'HOM-2026-038',
      fornecedorId: 'FOR-011',
      fornecedorNome: 'Construtora Vale Norte',
      razaoSocial: 'Construtora Vale Norte Obras Comerciais Ltda.',
      cnpj: '91.000.008/0001-03',
      investida: 'SPO',
      categoria: 'Obras e Engenharia',
      subcategoria: 'Construção Civil e Retrofit',
      status: 'reprovada',
      rotuloStatus: 'Reprovada',
      diasNaEtapa: 6,
      slaDias: 7,
      pendenciasAbertas: 2,
      listaPendencias: ['CNDT positiva sem efeito de negativa', 'CRF/FGTS vencido sem regularização'],
      responsavel: 'Fernanda Ribeiro',
      ultimaAtualizacao: '10/11/2026 14:00',
      observacoesAnalista: 'Fornecedor não apresentou certidão negativa trabalhista dentro do prazo de recurso.',
      parecerFinal: 'Reprovado por risco trabalhista e bloqueio preventivo registrado.',
      checklist: [
        { id: 'ck-38-1', item: 'Dados cadastrais e bancários', tipo: 'cadastro', status: 'ok', detalhe: 'Validado.' },
        { id: 'ck-38-2', item: 'Cartão CNPJ', tipo: 'documento', docId: 'd-1101', status: 'ok', detalhe: 'Validado.' },
        { id: 'ck-38-3', item: 'CNDT Trabalhista', tipo: 'documento', docId: 'd-1102', status: 'bad', detalhe: 'Certidão positiva com débitos.' },
        { id: 'ck-38-4', item: 'CRF/FGTS', tipo: 'documento', docId: 'd-1103', status: 'bad', detalhe: 'Vencido há 47 dias.' },
      ],
    },
  ],
  cotacoes: [
    {
      id: 'COT-0142',
      titulo: 'Materiais de limpeza e químicos técnicos, reposição trimestral',
      descricao: 'Fornecimento trimestral de detergentes clorados, desinfetantes de uso alimentar, bobinas de papel toalha e sacos de lixo reforçados para 64 lojas do AMG e 19 lojas do BOA.',
      categoria: 'Embalagens e Insumos',
      subcategoria: 'Químicos e Higienização',
      investida: 'AMG',
      comprador: 'Mariana Costa',
      abertura: '07/11/2026',
      prazo: '17/11/2026 18:00',
      horasRestantes: 31,
      status: 'Em análise',
      valorEstimado: 192400,
      condicoesSolicitadas: {
        pagamentoPadrao: '45 DDL via boleto bancário PJ',
        tipoFretePreferencial: 'CIF incluso com entrega nos CDs Maringá (AMG) e Jundiaí (BOA)',
        localEntrega: 'CD Maringá PR e CD Jundiaí SP',
        impostosRegra: 'ICMS, PIS e COFINS inclusos no preço unitário líquido',
        validadeMinimaDias: 30,
        observacoesGerais: 'Exigido laudo ANVISA e FISPQ para todos os químicos de açougue e padaria.',
      },
      itens: [
        { id: 'IT-01', codigo: 'INS-4401', descricao: 'Detergente Desengordurante Alcalino Clorado Galão 5L', quantidade: 1800, unidade: 'GL', especificacao: 'Registro ANVISA ativo, diluição mínima 1:50 para piso e bancada inox.', precoReferenciaUnit: 42.50 },
        { id: 'IT-02', codigo: 'INS-4408', descricao: 'Desinfetante Quaternário de Amônio Sem Cheiro Galão 5L', quantidade: 1400, unidade: 'GL', especificacao: 'Uso em áreas de manipulação alimentar (açougue, frios e padaria).', precoReferenciaUnit: 48.00 },
        { id: 'IT-03', codigo: 'INS-4415', descricao: 'Bobina Papel Toalha Interfolhado 100% Celulose Virgem Cx c/ 2400 fls', quantidade: 950, unidade: 'CX', especificacao: 'Gramatura mínima 28g/m², alvura superior a 85%.', precoReferenciaUnit: 36.00 },
        { id: 'IT-04', codigo: 'INS-4422', descricao: 'Saco para Lixo Reforçado 200 Litros Preto 12 Micras Pct c/ 100 un', quantidade: 600, unidade: 'PCT', especificacao: 'Solda estrela reforçada, norma ABNT NBR 9191.', precoReferenciaUnit: 24.50 },
      ],
      fornecedoresConvidados: [
        { fornecedorId: 'FOR-003', nomeFantasia: 'Limpeza Brilhante', cnpj: '91.000.001/0001-91', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '14/11/2026 11:20', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-001', nomeFantasia: 'Pinheiro Distribuidora', cnpj: '91.000.003/0001-80', statusHomologacao: 'Homologado', docVencido: true, bloqueado: false, respondeu: true, dataResposta: '15/11/2026 14:10', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-002', nomeFantasia: 'Embalagens Aurora', cnpj: '91.000.002/0001-36', statusHomologacao: 'Homologado', docVencido: true, bloqueado: false, respondeu: true, dataResposta: '14/11/2026 16:40', statusConvite: 'Respondido' },
      ],
      propostas: [
        {
          id: 'PROP-142-A',
          fornecedorId: 'FOR-003',
          fornecedorNome: 'Limpeza Brilhante',
          cnpj: '91.000.001/0001-91',
          statusHomologacao: 'Homologado',
          homologado: true,
          docVencido: false,
          enviadaEm: '14/11/2026 11:20',
          condicaoPagamento: '45 DDL',
          prazoEntregaMedioDias: 5,
          tipoFrete: 'CIF (incluso)',
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 18.0,
          validadeProposta: '30 dias (até 14/12/2026)',
          observacoes: 'Entrega fracionada quinzenal sem custo adicional de frete. Todos os laudos ANVISA anexados.',
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: 'IT-01', precoUnitario: 38.90, precoTotal: 70020, aliquotaImpostoPct: 18, prazoEntregaDias: 5, marcaModelo: 'Brilhante Pro Chlor 5L' },
            { itemId: 'IT-02', precoUnitario: 44.50, precoTotal: 62300, aliquotaImpostoPct: 18, prazoEntregaDias: 5, marcaModelo: 'Brilhante Quat Food 5L' },
            { itemId: 'IT-03', precoUnitario: 34.80, precoTotal: 33060, aliquotaImpostoPct: 18, prazoEntregaDias: 4, marcaModelo: 'SoftPure Virgem 28g' },
            { itemId: 'IT-04', precoUnitario: 23.20, precoTotal: 13920, aliquotaImpostoPct: 18, prazoEntregaDias: 4, marcaModelo: 'MaxBag 200L 12m' },
          ],
          subtotalItens: 179300,
          totalEqualizado: 179300,
        },
        {
          id: 'PROP-142-B',
          fornecedorId: 'FOR-001',
          fornecedorNome: 'Pinheiro Distribuidora',
          cnpj: '91.000.003/0001-80',
          statusHomologacao: 'Homologado',
          homologado: true,
          docVencido: true,
          enviadaEm: '15/11/2026 14:10',
          condicaoPagamento: '60 DDL',
          prazoEntregaMedioDias: 7,
          tipoFrete: 'FOB (por conta do comprador)',
          valorFreteTotal: 4200,
          impostosInclusos: true,
          aliquotaMediaPct: 18.0,
          validadeProposta: '30 dias (até 15/12/2026)',
          observacoes: 'Condição de pagamento estendida para 60 DDL. Frete FOB calculado à parte em R$ 4,2k. CND Federal em renovação.',
          incompleta: false,
          divergencias: ['Frete FOB diverge do padrão CIF solicitado (+R$ 4,2k)', 'CND Federal vencida há 23 dias'],
          itens: [
            { itemId: 'IT-01', precoUnitario: 37.80, precoTotal: 68040, aliquotaImpostoPct: 18, prazoEntregaDias: 7, marcaModelo: 'Pinheiro Alcalino 5L' },
            { itemId: 'IT-02', precoUnitario: 43.20, precoTotal: 60480, aliquotaImpostoPct: 18, prazoEntregaDias: 7, marcaModelo: 'Pinheiro Quat 5L' },
            { itemId: 'IT-03', precoUnitario: 36.90, precoTotal: 35055, aliquotaImpostoPct: 18, prazoEntregaDias: 7, marcaModelo: 'Celupack 28g' },
            { itemId: 'IT-04', precoUnitario: 24.00, precoTotal: 14400, aliquotaImpostoPct: 18, prazoEntregaDias: 7, marcaModelo: 'Pinheiro Bag 200L' },
          ],
          subtotalItens: 177975,
          totalEqualizado: 182175,
        },
        {
          id: 'PROP-142-C',
          fornecedorId: 'FOR-002',
          fornecedorNome: 'Embalagens Aurora',
          cnpj: '91.000.002/0001-36',
          statusHomologacao: 'Homologado',
          homologado: true,
          docVencido: true,
          enviadaEm: '14/11/2026 16:40',
          condicaoPagamento: '45 DDL',
          prazoEntregaMedioDias: 3,
          tipoFrete: 'CIF (incluso)',
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 18.0,
          validadeProposta: '20 dias (até 04/12/2026)',
          observacoes: 'Somos fabricantes diretos dos itens de papel e sacos plásticos (IT-03 e IT-04). Não cotamos o item IT-02.',
          incompleta: true,
          divergencias: ['Proposta parcial: item IT-02 não cotado', 'Validade de 20 dias inferior ao mínimo de 30 dias', 'CRF/FGTS vencido há 3 dias'],
          itens: [
            { itemId: 'IT-01', precoUnitario: 41.00, precoTotal: 73800, aliquotaImpostoPct: 18, prazoEntregaDias: 4, marcaModelo: 'Aurora Clean 5L' },
            { itemId: 'IT-02', precoUnitario: null, precoTotal: null, aliquotaImpostoPct: 0, prazoEntregaDias: 0, marcaModelo: 'Não cotado', divergenciaEspecificacao: 'Item fora de linha no mês' },
            { itemId: 'IT-03', precoUnitario: 31.90, precoTotal: 30305, aliquotaImpostoPct: 18, prazoEntregaDias: 3, marcaModelo: 'Aurora Prime Virgem 30g' },
            { itemId: 'IT-04', precoUnitario: 20.80, precoTotal: 12480, aliquotaImpostoPct: 18, prazoEntregaDias: 3, marcaModelo: 'Aurora Heavy 200L 14m' },
          ],
          subtotalItens: 116585,
          totalEqualizado: 116585,
        },
      ],
      adjudicacao: {
        modo: 'item',
        vencedorLoteFornecedorId: 'FOR-003',
        vencedoresPorItem: {
          'IT-01': 'FOR-001',
          'IT-02': 'FOR-001',
          'IT-03': 'FOR-002',
          'IT-04': 'FOR-002',
        },
        justificativaDecisao: 'Adjudicação combinada por especialidade gera o menor desembolso total, condicionada à renovação das certidões antes da emissão do pedido.',
      },
      historico: [
        { id: 'hc-1', dataHora: '15/11/2026 14:15', tipo: 'status', titulo: 'RFQ avançou para Em análise', detalhe: 'Todas as 3 empresas convidadas enviaram propostas.', usuario: 'Mariana Costa' },
        { id: 'hc-2', dataHora: '07/11/2026 09:00', tipo: 'abertura', titulo: 'Cotação publicada e convites disparados', detalhe: 'Convites enviados para Limpeza Brilhante, Pinheiro Distribuidora e Embalagens Aurora.', usuario: 'Mariana Costa' },
      ],
    },
    {
      id: 'COT-0147',
      titulo: 'Manutenção preventiva e corretiva de ar-condicionado (28 lojas)',
      descricao: 'Contrato anual de PMOC, limpeza de evaporadoras e manutenção de rooftops nas lojas do AMG e do PRN.',
      categoria: 'Facilities',
      subcategoria: 'Manutenção e Climatização',
      investida: 'AMG',
      comprador: 'Mariana Costa',
      abertura: '11/11/2026',
      prazo: '17/11/2026 04:00',
      horasRestantes: 18,
      status: 'Recebendo propostas',
      valorEstimado: 340000,
      condicoesSolicitadas: {
        pagamentoPadrao: '30 DDL após medição mensal aprovada',
        tipoFretePreferencial: 'Deslocamento técnico incluso (CIF)',
        localEntrega: '28 lojas regionais PR e interior de SP',
        impostosRegra: 'ISS e retenções legais destacadas em nota fiscal de serviço',
        validadeMinimaDias: 45,
        observacoesGerais: 'Obrigatório ART anual de PMOC assinada por Engenheiro Mecânico.',
      },
      itens: [
        { id: 'IT-47-1', codigo: 'SRV-901', descricao: 'Manutenção Preventiva Mensal PMOC Lojas Compactas (até 120 TR)', quantidade: 18, unidade: 'LOJA/MÊS', especificacao: 'Visitas quinzenais, limpeza de filtros e laudo PMOC.', precoReferenciaUnit: 9200 },
        { id: 'IT-47-2', codigo: 'SRV-902', descricao: 'Manutenção Preventiva Mensal PMOC Lojas Grandes e Atacado (acima de 120 TR)', quantidade: 10, unidade: 'LOJA/MÊS', especificacao: 'Técnico residente ou atendimento em até 4h para chamados P1.', precoReferenciaUnit: 17440 },
      ],
      fornecedoresConvidados: [
        { fornecedorId: 'FOR-007', nomeFantasia: 'ClimaFrio Engenharia', cnpj: '82.410.500/0001-55', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '15/11/2026 11:00', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-008', nomeFantasia: 'ArTemp Climatização', cnpj: '67.190.220/0001-18', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: false, statusConvite: 'Visualizado' },
        { fornecedorId: 'FOR-003', nomeFantasia: 'Limpeza Brilhante', cnpj: '91.000.001/0001-91', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: false, statusConvite: 'Aguardando resposta' },
        { fornecedorId: 'FOR-005', nomeFantasia: 'TecnoServ Informática', cnpj: '91.000.005/0001-70', statusHomologacao: 'Pendente fornecedor', docVencido: true, bloqueado: false, respondeu: false, statusConvite: 'Declinado' },
      ],
      propostas: [
        {
          id: 'PROP-147-A',
          fornecedorId: 'FOR-007',
          fornecedorNome: 'ClimaFrio Engenharia',
          cnpj: '82.410.500/0001-55',
          statusHomologacao: 'Homologado',
          homologado: true,
          docVencido: false,
          enviadaEm: '15/11/2026 11:00',
          condicaoPagamento: '30 DDL',
          prazoEntregaMedioDias: 2,
          tipoFrete: 'CIF (incluso)',
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 14.25,
          validadeProposta: '60 dias',
          observacoes: 'Equipes próprias em Curitiba, Londrina e Maringá. ART inclusa sem custo extra.',
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: 'IT-47-1', precoUnitario: 8650, precoTotal: 155700, aliquotaImpostoPct: 14.25, prazoEntregaDias: 2, marcaModelo: 'Equipe Própria PMOC' },
            { itemId: 'IT-47-2', precoUnitario: 16200, precoTotal: 162000, aliquotaImpostoPct: 14.25, prazoEntregaDias: 2, marcaModelo: 'SLA 4h Crítico' },
          ],
          subtotalItens: 317700,
          totalEqualizado: 317700,
        },
      ],
      adjudicacao: {
        modo: 'lote',
        vencedorLoteFornecedorId: 'FOR-007',
        vencedoresPorItem: { 'IT-47-1': 'FOR-007', 'IT-47-2': 'FOR-007' },
        justificativaDecisao: 'Aguardando encerramento do prazo (18h restantes) e resposta da ArTemp Climatização para equalização final.',
      },
      historico: [
        { id: 'hc-47-1', dataHora: '16/11/2026 08:30', tipo: 'alerta', titulo: 'Cotação encerrando em 18h com 1 de 4 respostas', detalhe: 'Cobrança enviada para ArTemp Climatização.', usuario: 'Mariana Costa' },
      ],
    },
    {
      id: 'COT-0149',
      titulo: 'Uniformes operacionais de frente de caixa e perecíveis',
      descricao: 'Enxoval de verão 2027 para operadores de caixa, reposição e balconistas de padaria/açougue das investidas BOA, AVE e JPY.',
      categoria: 'Marketing e PDV',
      subcategoria: 'Uniformes Operacionais',
      investida: 'BOA',
      comprador: 'Ricardo Almeida',
      abertura: '09/11/2026',
      prazo: '19/11/2026 18:00',
      horasRestantes: 79,
      status: 'Em negociação',
      valorEstimado: 148000,
      condicoesSolicitadas: {
        pagamentoPadrao: '30/60 DDL',
        tipoFretePreferencial: 'CIF CD Jundiaí',
        localEntrega: 'CD Jundiaí SP',
        impostosRegra: 'Todos os tributos inclusos',
        validadeMinimaDias: 30,
        observacoesGerais: 'Bordado eletrônico com logo da bandeira incluso.',
      },
      itens: [
        { id: 'IT-49-1', codigo: 'UNI-101', descricao: 'Camisa Polo Piquet PA Bordada Frente de Caixa', quantidade: 3200, unidade: 'UN', especificacao: 'Malha Piquet 50% algodão 50% poliéster antipilling.', precoReferenciaUnit: 34.00 },
        { id: 'IT-49-2', codigo: 'UNI-108', descricao: 'Avental Impermeável Açougue e Peixaria Branco', quantidade: 800, unidade: 'UN', especificacao: 'PVC forrado com CA ativo no MTE.', precoReferenciaUnit: 49.00 },
      ],
      fornecedoresConvidados: [
        { fornecedorId: 'FOR-010', nomeFantasia: 'Kobrasol Uniformes', cnpj: '73.812.900/0001-62', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '15/11/2026 16:10', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-004', nomeFantasia: 'Tinta & Traço Gráfica', cnpj: '91.000.004/0001-25', statusHomologacao: 'Em análise', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '15/11/2026 17:00', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-006', nomeFantasia: 'Casa Nova Utilidades', cnpj: '91.000.006/0001-14', statusHomologacao: 'Aguardando análise', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '15/11/2026 18:10', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-002', nomeFantasia: 'Embalagens Aurora', cnpj: '91.000.002/0001-36', statusHomologacao: 'Homologado', docVencido: true, bloqueado: false, respondeu: false, statusConvite: 'Aguardando resposta' },
        { fornecedorId: 'FOR-012', nomeFantasia: 'EcoPack Bobinas', cnpj: '99.000.123/0001-90', statusHomologacao: 'Convidado', docVencido: false, bloqueado: false, respondeu: false, statusConvite: 'Aguardando resposta' },
      ],
      propostas: [
        {
          id: 'PROP-149-A',
          fornecedorId: 'FOR-010',
          fornecedorNome: 'Kobrasol Uniformes',
          cnpj: '73.812.900/0001-62',
          statusHomologacao: 'Homologado',
          homologado: true,
          docVencido: false,
          enviadaEm: '15/11/2026 16:10',
          condicaoPagamento: '30/60/90 DDL',
          prazoEntregaMedioDias: 15,
          tipoFrete: 'CIF (incluso)',
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 12.0,
          validadeProposta: '30 dias',
          observacoes: 'Grade completa do PP ao EXG pronta para produção.',
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: 'IT-49-1', precoUnitario: 31.40, precoTotal: 100480, aliquotaImpostoPct: 12, prazoEntregaDias: 15, marcaModelo: 'Kobrasol Pro Piquet' },
            { itemId: 'IT-49-2', precoUnitario: 45.90, precoTotal: 36720, aliquotaImpostoPct: 12, prazoEntregaDias: 12, marcaModelo: 'Kobrasol EPI CA 41029' },
          ],
          subtotalItens: 137200,
          totalEqualizado: 137200,
        },
        {
          id: 'PROP-149-B',
          fornecedorId: 'FOR-006',
          fornecedorNome: 'Casa Nova Utilidades',
          cnpj: '91.000.006/0001-14',
          statusHomologacao: 'Aguardando análise',
          homologado: false,
          docVencido: false,
          enviadaEm: '15/11/2026 18:10',
          condicaoPagamento: '28 DDL',
          prazoEntregaMedioDias: 22,
          tipoFrete: 'FOB (por conta do comprador)',
          valorFreteTotal: 3100,
          impostosInclusos: true,
          aliquotaMediaPct: 6.0,
          validadeProposta: '15 dias',
          observacoes: 'Empresa optante pelo Simples Nacional.',
          incompleta: false,
          divergencias: ['Fornecedor ainda Aguardando análise de homologação', 'Prazo de pagamento 28 DDL inferior ao solicitado (30/60 DDL)', 'Frete FOB (+R$ 3,1k)'],
          itens: [
            { itemId: 'IT-49-1', precoUnitario: 32.80, precoTotal: 104960, aliquotaImpostoPct: 6, prazoEntregaDias: 22, marcaModelo: 'Confecção Parceira SP' },
            { itemId: 'IT-49-2', precoUnitario: 47.50, precoTotal: 38000, aliquotaImpostoPct: 6, prazoEntregaDias: 20, marcaModelo: 'ProtCap PVC' },
          ],
          subtotalItens: 142960,
          totalEqualizado: 146060,
        },
      ],
      adjudicacao: {
        modo: 'lote',
        vencedorLoteFornecedorId: 'FOR-010',
        vencedoresPorItem: { 'IT-49-1': 'FOR-010', 'IT-49-2': 'FOR-010' },
        justificativaDecisao: 'Kobrasol Uniformes apresenta o menor preço equalizado, frete CIF, pagamento em 30/60/90 DDL e homologação 100% regular.',
      },
      historico: [
        { id: 'hc-49-1', dataHora: '16/11/2026 09:10', tipo: 'negociacao', titulo: 'Rodada de negociação aberta com Kobrasol', detalhe: 'Obtido parcelamento em 30/60/90 DDL sem acréscimo.', usuario: 'Ricardo Almeida' },
      ],
    },
    {
      id: 'COT-0151',
      titulo: 'Transporte dedicado refrigerado CD Jundiaí para lojas BOA e JPY',
      descricao: 'Contratação de 6 caminhões 3/4 refrigerados com rastreamento para abastecimento diário de FLV e laticínios.',
      categoria: 'Logística',
      subcategoria: 'Fretes e Transporte',
      investida: 'BOA',
      comprador: 'Ricardo Almeida',
      abertura: '12/11/2026',
      prazo: '18/11/2026 12:00',
      horasRestantes: 44,
      status: 'Aberta',
      valorEstimado: 485000,
      condicoesSolicitadas: {
        pagamentoPadrao: '30 DDL quinzenal',
        tipoFretePreferencial: 'Franquia mensal km + diária dedicada',
        localEntrega: 'CD Jundiaí e 36 lojas SP',
        impostosRegra: 'ICMS transporte e seguro RCTR-C inclusos',
        validadeMinimaDias: 60,
        observacoesGerais: 'Frota com idade máxima de 4 anos e termógrafo calibrado.',
      },
      itens: [
        { id: 'IT-51-1', codigo: 'LOG-301', descricao: 'Franquia Mensal Veículo VUC/3/4 Refrigerado (-5°C a +4°C) c/ Motorista', quantidade: 6, unidade: 'VEÍC/MÊS', especificacao: 'Até 5.000 km/mês por veículo.', precoReferenciaUnit: 80800 },
      ],
      fornecedoresConvidados: [
        { fornecedorId: 'FOR-009', nomeFantasia: 'TransRota Logística', cnpj: '55.710.890/0001-40', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '14/11/2026 18:00', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-007', nomeFantasia: 'ClimaFrio Engenharia', cnpj: '82.410.500/0001-55', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: false, statusConvite: 'Visualizado' },
        { fornecedorId: 'FOR-008', nomeFantasia: 'ArTemp Climatização', cnpj: '67.190.220/0001-18', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: false, statusConvite: 'Aguardando resposta' },
      ],
      propostas: [
        {
          id: 'PROP-151-A',
          fornecedorId: 'FOR-009',
          fornecedorNome: 'TransRota Logística',
          cnpj: '55.710.890/0001-40',
          statusHomologacao: 'Homologado',
          homologado: true,
          docVencido: false,
          enviadaEm: '14/11/2026 18:00',
          condicaoPagamento: '30 DDL',
          prazoEntregaMedioDias: 10,
          tipoFrete: 'CIF (incluso)',
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 12.0,
          validadeProposta: '60 dias',
          observacoes: 'Frota 2025 Euro 6 com telemetria de temperatura integrada à torre Plurix.',
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: 'IT-51-1', precoUnitario: 76500, precoTotal: 459000, aliquotaImpostoPct: 12, prazoEntregaDias: 10, marcaModelo: 'Frota Refrigerada Euro 6' },
          ],
          subtotalItens: 459000,
          totalEqualizado: 459000,
        },
      ],
      adjudicacao: {
        modo: 'lote',
        vencedorLoteFornecedorId: 'FOR-009',
        vencedoresPorItem: { 'IT-51-1': 'FOR-009' },
        justificativaDecisao: 'Em coleta de mais propostas até o prazo de 18/11.',
      },
      historico: [
        { id: 'hc-51-1', dataHora: '12/11/2026 10:00', tipo: 'abertura', titulo: 'RFQ publicada', detalhe: 'Aberta para recebimento de propostas no Portal.', usuario: 'Ricardo Almeida' },
      ],
    },
    {
      id: 'COT-0138',
      titulo: 'Bobinas térmicas PDV 80x40m e etiquetas de gôndola',
      descricao: 'Compra consolidada semestral para todas as 178 lojas da Plurix.',
      categoria: 'Embalagens e Insumos',
      subcategoria: 'Sacolas e Bobinas PDV',
      investida: 'PLX',
      comprador: 'Davi Bigotto',
      abertura: '25/10/2026',
      prazo: '08/11/2026 18:00',
      horasRestantes: 0,
      status: 'Encerrada',
      valorEstimado: 265000,
      condicoesSolicitadas: {
        pagamentoPadrao: '60 DDL',
        tipoFretePreferencial: 'CIF CDs regionais',
        localEntrega: 'CDs AMG, BOA, AVE, PRN, SPO e JPY',
        impostosRegra: 'Inclusos',
        validadeMinimaDias: 30,
        observacoesGerais: 'Papel térmico livre de Bisfenol A (BPA Free) com garantia de imagem de 5 anos.',
      },
      itens: [
        { id: 'IT-38-1', codigo: 'PDV-001', descricao: 'Bobina Térmica 80mm x 40m KPH 48g Cx c/ 30 rolos', quantidade: 3500, unidade: 'CX', especificacao: 'BPA Free homologado para impressoras Elgin e Bematech.', precoReferenciaUnit: 75.70 },
      ],
      fornecedoresConvidados: [
        { fornecedorId: 'FOR-002', nomeFantasia: 'Embalagens Aurora', cnpj: '91.000.002/0001-36', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '05/11/2026 14:00', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-004', nomeFantasia: 'Tinta & Traço Gráfica', cnpj: '91.000.004/0001-25', statusHomologacao: 'Em análise', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '06/11/2026 10:30', statusConvite: 'Respondido' },
        { fornecedorId: 'FOR-001', nomeFantasia: 'Pinheiro Distribuidora', cnpj: '91.000.003/0001-80', statusHomologacao: 'Homologado', docVencido: false, bloqueado: false, respondeu: true, dataResposta: '06/11/2026 16:20', statusConvite: 'Respondido' },
      ],
      propostas: [
        {
          id: 'PROP-138-A',
          fornecedorId: 'FOR-002',
          fornecedorNome: 'Embalagens Aurora',
          cnpj: '91.000.002/0001-36',
          statusHomologacao: 'Homologado',
          homologado: true,
          docVencido: false,
          enviadaEm: '05/11/2026 14:00',
          condicaoPagamento: '60 DDL',
          prazoEntregaMedioDias: 5,
          tipoFrete: 'CIF (incluso)',
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 18,
          validadeProposta: '45 dias',
          observacoes: 'Adjudicada com entrega programada.',
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: 'IT-38-1', precoUnitario: 69.80, precoTotal: 244300, aliquotaImpostoPct: 18, prazoEntregaDias: 5, marcaModelo: 'Aurora Thermal KPH' },
          ],
          subtotalItens: 244300,
          totalEqualizado: 244300,
        },
      ],
      adjudicacao: {
        modo: 'lote',
        vencedorLoteFornecedorId: 'FOR-002',
        vencedoresPorItem: { 'IT-38-1': 'FOR-002' },
        justificativaDecisao: 'Adjudicado para Embalagens Aurora por menor custo total e entrega CIF em todos os 6 CDs.',
        aprovadoPor: 'Davi Bigotto',
        aprovadoEm: '09/11/2026 15:00',
      },
      historico: [
        { id: 'hc-38-1', dataHora: '09/11/2026 15:00', tipo: 'encerramento', titulo: 'Cotação adjudicada e encerrada', detalhe: 'Vencedor: Embalagens Aurora (R$ 244,3k vs baseline R$ 265,0k).', usuario: 'Davi Bigotto' },
      ],
    },
    {
      id: 'COT-0154',
      titulo: 'Renovação de links dedicados redundantes para 38 lojas SPO',
      descricao: 'Links IP dedicados 200 Mbps com SLA de 99,8% e failover automático 5G.',
      categoria: 'TI e Telecom',
      subcategoria: 'Links e Conectividade',
      investida: 'SPO',
      comprador: 'Mariana Costa',
      abertura: '16/11/2026',
      prazo: '25/11/2026 18:00',
      horasRestantes: 216,
      status: 'Convite programado',
      valorEstimado: 218000,
      condicoesSolicitadas: {
        pagamentoPadrao: '30 DDL mensal',
        tipoFretePreferencial: 'Instalação inclusa',
        localEntrega: '38 lojas SPO PR/SC',
        impostosRegra: 'ICMS/FUST/FUNTTEL inclusos',
        validadeMinimaDias: 60,
        observacoesGerais: 'Disparo de convites agendado para 17/11 às 08h.',
      },
      itens: [
        { id: 'IT-54-1', codigo: 'TEL-201', descricao: 'Link Dedicado Fibra 200 Mbps Full Duplex c/ Gerência Proativa', quantidade: 38, unidade: 'LINK/MÊS', especificacao: 'Reparo em até 4 horas.', precoReferenciaUnit: 5736.84 },
      ],
      fornecedoresConvidados: [
        { fornecedorId: 'FOR-005', nomeFantasia: 'TecnoServ Informática', cnpj: '91.000.005/0001-70', statusHomologacao: 'Pendente fornecedor', docVencido: true, bloqueado: false, respondeu: false, statusConvite: 'Aguardando resposta' },
      ],
      propostas: [],
      adjudicacao: {
        modo: 'lote',
        vencedorLoteFornecedorId: null,
        vencedoresPorItem: {},
        justificativaDecisao: '',
      },
      historico: [
        { id: 'hc-54-1', dataHora: '16/11/2026 09:00', tipo: 'rascunho', titulo: 'Convite programado para disparo', detalhe: 'Aguardando regularização do CRF/FGTS da TecnoServ.', usuario: 'Mariana Costa' },
      ],
    },
    {
      id: 'COT-0155',
      titulo: 'Adequação civil de docas e niveladoras CD Avenida',
      descricao: 'Escopo técnico em revisão pela Engenharia antes da abertura aos fornecedores.',
      categoria: 'Obras e Engenharia',
      subcategoria: 'Construção Civil e Retrofit',
      investida: 'AVE',
      comprador: 'Ricardo Almeida',
      abertura: '16/11/2026',
      prazo: '30/11/2026 18:00',
      horasRestantes: 336,
      status: 'Rascunho',
      valorEstimado: null,
      condicoesSolicitadas: {
        pagamentoPadrao: 'Medição quinzenal 30 DDL',
        tipoFretePreferencial: 'Material e BDI inclusos',
        localEntrega: 'CD Assis SP (AVE)',
        impostosRegra: 'ISS retido na fonte conforme legislação municipal',
        validadeMinimaDias: 45,
        observacoesGerais: 'Em elaboração.',
      },
      itens: [
        { id: 'IT-55-1', codigo: 'OBR-701', descricao: 'Fornecimento e instalação de niveladora eletro-hidráulica 6 ton', quantidade: 4, unidade: 'UN', especificacao: 'Pestana articulada e guarda-corpo NR-12.', precoReferenciaUnit: 42000 },
      ],
      fornecedoresConvidados: [],
      propostas: [],
      adjudicacao: {
        modo: 'lote',
        vencedorLoteFornecedorId: null,
        vencedoresPorItem: {},
        justificativaDecisao: '',
      },
      historico: [
        { id: 'hc-55-1', dataHora: '16/11/2026 10:15', tipo: 'rascunho', titulo: 'Rascunho iniciado', detalhe: 'Aguardando memorial descritivo final da Engenharia.', usuario: 'Ricardo Almeida' },
      ],
    },
  ],
}
