// src/server.ts
import express2 from "express";
import path2 from "node:path";

// src/gestaoFornecedores.ts
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// src/services/gestaoFornecedores/dados.ts
var SEMENTE_GESTAO_FORNECEDORES = {
  investidas: [
    { sigla: "PLX", razaoSocial: "Plurix Participa\xE7\xF5es e Gest\xE3o S.A.", nomeFantasia: "Plurix Holding", cnpj: "39.410.100/0001-01", uf: "SP", filiais: 2, situacao: "Ativa", cadastro: "10/01/2026" },
    { sigla: "AMG", razaoSocial: "Companhia Sulamericana de Distribui\xE7\xE3o S.A.", nomeFantasia: "Amig\xE3o Supermercados", cnpj: "07.111.222/0001-45", uf: "PR", filiais: 64, situacao: "Ativa", cadastro: "12/01/2026" },
    { sigla: "BOA", razaoSocial: "Supermercados Boa Ltda.", nomeFantasia: "Boa Supermercados", cnpj: "45.888.910/0001-12", uf: "SP", filiais: 19, situacao: "Ativa", cadastro: "12/01/2026" },
    { sigla: "AVE", razaoSocial: "Supermercados Avenida Ltda.", nomeFantasia: "Supermercados Avenida", cnpj: "51.222.333/0001-80", uf: "SP", filiais: 28, situacao: "Ativa", cadastro: "15/01/2026" },
    { sigla: "PRN", razaoSocial: "Paran\xE1 Supermercados Ltda.", nomeFantasia: "Paran\xE1 Supermercados", cnpj: "78.900.120/0001-33", uf: "PR", filiais: 12, situacao: "Ativa", cadastro: "18/01/2026" },
    { sigla: "SPO", razaoSocial: "Superp\xE3o Com\xE9rcio de Alimentos S.A.", nomeFantasia: "Superp\xE3o", cnpj: "81.440.500/0001-90", uf: "PR", filiais: 38, situacao: "Ativa", cadastro: "04/02/2026" },
    { sigla: "JPY", razaoSocial: "Japi Com\xE9rcio Varejista Ltda.", nomeFantasia: "Japi Mercados", cnpj: "62.301.400/0001-09", uf: "SP", filiais: 17, situacao: "Ativa", cadastro: "10/02/2026" }
  ],
  categorias: [
    {
      id: "cat-facilities",
      nome: "Facilities",
      descricao: "Servi\xE7os cont\xEDnuos de apoio operacional \xE0s lojas e centros de distribui\xE7\xE3o.",
      criticidade: "P1",
      slaHomologacaoDias: 5,
      situacao: "Ativa",
      subcategorias: [
        { id: "sub-limpeza", nome: "Limpeza Terceirizada", fornecedoresAtivos: 4, situacao: "Ativa" },
        { id: "sub-seguranca", nome: "Seguran\xE7a Patrimonial", fornecedoresAtivos: 2, situacao: "Ativa" },
        { id: "sub-manutencao", nome: "Manuten\xE7\xE3o e Climatiza\xE7\xE3o", fornecedoresAtivos: 3, situacao: "Ativa" },
        { id: "sub-copa", nome: "Copa e Caf\xE9", fornecedoresAtivos: 2, situacao: "Ativa" }
      ]
    },
    {
      id: "cat-embalagens",
      nome: "Embalagens e Insumos",
      descricao: "Insumos de frente de caixa, padaria, a\xE7ougue, hortifr\xFAti e higieniza\xE7\xE3o t\xE9cnica.",
      criticidade: "P1",
      slaHomologacaoDias: 4,
      situacao: "Ativa",
      subcategorias: [
        { id: "sub-descartaveis", nome: "Descart\xE1veis e Bandejas", fornecedoresAtivos: 4, situacao: "Ativa" },
        { id: "sub-quimicos", nome: "Qu\xEDmicos e Higieniza\xE7\xE3o", fornecedoresAtivos: 3, situacao: "Ativa" },
        { id: "sub-bobinas", nome: "Sacolas e Bobinas PDV", fornecedoresAtivos: 3, situacao: "Ativa" }
      ]
    },
    {
      id: "cat-ti",
      nome: "TI e Telecom",
      descricao: "Hardware de loja, coletores, conectividade, cloud e servi\xE7os gerenciados.",
      criticidade: "P2",
      slaHomologacaoDias: 5,
      situacao: "Ativa",
      subcategorias: [
        { id: "sub-serv-ti", nome: "Servi\xE7os de TI e Suporte", fornecedoresAtivos: 3, situacao: "Ativa" },
        { id: "sub-pdv", nome: "Automa\xE7\xE3o e Frente de Caixa", fornecedoresAtivos: 2, situacao: "Ativa" },
        { id: "sub-telecom", nome: "Links e Conectividade", fornecedoresAtivos: 2, situacao: "Ativa" }
      ]
    },
    {
      id: "cat-logistica",
      nome: "Log\xEDstica",
      descricao: "Transporte entre CDs e lojas, armazenagem refrigerada e movimenta\xE7\xE3o interna.",
      criticidade: "P1",
      slaHomologacaoDias: 5,
      situacao: "Ativa",
      subcategorias: [
        { id: "sub-fretes", nome: "Fretes e Transporte", fornecedoresAtivos: 3, situacao: "Ativa" },
        { id: "sub-armazenagem", nome: "Armazenagem", fornecedoresAtivos: 1, situacao: "Ativa" },
        { id: "sub-empilhadeiras", nome: "Empilhadeiras e Loca\xE7\xE3o", fornecedoresAtivos: 2, situacao: "Ativa" }
      ]
    },
    {
      id: "cat-marketing",
      nome: "Marketing e PDV",
      descricao: "Impress\xE3o de tabloides, comunica\xE7\xE3o visual de g\xF4ndola e enxoval operacional.",
      criticidade: "P3",
      slaHomologacaoDias: 3,
      situacao: "Ativa",
      subcategorias: [
        { id: "sub-grafica", nome: "Gr\xE1fica e Tabloides", fornecedoresAtivos: 2, situacao: "Ativa" },
        { id: "sub-uniformes", nome: "Uniformes Operacionais", fornecedoresAtivos: 2, situacao: "Ativa" }
      ]
    },
    {
      id: "cat-obras",
      nome: "Obras e Engenharia",
      descricao: "Reformas de lojas, retrofit, refrigera\xE7\xE3o industrial e mobili\xE1rio t\xE9cnico.",
      criticidade: "P1",
      slaHomologacaoDias: 7,
      situacao: "Ativa",
      subcategorias: [
        { id: "sub-civil", nome: "Constru\xE7\xE3o Civil e Retrofit", fornecedoresAtivos: 2, situacao: "Ativa" },
        { id: "sub-refrig", nome: "Refrigera\xE7\xE3o Alimentar", fornecedoresAtivos: 2, situacao: "Ativa" }
      ]
    }
  ],
  tiposDocumento: [
    {
      id: "doc-cnpj",
      nome: "Cart\xE3o CNPJ",
      descricao: "Comprovante de inscri\xE7\xE3o e situa\xE7\xE3o cadastral ativa na Receita Federal.",
      validadeDias: null,
      obrigatorio: true,
      categoriasAplicaveis: ["Todas as categorias"],
      investidasAplicaveis: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      situacao: "Ativo"
    },
    {
      id: "doc-contrato",
      nome: "Contrato Social",
      descricao: "Contrato social ou \xFAltima altera\xE7\xE3o consolidada registrada na Junta Comercial.",
      validadeDias: null,
      obrigatorio: true,
      categoriasAplicaveis: ["Todas as categorias"],
      investidasAplicaveis: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      situacao: "Ativo"
    },
    {
      id: "doc-cnd-fed",
      nome: "CND Federal",
      descricao: "Certid\xE3o negativa ou positiva com efeito de negativa de tributos federais e d\xEDvida ativa.",
      validadeDias: 180,
      obrigatorio: true,
      categoriasAplicaveis: ["Todas as categorias"],
      investidasAplicaveis: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      situacao: "Ativo"
    },
    {
      id: "doc-cndt",
      nome: "CNDT",
      descricao: "Certid\xE3o negativa de d\xE9bitos trabalhistas emitida pelo Tribunal Superior do Trabalho.",
      validadeDias: 180,
      obrigatorio: true,
      categoriasAplicaveis: ["Todas as categorias"],
      investidasAplicaveis: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      situacao: "Ativo"
    },
    {
      id: "doc-fgts",
      nome: "CRF/FGTS",
      descricao: "Certificado de regularidade do FGTS emitido pela Caixa Econ\xF4mica Federal.",
      validadeDias: 30,
      obrigatorio: true,
      categoriasAplicaveis: ["Todas as categorias"],
      investidasAplicaveis: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      situacao: "Ativo"
    },
    {
      id: "doc-alvara",
      nome: "Alvar\xE1 de Funcionamento",
      descricao: "Alvar\xE1 municipal de localiza\xE7\xE3o e funcionamento vigente.",
      validadeDias: 365,
      obrigatorio: true,
      categoriasAplicaveis: ["Facilities", "Log\xEDstica", "Obras e Engenharia"],
      investidasAplicaveis: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      situacao: "Ativo"
    },
    {
      id: "doc-estadual",
      nome: "Certid\xE3o Estadual",
      descricao: "Certid\xE3o negativa de d\xE9bitos tribut\xE1rios estaduais (ICMS).",
      validadeDias: 90,
      obrigatorio: false,
      categoriasAplicaveis: ["Embalagens e Insumos", "TI e Telecom", "Marketing e PDV"],
      investidasAplicaveis: ["AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      situacao: "Ativo"
    },
    {
      id: "doc-municipal",
      nome: "Certid\xE3o Municipal",
      descricao: "Certid\xE3o negativa de d\xE9bitos mobili\xE1rios municipais (ISSQN).",
      validadeDias: 90,
      obrigatorio: false,
      categoriasAplicaveis: ["Facilities", "TI e Telecom", "Obras e Engenharia"],
      investidasAplicaveis: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      situacao: "Ativo"
    }
  ],
  regrasHomologacao: [
    {
      id: "reg-01",
      codigo: "RGH-01",
      titulo: "Exig\xEAncia de regularidade fiscal para adjudica\xE7\xE3o",
      descricao: "Fornecedor s\xF3 pode ser declarado vencedor definitivo na cota\xE7\xE3o se Cart\xE3o CNPJ, CND Federal, CNDT e CRF/FGTS estiverem v\xE1lidos.",
      escopo: "Todas as investidas (PLX)",
      valorParametro: "Obrigat\xF3rio na adjudica\xE7\xE3o",
      ativa: true
    },
    {
      id: "reg-02",
      codigo: "RGH-02",
      titulo: "Participa\xE7\xE3o de fornecedor com homologa\xE7\xE3o em an\xE1lise na RFQ",
      descricao: "Permite convidar fornecedor em fase de homologa\xE7\xE3o para responder cota\xE7\xE3o, travando o fechamento do pedido at\xE9 aprova\xE7\xE3o final.",
      escopo: "Categorias P2 e P3",
      valorParametro: "Permitido com trava no pedido",
      ativa: true
    },
    {
      id: "reg-03",
      codigo: "RGH-03",
      titulo: "Alerta preventivo de vencimento documental",
      descricao: "Dispara aviso na fila Precisa de aten\xE7\xE3o e notifica o fornecedor no Portal do Fornecedor antes do vencimento da certid\xE3o.",
      escopo: "Todas as categorias",
      valorParametro: "30 dias antes do vencimento",
      ativa: true
    },
    {
      id: "reg-04",
      codigo: "RGH-04",
      titulo: "M\xEDnimo de propostas v\xE1lidas para encerramento sem justificativa",
      descricao: "Cota\xE7\xF5es acima de R$ 50k exigem no m\xEDnimo 3 propostas compar\xE1veis ou justificativa formal de fornecedor \xFAnico ou urg\xEAncia.",
      escopo: "Acima de R$ 50k",
      valorParametro: "3 propostas m\xEDnimas",
      ativa: true
    },
    {
      id: "reg-05",
      codigo: "RGH-05",
      titulo: "Portal do Fornecedor para autosservi\xE7o externo",
      descricao: "Gera link \xFAnico autentic\xE1vel por token para que o fornecedor convidado envie certid\xF5es, atualize dados banc\xE1rios e responda RFQs.",
      escopo: "Todas as investidas (PLX)",
      valorParametro: "Habilitado com token de 15 dias",
      ativa: true
    }
  ],
  usuarios: [
    { id: "usr-01", nome: "Davi Bigotto", email: "davi.bigotto@plurix.com.br", papel: "Administrador", investidas: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"], situacao: "Ativo", ultimoAcesso: "16/11/2026 10:45" },
    { id: "usr-02", nome: "Mariana Costa", email: "mariana.costa@plurix.com.br", papel: "Comprador", investidas: ["AMG", "PRN", "SPO"], situacao: "Ativo", ultimoAcesso: "16/11/2026 09:30" },
    { id: "usr-03", nome: "Ricardo Almeida", email: "ricardo.almeida@plurix.com.br", papel: "Comprador", investidas: ["BOA", "AVE", "JPY"], situacao: "Ativo", ultimoAcesso: "16/11/2026 10:12" },
    { id: "usr-04", nome: "Fernanda Ribeiro", email: "fernanda.ribeiro@plurix.com.br", papel: "Analista de homologa\xE7\xE3o", investidas: ["PLX", "AMG", "BOA", "AVE", "PRN", "SPO", "JPY"], situacao: "Ativo", ultimoAcesso: "16/11/2026 10:40" },
    { id: "usr-05", nome: "Carlos Eduardo", email: "carlos.eduardo@plurix.com.br", papel: "Gestor", investidas: ["PLX"], situacao: "Ativo", ultimoAcesso: "15/11/2026 18:20" },
    { id: "usr-06", nome: "Juliana Mendes", email: "juliana.mendes@plurix.com.br", papel: "Consulta", investidas: ["BOA", "JPY"], situacao: "Ativo", ultimoAcesso: "14/11/2026 16:05" }
  ],
  fornecedores: [
    {
      id: "FOR-001",
      razaoSocial: "Distribuidora Pinheiro & Filhos Higiene Profissional Ltda.",
      nomeFantasia: "Pinheiro Distribuidora",
      cnpj: "91.000.003/0001-80",
      inscricaoEstadual: "336.118.920.114",
      regimeTributario: "Lucro Real",
      porte: "M\xE9dio Porte",
      categoriaId: "cat-embalagens",
      categoria: "Embalagens e Insumos",
      subcategoria: "Qu\xEDmicos e Higieniza\xE7\xE3o",
      cidade: "Hortol\xE2ndia",
      uf: "SP",
      endereco: "Av. da Emancipa\xE7\xE3o, 2450, Distrito Industrial",
      cep: "13184-010",
      contatoComercial: { nome: "Roberto Pinheiro", email: "comercial@pinheirodist.com.br", telefone: "(19) 3865-4400", cargo: "Gerente de Contas Key Account" },
      contatoFinanceiro: { nome: "Patr\xEDcia Lopes", email: "nfe@pinheirodist.com.br", banco: "341 Ita\xFA", agencia: "0412", conta: "99124-5", pix: "91.000.003/0001-80" },
      socios: ["Ant\xF4nio Pinheiro Neto", "Roberto Pinheiro"],
      investidasHomologadas: ["AMG", "BOA", "AVE"],
      statusHomologacao: "Homologado",
      statusDocumental: "Com vencidos",
      docsVencidos: 1,
      docsVencendo30d: 1,
      docsPendentes: 0,
      elegibilidade: "Com ressalva",
      bloqueado: false,
      notaHomologacao: 88,
      ultimaAtualizacao: "15/11/2026",
      portalToken: "plx-portal-pinheiro-91000003",
      documentos: [
        { id: "d-101", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "10/01/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cartao_cnpj_pinheiro_2026.pdf", tamanhoKb: 245, ultimaAtualizacao: "10/01/2026", observacaoAnalista: "Inscri\xE7\xE3o ativa conferida na Receita Federal." },
        { id: "d-102", tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "14/03/2024", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "4a_alteracao_social_pinheiro.pdf", tamanhoKb: 1840, ultimaAtualizacao: "12/01/2026", observacaoAnalista: "Quadro societ\xE1rio e poderes de assinatura validados." },
        { id: "d-103", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "27/04/2026", validade: "24/10/2026", diasParaVencer: -23, status: "vencido", arquivo: "cnd_federal_pinheiro_abr26.pdf", tamanhoKb: 410, ultimaAtualizacao: "24/10/2026", observacaoAnalista: "Certid\xE3o vencida h\xE1 23 dias. Solicitar renova\xE7\xE3o antes de liberar novo pedido." },
        { id: "d-104", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "10/08/2026", validade: "06/02/2027", diasParaVencer: 82, status: "valido", arquivo: "cndt_tst_pinheiro_ago26.pdf", tamanhoKb: 320, ultimaAtualizacao: "10/08/2026", observacaoAnalista: "Nada consta trabalhista regular." },
        { id: "d-105", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "28/10/2026", validade: "26/11/2026", diasParaVencer: 10, status: "proximo_vencimento", arquivo: "crf_fgts_pinheiro_out26.pdf", tamanhoKb: 290, ultimaAtualizacao: "28/10/2026", observacaoAnalista: "Vence em 10 dias. Alerta preventivo enviado ao portal." }
      ],
      historico: [
        { id: "h-1", dataHora: "15/11/2026 14:10", tipo: "cotacao", titulo: "Proposta enviada na RFQ COT-0142", detalhe: "Fornecedor enviou proposta comercial para Materiais de limpeza, reposi\xE7\xE3o trimestral.", usuario: "Portal do Fornecedor" },
        { id: "h-2", dataHora: "24/10/2026 08:00", tipo: "alerta", titulo: "Documento vencido detectado", detalhe: "CND Federal atingiu a data de vencimento (24/10/2026).", usuario: "Rotina Autom\xE1tica PLX" },
        { id: "h-3", dataHora: "18/01/2026 11:30", tipo: "homologacao", titulo: "Homologa\xE7\xE3o aprovada para AMG, BOA e AVE", detalhe: "Parecer favor\xE1vel emitido ap\xF3s confer\xEAncia documental e financeira.", usuario: "Fernanda Ribeiro" },
        { id: "h-4", dataHora: "10/01/2026 09:15", tipo: "convite", titulo: "Fornecedor convidado e cadastro conclu\xEDdo", detalhe: "Cadastro completo submetido via Portal do Fornecedor.", usuario: "Davi Bigotto" }
      ]
    },
    {
      id: "FOR-002",
      razaoSocial: "Embalagens Aurora Ind\xFAstria Pl\xE1stica e Celulose Ltda.",
      nomeFantasia: "Embalagens Aurora",
      cnpj: "91.000.002/0001-36",
      inscricaoEstadual: "671.092.411.119",
      regimeTributario: "Lucro Real",
      porte: "Grande Porte",
      categoriaId: "cat-embalagens",
      nomeCategoria: "Embalagens e Insumos",
      categoria: "Embalagens e Insumos",
      subcategoria: "Descart\xE1veis e Bandejas",
      cidade: "Sumar\xE9",
      uf: "SP",
      endereco: "Rod. Anhanguera, km 112, Polo Industrial",
      cep: "13178-900",
      contatoComercial: { nome: "Luciana Martins", email: "luciana@embalagensaurora.com.br", telefone: "(19) 3873-9000", cargo: "Diretora Comercial Varejo" },
      contatoFinanceiro: { nome: "Marcos Viana", email: "financeiro@embalagensaurora.com.br", banco: "237 Bradesco", agencia: "1290", conta: "44501-2", pix: "91.000.002/0001-36" },
      socios: ["Aurora Participa\xE7\xF5es Industriais S.A."],
      investidasHomologadas: ["AMG", "BOA", "AVE", "PRN", "SPO", "JPY"],
      statusHomologacao: "Homologado",
      statusDocumental: "Com vencidos",
      docsVencidos: 1,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: "Com ressalva",
      bloqueado: false,
      notaHomologacao: 94,
      ultimaAtualizacao: "14/11/2026",
      portalToken: "plx-portal-aurora-91000002",
      documentos: [
        { id: "d-201", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "05/01/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cnpj_aurora_ind.pdf", tamanhoKb: 210, ultimaAtualizacao: "05/01/2026", observacaoAnalista: "Regular." },
        { id: "d-202", tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "20/09/2025", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "estatuto_aurora_2025.pdf", tamanhoKb: 2150, ultimaAtualizacao: "05/01/2026", observacaoAnalista: "Regular." },
        { id: "d-203", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "15/07/2026", validade: "11/01/2027", diasParaVencer: 56, status: "valido", arquivo: "cnd_federal_aurora.pdf", tamanhoKb: 380, ultimaAtualizacao: "15/07/2026", observacaoAnalista: "Regular." },
        { id: "d-204", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "01/08/2026", validade: "28/01/2027", diasParaVencer: 73, status: "valido", arquivo: "cndt_aurora.pdf", tamanhoKb: 340, ultimaAtualizacao: "01/08/2026", observacaoAnalista: "Regular." },
        { id: "d-205", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "14/10/2026", validade: "13/11/2026", diasParaVencer: -3, status: "vencido", arquivo: "crf_fgts_aurora_out26.pdf", tamanhoKb: 280, ultimaAtualizacao: "13/11/2026", observacaoAnalista: "CRF/FGTS vencido h\xE1 3 dias. Renova\xE7\xE3o autom\xE1tica Caixa solicitada." }
      ],
      historico: [
        { id: "h-201", dataHora: "14/11/2026 16:40", tipo: "cotacao", titulo: "Proposta enviada na RFQ COT-0142", detalhe: "Proposta completa com frete CIF para todas as lojas do AMG e do BOA.", usuario: "Portal do Fornecedor" },
        { id: "h-202", dataHora: "13/11/2026 08:00", tipo: "alerta", titulo: "CRF/FGTS vencido h\xE1 3 dias", detalhe: "Notifica\xE7\xE3o autom\xE1tica enviada para luciana@embalagensaurora.com.br.", usuario: "Rotina Autom\xE1tica PLX" }
      ]
    },
    {
      id: "FOR-003",
      razaoSocial: "Limpeza Brilhante Servi\xE7os e Produtos de Higiene Ltda.",
      nomeFantasia: "Limpeza Brilhante",
      cnpj: "91.000.001/0001-91",
      inscricaoEstadual: "114.889.012.110",
      regimeTributario: "Lucro Presumido",
      porte: "M\xE9dio Porte",
      categoriaId: "cat-facilities",
      categoria: "Facilities",
      subcategoria: "Limpeza Terceirizada",
      cidade: "Campinas",
      uf: "SP",
      endereco: "Rua Concei\xE7\xE3o, 890, Centro Empresarial",
      cep: "13010-916",
      contatoComercial: { nome: "S\xE9rgio Cavalcanti", email: "sergio@limpezabrilhante.com.br", telefone: "(19) 3231-7788", cargo: "S\xF3cio Diretor" },
      contatoFinanceiro: { nome: "Aline Prado", email: "faturamento@limpezabrilhante.com.br", banco: "033 Santander", agencia: "3104", conta: "1300492-9", pix: "91.000.001/0001-91" },
      socios: ["S\xE9rgio Cavalcanti", "Helena Cavalcanti"],
      investidasHomologadas: ["AMG", "BOA", "JPY"],
      statusHomologacao: "Homologado",
      statusDocumental: "Completo",
      docsVencidos: 0,
      docsVencendo30d: 1,
      docsPendentes: 0,
      elegibilidade: "Apto",
      bloqueado: false,
      notaHomologacao: 96,
      ultimaAtualizacao: "15/11/2026",
      portalToken: "plx-portal-brilhante-91000001",
      documentos: [
        { id: "d-301", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "02/02/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cnpj_brilhante.pdf", tamanhoKb: 220, ultimaAtualizacao: "02/02/2026", observacaoAnalista: "V\xE1lido." },
        { id: "d-302", tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "10/05/2025", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "contrato_social_brilhante.pdf", tamanhoKb: 1520, ultimaAtualizacao: "02/02/2026", observacaoAnalista: "V\xE1lido." },
        { id: "d-303", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "19/08/2026", validade: "15/02/2027", diasParaVencer: 91, status: "valido", arquivo: "cnd_federal_brilhante.pdf", tamanhoKb: 390, ultimaAtualizacao: "19/08/2026", observacaoAnalista: "V\xE1lido." },
        { id: "d-304", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "22/08/2026", validade: "18/02/2027", diasParaVencer: 94, status: "valido", arquivo: "cndt_brilhante.pdf", tamanhoKb: 310, ultimaAtualizacao: "22/08/2026", observacaoAnalista: "V\xE1lido." },
        { id: "d-305", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "02/11/2026", validade: "02/12/2026", diasParaVencer: 16, status: "proximo_vencimento", arquivo: "crf_fgts_brilhante_nov26.pdf", tamanhoKb: 270, ultimaAtualizacao: "02/11/2026", observacaoAnalista: "V\xE1lido, vence em 16 dias." },
        { id: "d-306", tipoId: "doc-alvara", tipoNome: "Alvar\xE1 de Funcionamento", obrigatorio: true, emissao: "10/03/2026", validade: "10/03/2027", diasParaVencer: 114, status: "valido", arquivo: "alvara_campinas_brilhante.pdf", tamanhoKb: 510, ultimaAtualizacao: "10/03/2026", observacaoAnalista: "Alvar\xE1 municipal vigente." }
      ],
      historico: [
        { id: "h-301", dataHora: "15/11/2026 09:45", tipo: "cotacao", titulo: "Proposta comercial enviada na RFQ COT-0142", detalhe: "Menor pre\xE7o global identificado na abertura preliminar.", usuario: "Portal do Fornecedor" },
        { id: "h-302", dataHora: "02/11/2026 10:20", tipo: "documento", titulo: "CRF/FGTS renovado pelo fornecedor", detalhe: "Nova certid\xE3o v\xE1lida at\xE9 02/12/2026 aprovada.", usuario: "Fernanda Ribeiro" }
      ]
    },
    {
      id: "FOR-004",
      razaoSocial: "Tinta & Tra\xE7o Ind\xFAstria Gr\xE1fica e Editorial Ltda.",
      nomeFantasia: "Tinta & Tra\xE7o Gr\xE1fica",
      cnpj: "91.000.004/0001-25",
      inscricaoEstadual: "908.114.225.001",
      regimeTributario: "Lucro Presumido",
      porte: "M\xE9dio Porte",
      categoriaId: "cat-marketing",
      categoria: "Marketing e PDV",
      subcategoria: "Gr\xE1fica e Tabloides",
      cidade: "Maring\xE1",
      uf: "PR",
      endereco: "Av. Colombo, 5810, Zona 07",
      cep: "87020-000",
      contatoComercial: { nome: "Cl\xE1udio Nogueira", email: "claudio@tintaetraco.com.br", telefone: "(44) 3028-5500", cargo: "Executivo de Contas Varejo" },
      contatoFinanceiro: { nome: "Renata Nogueira", email: "fin@tintaetraco.com.br", banco: "748 Sicredi", agencia: "0718", conta: "55210-8", pix: "91.000.004/0001-25" },
      socios: ["Cl\xE1udio Nogueira", "Renata Nogueira"],
      investidasHomologadas: ["AMG", "PRN"],
      statusHomologacao: "Em an\xE1lise",
      statusDocumental: "Em valida\xE7\xE3o",
      docsVencidos: 0,
      docsVencendo30d: 1,
      docsPendentes: 0,
      elegibilidade: "Com ressalva",
      bloqueado: false,
      notaHomologacao: null,
      ultimaAtualizacao: "16/11/2026",
      portalToken: "plx-portal-tintatraco-91000004",
      documentos: [
        { id: "d-401", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "14/11/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cartao_cnpj_tintatraco.pdf", tamanhoKb: 230, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Conferido com CNAE de impress\xE3o de material publicit\xE1rio." },
        { id: "d-402", tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "12/08/2024", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "contrato_social_tintatraco.pdf", tamanhoKb: 1680, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Altera\xE7\xE3o consolidada v\xE1lida." },
        { id: "d-403", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "05/06/2026", validade: "02/12/2026", diasParaVencer: 16, status: "proximo_vencimento", arquivo: "cnd_fed_tintatraco.pdf", tamanhoKb: 395, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Positiva com efeito de negativa, vence em 16 dias." },
        { id: "d-404", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "10/11/2026", validade: "09/05/2027", diasParaVencer: 174, status: "valido", arquivo: "cndt_tintatraco_nov26.pdf", tamanhoKb: 310, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Certid\xE3o trabalhista validada." },
        { id: "d-405", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "01/11/2026", validade: "30/11/2026", diasParaVencer: 14, status: "em_analise", arquivo: "crf_fgts_tintatraco_nov26.pdf", tamanhoKb: 275, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Aguardando confer\xEAncia do c\xF3digo de autenticidade na Caixa." }
      ],
      historico: [
        { id: "h-401", dataHora: "14/11/2026 15:20", tipo: "homologacao", titulo: "An\xE1lise iniciada para expans\xE3o ao SPO e BOA", detalhe: "Documentos enviados pelo fornecedor entraram em an\xE1lise t\xE9cnica.", usuario: "Fernanda Ribeiro" }
      ]
    },
    {
      id: "FOR-005",
      razaoSocial: "TecnoServ Solu\xE7\xF5es em Infraestrutura e Redes Ltda.",
      nomeFantasia: "TecnoServ Inform\xE1tica",
      cnpj: "91.000.005/0001-70",
      inscricaoEstadual: "122.450.890.111",
      regimeTributario: "Lucro Presumido",
      porte: "M\xE9dio Porte",
      categoriaId: "cat-ti",
      categoria: "TI e Telecom",
      subcategoria: "Servi\xE7os de TI e Suporte",
      cidade: "S\xE3o Paulo",
      uf: "SP",
      endereco: "Av. Eng. Lu\xEDs Carlos Berrini, 1681, Conj. 92",
      cep: "04571-011",
      contatoComercial: { nome: "Andr\xE9 Vasconcelos", email: "andre@tecnoservti.com.br", telefone: "(11) 3045-8800", cargo: "Gerente de Neg\xF3cios B2B" },
      contatoFinanceiro: { nome: "Camila Rocha", email: "cob@tecnoservti.com.br", banco: "341 Ita\xFA", agencia: "8210", conta: "19200-4", pix: "91.000.005/0001-70" },
      socios: ["Andr\xE9 Vasconcelos", "Paulo Henrique Dias"],
      investidasHomologadas: [],
      statusHomologacao: "Pendente fornecedor",
      statusDocumental: "Rejeitado",
      docsVencidos: 1,
      docsVencendo30d: 0,
      docsPendentes: 1,
      elegibilidade: "Impedido",
      bloqueado: false,
      notaHomologacao: null,
      ultimaAtualizacao: "14/11/2026",
      portalToken: "plx-portal-tecnoserv-91000005",
      documentos: [
        { id: "d-501", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "12/11/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cnpj_tecnoserv.pdf", tamanhoKb: 240, ultimaAtualizacao: "12/11/2026", observacaoAnalista: "Regular." },
        { id: "d-502", tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "04/04/2023", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "contrato_tecnoserv.pdf", tamanhoKb: 1920, ultimaAtualizacao: "12/11/2026", observacaoAnalista: "Regular." },
        { id: "d-503", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "10/09/2026", validade: "09/03/2027", diasParaVencer: 113, status: "valido", arquivo: "cnd_fed_tecnoserv.pdf", tamanhoKb: 360, ultimaAtualizacao: "12/11/2026", observacaoAnalista: "Regular." },
        { id: "d-504", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "11/11/2026", validade: "10/05/2027", diasParaVencer: 175, status: "valido", arquivo: "cndt_tecnoserv.pdf", tamanhoKb: 305, ultimaAtualizacao: "12/11/2026", observacaoAnalista: "Regular." },
        { id: "d-505", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "01/09/2026", validade: "30/09/2026", diasParaVencer: -47, status: "rejeitado", arquivo: "crf_fgts_tecnoserv_set26.pdf", tamanhoKb: 265, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Documento reprovado: o arquivo anexado refere-se \xE0 compet\xEAncia de setembro e est\xE1 vencido. Anexar CRF vigente." }
      ],
      historico: [
        { id: "h-501", dataHora: "14/11/2026 11:15", tipo: "rejeicao", titulo: "Devolvida ao fornecedor por pend\xEAncia em CRF/FGTS", detalhe: "Solicitada substitui\xE7\xE3o do CRF/FGTS vencido via Portal do Fornecedor.", usuario: "Fernanda Ribeiro" },
        { id: "h-502", dataHora: "12/11/2026 16:00", tipo: "documento", titulo: "Documenta\xE7\xE3o inicial submetida", detalhe: "Fornecedor enviou 5 documentos para homologa\xE7\xE3o em BOA e AVE.", usuario: "Portal do Fornecedor" }
      ]
    },
    {
      id: "FOR-006",
      razaoSocial: "Casa Nova Utilidades e Suprimentos Corporativos Ltda.",
      nomeFantasia: "Casa Nova Utilidades",
      cnpj: "91.000.006/0001-14",
      inscricaoEstadual: "145.998.312.118",
      regimeTributario: "Simples Nacional",
      porte: "EPP",
      categoriaId: "cat-facilities",
      categoria: "Facilities",
      subcategoria: "Copa e Caf\xE9",
      cidade: "S\xE3o Paulo",
      uf: "SP",
      endereco: "Rua Cl\xE9lia, 1420, Lapa",
      cep: "05042-000",
      contatoComercial: { nome: "Beatriz Sampaio", email: "beatriz@casanovautil.com.br", telefone: "(11) 3862-1190", cargo: "Gerente Comercial" },
      contatoFinanceiro: { nome: "Beatriz Sampaio", email: "financeiro@casanovautil.com.br", banco: "001 Banco do Brasil", agencia: "1892-4", conta: "77410-1", pix: "91.000.006/0001-14" },
      socios: ["Beatriz Sampaio"],
      investidasHomologadas: [],
      statusHomologacao: "Aguardando an\xE1lise",
      statusDocumental: "Em valida\xE7\xE3o",
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: "Com ressalva",
      bloqueado: false,
      notaHomologacao: null,
      ultimaAtualizacao: "15/11/2026",
      portalToken: "plx-portal-casanova-91000006",
      documentos: [
        { id: "d-601", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "14/11/2026", validade: "Sem validade", diasParaVencer: null, status: "em_analise", arquivo: "cnpj_casanova.pdf", tamanhoKb: 215, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Aguardando triagem da fila." },
        { id: "d-602", tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "19/02/2022", validade: "Sem validade", diasParaVencer: null, status: "em_analise", arquivo: "contrato_casanova.pdf", tamanhoKb: 1410, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Aguardando triagem da fila." },
        { id: "d-603", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "01/10/2026", validade: "30/03/2027", diasParaVencer: 134, status: "em_analise", arquivo: "cnd_fed_casanova.pdf", tamanhoKb: 380, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Aguardando triagem da fila." },
        { id: "d-604", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "05/10/2026", validade: "03/04/2027", diasParaVencer: 138, status: "em_analise", arquivo: "cndt_casanova.pdf", tamanhoKb: 295, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Aguardando triagem da fila." },
        { id: "d-605", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "10/11/2026", validade: "09/12/2026", diasParaVencer: 23, status: "em_analise", arquivo: "crf_fgts_casanova.pdf", tamanhoKb: 260, ultimaAtualizacao: "14/11/2026", observacaoAnalista: "Aguardando triagem da fila." }
      ],
      historico: [
        { id: "h-601", dataHora: "14/11/2026 17:30", tipo: "homologacao", titulo: "Submiss\xE3o completa enviada pelo fornecedor", detalhe: "Fornecedor finalizou o preenchimento no Portal do Fornecedor e entrou na fila Aguardando an\xE1lise.", usuario: "Portal do Fornecedor" }
      ]
    },
    {
      id: "FOR-007",
      razaoSocial: "ClimaFrio Engenharia T\xE9rmica e Refrigera\xE7\xE3o Industrial S.A.",
      nomeFantasia: "ClimaFrio Engenharia",
      cnpj: "82.410.500/0001-55",
      inscricaoEstadual: "901.442.810-00",
      regimeTributario: "Lucro Real",
      porte: "Grande Porte",
      categoriaId: "cat-facilities",
      categoria: "Facilities",
      subcategoria: "Manuten\xE7\xE3o e Climatiza\xE7\xE3o",
      cidade: "Curitiba",
      uf: "PR",
      endereco: "Rua Jo\xE3o Bettega, 3100, CIC",
      cep: "81350-000",
      contatoComercial: { nome: "Eng. Gustavo Klabin", email: "gustavo@climafrio.eng.br", telefone: "(41) 3347-2000", cargo: "Diretor de Contratos" },
      contatoFinanceiro: { nome: "Eliane Borges", email: "financeiro@climafrio.eng.br", banco: "341 Ita\xFA", agencia: "3812", conta: "10098-1", pix: "82.410.500/0001-55" },
      socios: ["Gustavo Klabin", "Henrique Klabin"],
      investidasHomologadas: ["AMG", "BOA", "AVE", "PRN", "SPO"],
      statusHomologacao: "Homologado",
      statusDocumental: "Completo",
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: "Apto",
      bloqueado: false,
      notaHomologacao: 98,
      ultimaAtualizacao: "15/11/2026",
      portalToken: "plx-portal-climafrio-82410500",
      documentos: [
        { id: "d-701", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "10/01/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cnpj_climafrio.pdf", tamanhoKb: 225, ultimaAtualizacao: "10/01/2026", observacaoAnalista: "Regular." },
        { id: "d-702", tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "18/04/2025", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "estatuto_climafrio.pdf", tamanhoKb: 2400, ultimaAtualizacao: "10/01/2026", observacaoAnalista: "Regular." },
        { id: "d-703", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "01/09/2026", validade: "28/02/2027", diasParaVencer: 104, status: "valido", arquivo: "cnd_fed_climafrio.pdf", tamanhoKb: 390, ultimaAtualizacao: "01/09/2026", observacaoAnalista: "Regular." },
        { id: "d-704", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "05/09/2026", validade: "04/03/2027", diasParaVencer: 108, status: "valido", arquivo: "cndt_climafrio.pdf", tamanhoKb: 315, ultimaAtualizacao: "05/09/2026", observacaoAnalista: "Regular." },
        { id: "d-705", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "05/11/2026", validade: "05/12/2026", diasParaVencer: 19, status: "valido", arquivo: "crf_fgts_climafrio.pdf", tamanhoKb: 270, ultimaAtualizacao: "05/11/2026", observacaoAnalista: "Regular." },
        { id: "d-706", tipoId: "doc-alvara", tipoNome: "Alvar\xE1 de Funcionamento", obrigatorio: true, emissao: "15/02/2026", validade: "15/02/2027", diasParaVencer: 91, status: "valido", arquivo: "alvara_climafrio_curitiba.pdf", tamanhoKb: 480, ultimaAtualizacao: "15/02/2026", observacaoAnalista: "Regular." }
      ],
      historico: [
        { id: "h-701", dataHora: "15/11/2026 11:00", tipo: "cotacao", titulo: "Proposta enviada na RFQ COT-0147", detalhe: "Proposta t\xE9cnica e comercial enviada para manuten\xE7\xE3o preventiva de HVAC.", usuario: "Portal do Fornecedor" }
      ]
    },
    {
      id: "FOR-008",
      razaoSocial: "ArTemp Sistemas de Climatiza\xE7\xE3o Comercial Ltda.",
      nomeFantasia: "ArTemp Climatiza\xE7\xE3o",
      cnpj: "67.190.220/0001-18",
      inscricaoEstadual: "244.819.002.115",
      regimeTributario: "Lucro Presumido",
      porte: "M\xE9dio Porte",
      categoriaId: "cat-facilities",
      categoria: "Facilities",
      subcategoria: "Manuten\xE7\xE3o e Climatiza\xE7\xE3o",
      cidade: "Londrina",
      uf: "PR",
      endereco: "Av. Tiradentes, 1920, Jardim Shangri-l\xE1",
      cep: "86070-545",
      contatoComercial: { nome: "Marcelo Tavares", email: "marcelo@artemp.com.br", telefone: "(43) 3328-9100", cargo: "Gerente T\xE9cnico Comercial" },
      contatoFinanceiro: { nome: "Simone Tavares", email: "adm@artemp.com.br", banco: "341 Ita\xFA", agencia: "0194", conta: "33812-0", pix: "67.190.220/0001-18" },
      socios: ["Marcelo Tavares", "Simone Tavares"],
      investidasHomologadas: ["AMG", "PRN"],
      statusHomologacao: "Homologado",
      statusDocumental: "Completo",
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: "Apto",
      bloqueado: false,
      notaHomologacao: 91,
      ultimaAtualizacao: "15/11/2026",
      portalToken: "plx-portal-artemp-67190220",
      documentos: [
        { id: "d-801", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "12/02/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cnpj_artemp.pdf", tamanhoKb: 210, ultimaAtualizacao: "12/02/2026", observacaoAnalista: "Regular." },
        { id: "d-802", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "20/08/2026", validade: "16/02/2027", diasParaVencer: 92, status: "valido", arquivo: "cnd_fed_artemp.pdf", tamanhoKb: 375, ultimaAtualizacao: "20/08/2026", observacaoAnalista: "Regular." },
        { id: "d-803", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "18/08/2026", validade: "14/02/2027", diasParaVencer: 90, status: "valido", arquivo: "cndt_artemp.pdf", tamanhoKb: 300, ultimaAtualizacao: "18/08/2026", observacaoAnalista: "Regular." },
        { id: "d-804", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "04/11/2026", validade: "04/12/2026", diasParaVencer: 18, status: "valido", arquivo: "crf_fgts_artemp.pdf", tamanhoKb: 265, ultimaAtualizacao: "04/11/2026", observacaoAnalista: "Regular." }
      ],
      historico: [
        { id: "h-801", dataHora: "15/11/2026 15:40", tipo: "cotacao", titulo: "Convidado na RFQ COT-0147 (ainda sem resposta)", detalhe: "Lembrete autom\xE1tico de prazo enviado em 16/11.", usuario: "Mariana Costa" }
      ]
    },
    {
      id: "FOR-009",
      razaoSocial: "TransRota Log\xEDstica Refrigerada e Seca S.A.",
      nomeFantasia: "TransRota Log\xEDstica",
      cnpj: "55.710.890/0001-40",
      inscricaoEstadual: "790.221.300.112",
      regimeTributario: "Lucro Real",
      porte: "Grande Porte",
      categoriaId: "cat-logistica",
      categoria: "Log\xEDstica",
      subcategoria: "Fretes e Transporte",
      cidade: "Jundia\xED",
      uf: "SP",
      endereco: "Rod. Dom Gabriel Paulino Bueno Couto, km 68",
      cep: "13212-240",
      contatoComercial: { nome: "Rodrigo Peixoto", email: "rodrigo@transrota.com.br", telefone: "(11) 4582-6000", cargo: "Head Comercial Dedicados" },
      contatoFinanceiro: { nome: "Vanessa Lima", email: "cte@transrota.com.br", banco: "237 Bradesco", agencia: "0891", conta: "88210-9", pix: "55.710.890/0001-40" },
      socios: ["Grupo TransRota Brasil S.A."],
      investidasHomologadas: ["BOA", "AVE", "JPY", "AMG"],
      statusHomologacao: "Homologado",
      statusDocumental: "Completo",
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: "Apto",
      bloqueado: false,
      notaHomologacao: 95,
      ultimaAtualizacao: "14/11/2026",
      portalToken: "plx-portal-transrota-55710890",
      documentos: [
        { id: "d-901", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "08/01/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cnpj_transrota.pdf", tamanhoKb: 230, ultimaAtualizacao: "08/01/2026", observacaoAnalista: "Regular." },
        { id: "d-902", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "12/09/2026", validade: "11/03/2027", diasParaVencer: 115, status: "valido", arquivo: "cnd_fed_transrota.pdf", tamanhoKb: 400, ultimaAtualizacao: "12/09/2026", observacaoAnalista: "Regular." },
        { id: "d-903", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "15/09/2026", validade: "14/03/2027", diasParaVencer: 118, status: "valido", arquivo: "cndt_transrota.pdf", tamanhoKb: 310, ultimaAtualizacao: "15/09/2026", observacaoAnalista: "Regular." },
        { id: "d-904", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "06/11/2026", validade: "06/12/2026", diasParaVencer: 20, status: "valido", arquivo: "crf_fgts_transrota.pdf", tamanhoKb: 270, ultimaAtualizacao: "06/11/2026", observacaoAnalista: "Regular." }
      ],
      historico: [
        { id: "h-901", dataHora: "14/11/2026 18:00", tipo: "cotacao", titulo: "Proposta enviada na RFQ COT-0151", detalhe: "Proposta para rota CD Jundia\xED para lojas BOA e JPY.", usuario: "Portal do Fornecedor" }
      ]
    },
    {
      id: "FOR-010",
      razaoSocial: "Kobrasol Confec\xE7\xF5es Profissionais e EPIs Ltda.",
      nomeFantasia: "Kobrasol Uniformes",
      cnpj: "73.812.900/0001-62",
      inscricaoEstadual: "254.119.882",
      regimeTributario: "Lucro Presumido",
      porte: "M\xE9dio Porte",
      categoriaId: "cat-marketing",
      categoria: "Marketing e PDV",
      subcategoria: "Uniformes Operacionais",
      cidade: "Blumenau",
      uf: "SC",
      endereco: "Rua 7 de Setembro, 2890, Centro",
      cep: "89010-204",
      contatoComercial: { nome: "Daniela Zimmermann", email: "daniela@kobrasoluniformes.com.br", telefone: "(47) 3322-4500", cargo: "Gerente Comercial Nacional" },
      contatoFinanceiro: { nome: "Jonas Zimmermann", email: "fin@kobrasoluniformes.com.br", banco: "085 Ailos", agencia: "0101", conta: "99812-3", pix: "73.812.900/0001-62" },
      socios: ["Daniela Zimmermann", "Jonas Zimmermann"],
      investidasHomologadas: ["SPO", "PRN", "AMG"],
      statusHomologacao: "Homologado",
      statusDocumental: "Completo",
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 0,
      elegibilidade: "Apto",
      bloqueado: false,
      notaHomologacao: 93,
      ultimaAtualizacao: "15/11/2026",
      portalToken: "plx-portal-kobrasol-73812900",
      documentos: [
        { id: "d-1001", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "15/01/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cnpj_kobrasol.pdf", tamanhoKb: 220, ultimaAtualizacao: "15/01/2026", observacaoAnalista: "Regular." },
        { id: "d-1002", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "01/10/2026", validade: "30/03/2027", diasParaVencer: 134, status: "valido", arquivo: "cnd_fed_kobrasol.pdf", tamanhoKb: 390, ultimaAtualizacao: "01/10/2026", observacaoAnalista: "Regular." },
        { id: "d-1003", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "03/10/2026", validade: "01/04/2027", diasParaVencer: 136, status: "valido", arquivo: "cndt_kobrasol.pdf", tamanhoKb: 310, ultimaAtualizacao: "03/10/2026", observacaoAnalista: "Regular." },
        { id: "d-1004", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "08/11/2026", validade: "08/12/2026", diasParaVencer: 22, status: "valido", arquivo: "crf_fgts_kobrasol.pdf", tamanhoKb: 270, ultimaAtualizacao: "08/11/2026", observacaoAnalista: "Regular." }
      ],
      historico: [
        { id: "h-1001", dataHora: "15/11/2026 16:10", tipo: "cotacao", titulo: "Proposta enviada na RFQ COT-0149", detalhe: "Proposta comercial enviada para enxoval de loja.", usuario: "Portal do Fornecedor" }
      ]
    },
    {
      id: "FOR-011",
      razaoSocial: "Construtora Vale Norte Obras Comerciais Ltda.",
      nomeFantasia: "Construtora Vale Norte",
      cnpj: "91.000.008/0001-03",
      inscricaoEstadual: "096/1148920",
      regimeTributario: "Lucro Real",
      porte: "Grande Porte",
      categoriaId: "cat-obras",
      categoria: "Obras e Engenharia",
      subcategoria: "Constru\xE7\xE3o Civil e Retrofit",
      cidade: "Porto Alegre",
      uf: "RS",
      endereco: "Av. Carlos Gomes, 1100, Auxiliadora",
      cep: "90480-001",
      contatoComercial: { nome: "Eng. Ot\xE1vio Silveira", email: "otavio@valenorteeng.com.br", telefone: "(51) 3328-9900", cargo: "Diretor de Engenharia" },
      contatoFinanceiro: { nome: "Carla Silveira", email: "medicoes@valenorteeng.com.br", banco: "041 Banrisul", agencia: "0100", conta: "0611920-4", pix: "91.000.008/0001-03" },
      socios: ["Ot\xE1vio Silveira", "Carla Silveira"],
      investidasHomologadas: [],
      statusHomologacao: "Bloqueado",
      statusDocumental: "Com vencidos",
      docsVencidos: 2,
      docsVencendo30d: 0,
      docsPendentes: 1,
      elegibilidade: "Impedido",
      bloqueado: true,
      motivoBloqueio: "Apontamento trabalhista recorrente e CNDT positiva sem efeito de negativa.",
      notaHomologacao: 42,
      ultimaAtualizacao: "10/11/2026",
      portalToken: "plx-portal-valenorte-91000008",
      documentos: [
        { id: "d-1101", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "10/01/2026", validade: "Sem validade", diasParaVencer: null, status: "valido", arquivo: "cnpj_valenorte.pdf", tamanhoKb: 215, ultimaAtualizacao: "10/01/2026", observacaoAnalista: "Regular." },
        { id: "d-1102", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "15/04/2026", validade: "12/10/2026", diasParaVencer: -35, status: "vencido", arquivo: "cndt_valenorte_abr26.pdf", tamanhoKb: 340, ultimaAtualizacao: "10/11/2026", observacaoAnalista: "Certid\xE3o positiva com pend\xEAncias trabalhistas n\xE3o garantidas." },
        { id: "d-1103", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "01/09/2026", validade: "30/09/2026", diasParaVencer: -47, status: "vencido", arquivo: "crf_fgts_valenorte.pdf", tamanhoKb: 260, ultimaAtualizacao: "10/11/2026", observacaoAnalista: "Vencido h\xE1 47 dias." }
      ],
      historico: [
        { id: "h-1101", dataHora: "10/11/2026 14:00", tipo: "bloqueio", titulo: "Fornecedor bloqueado preventivamente pelo Compliance", detalhe: "Impedido de receber novas RFQs at\xE9 regulariza\xE7\xE3o da CNDT e CRF/FGTS.", usuario: "Fernanda Ribeiro" }
      ]
    },
    {
      id: "FOR-012",
      razaoSocial: "EcoPack Solu\xE7\xF5es Sustent\xE1veis em Papel e Bobinas Ltda.",
      nomeFantasia: "EcoPack Bobinas",
      cnpj: "99.000.123/0001-90",
      inscricaoEstadual: "412.900.118.110",
      regimeTributario: "Lucro Presumido",
      porte: "M\xE9dio Porte",
      categoriaId: "cat-embalagens",
      categoria: "Embalagens e Insumos",
      subcategoria: "Sacolas e Bobinas PDV",
      cidade: "Sorocaba",
      uf: "SP",
      endereco: "Av. Independ\xEAncia, 4120, \xC9den",
      cep: "18103-000",
      contatoComercial: { nome: "Tiago Barros", email: "tiago@ecopackpdv.com.br", telefone: "(15) 3228-7100", cargo: "Gerente Comercial" },
      contatoFinanceiro: { nome: "M\xF4nica Barros", email: "financeiro@ecopackpdv.com.br", banco: "341 Ita\xFA", agencia: "0511", conta: "61209-1", pix: "99.000.123/0001-90" },
      socios: ["Tiago Barros"],
      investidasHomologadas: [],
      statusHomologacao: "Convidado",
      statusDocumental: "Pendente envio",
      docsVencidos: 0,
      docsVencendo30d: 0,
      docsPendentes: 5,
      elegibilidade: "Com ressalva",
      bloqueado: false,
      notaHomologacao: null,
      ultimaAtualizacao: "15/11/2026",
      portalToken: "plx-portal-ecopack-99000123",
      documentos: [
        { id: "d-1201", tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "-", validade: "Sem validade", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: "15/11/2026", observacaoAnalista: "Aguardando upload pelo fornecedor no Portal." },
        { id: "d-1202", tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "-", validade: "Sem validade", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: "15/11/2026", observacaoAnalista: "Aguardando upload pelo fornecedor no Portal." },
        { id: "d-1203", tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "-", validade: "180 dias", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: "15/11/2026", observacaoAnalista: "Aguardando upload pelo fornecedor no Portal." },
        { id: "d-1204", tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "-", validade: "180 dias", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: "15/11/2026", observacaoAnalista: "Aguardando upload pelo fornecedor no Portal." },
        { id: "d-1205", tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "-", validade: "30 dias", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: "15/11/2026", observacaoAnalista: "Aguardando upload pelo fornecedor no Portal." }
      ],
      historico: [
        { id: "h-1201", dataHora: "15/11/2026 10:00", tipo: "convite", titulo: "Convite de homologa\xE7\xE3o enviado", detalhe: "Link do Portal do Fornecedor enviado para tiago@ecopackpdv.com.br.", usuario: "Ricardo Almeida" }
      ]
    }
  ],
  homologacoes: [
    {
      id: "HOM-2026-041",
      fornecedorId: "FOR-004",
      fornecedorNome: "Tinta & Tra\xE7o Gr\xE1fica",
      razaoSocial: "Tinta & Tra\xE7o Ind\xFAstria Gr\xE1fica e Editorial Ltda.",
      cnpj: "91.000.004/0001-25",
      investida: "SPO",
      categoria: "Marketing e PDV",
      subcategoria: "Gr\xE1fica e Tabloides",
      status: "em_analise",
      rotuloStatus: "Em an\xE1lise",
      diasNaEtapa: 2,
      slaDias: 3,
      pendenciasAbertas: 0,
      listaPendencias: [],
      responsavel: "Fernanda Ribeiro",
      ultimaAtualizacao: "16/11/2026 09:40",
      observacoesAnalista: "Cadastro societ\xE1rio e banc\xE1rio conferidos. CND Federal \xE9 positiva com efeito de negativa e vence em 16 dias. Falta apenas validar autenticidade do CRF/FGTS para liberar.",
      checklist: [
        { id: "ck-41-1", item: "Dados cadastrais e banc\xE1rios", tipo: "cadastro", status: "ok", detalhe: "Titularidade da conta PJ Sicredi compat\xEDvel com o CNPJ." },
        { id: "ck-41-2", item: "Cart\xE3o CNPJ", tipo: "documento", docId: "d-401", status: "ok", detalhe: "Situa\xE7\xE3o cadastral Ativa na Receita Federal." },
        { id: "ck-41-3", item: "Contrato Social", tipo: "documento", docId: "d-402", status: "ok", detalhe: "Poderes de representa\xE7\xE3o validados." },
        { id: "ck-41-4", item: "CND Federal", tipo: "documento", docId: "d-403", status: "att", detalhe: "V\xE1lida, por\xE9m vence em 16 dias (02/12/2026)." },
        { id: "ck-41-5", item: "CNDT Trabalhista", tipo: "documento", docId: "d-404", status: "ok", detalhe: "Certid\xE3o negativa v\xE1lida at\xE9 09/05/2027." },
        { id: "ck-41-6", item: "CRF/FGTS", tipo: "documento", docId: "d-405", status: "pendente", detalhe: "Em an\xE1lise de autenticidade na Caixa." }
      ]
    },
    {
      id: "HOM-2026-042",
      fornecedorId: "FOR-005",
      fornecedorNome: "TecnoServ Inform\xE1tica",
      razaoSocial: "TecnoServ Solu\xE7\xF5es em Infraestrutura e Redes Ltda.",
      cnpj: "91.000.005/0001-70",
      investida: "BOA",
      categoria: "TI e Telecom",
      subcategoria: "Servi\xE7os de TI e Suporte",
      status: "com_fornecedor",
      rotuloStatus: "Com fornecedor",
      diasNaEtapa: 2,
      slaDias: 5,
      pendenciasAbertas: 1,
      listaPendencias: ["Substituir CRF/FGTS vencido em 30/09/2026 por certid\xE3o vigente"],
      responsavel: "Fernanda Ribeiro",
      ultimaAtualizacao: "14/11/2026 11:15",
      observacoesAnalista: "Devolvida ao fornecedor via Portal para substitui\xE7\xE3o do CRF/FGTS.",
      checklist: [
        { id: "ck-42-1", item: "Dados cadastrais e banc\xE1rios", tipo: "cadastro", status: "ok", detalhe: "Conta Ita\xFA PJ conferida." },
        { id: "ck-42-2", item: "Cart\xE3o CNPJ", tipo: "documento", docId: "d-501", status: "ok", detalhe: "Situa\xE7\xE3o Ativa." },
        { id: "ck-42-3", item: "Contrato Social", tipo: "documento", docId: "d-502", status: "ok", detalhe: "Contrato consolidado ok." },
        { id: "ck-42-4", item: "CND Federal", tipo: "documento", docId: "d-503", status: "ok", detalhe: "V\xE1lida at\xE9 09/03/2027." },
        { id: "ck-42-5", item: "CNDT Trabalhista", tipo: "documento", docId: "d-504", status: "ok", detalhe: "V\xE1lida at\xE9 10/05/2027." },
        { id: "ck-42-6", item: "CRF/FGTS", tipo: "documento", docId: "d-505", status: "bad", detalhe: "Reprovado: documento anexado est\xE1 vencido desde 30/09/2026." }
      ]
    },
    {
      id: "HOM-2026-043",
      fornecedorId: "FOR-006",
      fornecedorNome: "Casa Nova Utilidades",
      razaoSocial: "Casa Nova Utilidades e Suprimentos Corporativos Ltda.",
      cnpj: "91.000.006/0001-14",
      investida: "AMG",
      categoria: "Facilities",
      subcategoria: "Copa e Caf\xE9",
      status: "aguardando_analise",
      rotuloStatus: "Aguardando an\xE1lise",
      diasNaEtapa: 2,
      slaDias: 5,
      pendenciasAbertas: 0,
      listaPendencias: [],
      responsavel: "Sem respons\xE1vel",
      ultimaAtualizacao: "14/11/2026 17:30",
      observacoesAnalista: "Fornecedor enviou pacote documental completo pelo Portal. Aguardando atribui\xE7\xE3o de analista.",
      checklist: [
        { id: "ck-43-1", item: "Dados cadastrais e banc\xE1rios", tipo: "cadastro", status: "ok", detalhe: "Preenchimento 100% conclu\xEDdo no Portal." },
        { id: "ck-43-2", item: "Cart\xE3o CNPJ", tipo: "documento", docId: "d-601", status: "pendente", detalhe: "Aguardando confer\xEAncia." },
        { id: "ck-43-3", item: "Contrato Social", tipo: "documento", docId: "d-602", status: "pendente", detalhe: "Aguardando confer\xEAncia." },
        { id: "ck-43-4", item: "CND Federal", tipo: "documento", docId: "d-603", status: "pendente", detalhe: "Aguardando confer\xEAncia." },
        { id: "ck-43-5", item: "CNDT Trabalhista", tipo: "documento", docId: "d-604", status: "pendente", detalhe: "Aguardando confer\xEAncia." },
        { id: "ck-43-6", item: "CRF/FGTS", tipo: "documento", docId: "d-605", status: "pendente", detalhe: "Aguardando confer\xEAncia." }
      ]
    },
    {
      id: "HOM-2026-044",
      fornecedorId: "FOR-001",
      fornecedorNome: "Pinheiro Distribuidora",
      razaoSocial: "Distribuidora Pinheiro & Filhos Higiene Profissional Ltda.",
      cnpj: "91.000.003/0001-80",
      investida: "PRN",
      categoria: "Embalagens e Insumos",
      subcategoria: "Qu\xEDmicos e Higieniza\xE7\xE3o",
      status: "aguardando_analise",
      rotuloStatus: "Aguardando an\xE1lise",
      diasNaEtapa: 4,
      slaDias: 4,
      pendenciasAbertas: 1,
      listaPendencias: ["CND Federal vencida h\xE1 23 dias precisa ser renovada para extens\xE3o ao PRN"],
      responsavel: "Fernanda Ribeiro",
      ultimaAtualizacao: "13/11/2026 16:00",
      observacoesAnalista: "Pedido de extens\xE3o de escopo para o PRN. Necess\xE1rio cobrar CND Federal atualizada.",
      checklist: [
        { id: "ck-44-1", item: "Dados cadastrais e banc\xE1rios", tipo: "cadastro", status: "ok", detalhe: "J\xE1 homologado em AMG, BOA e AVE." },
        { id: "ck-44-2", item: "Cart\xE3o CNPJ", tipo: "documento", docId: "d-101", status: "ok", detalhe: "V\xE1lido." },
        { id: "ck-44-3", item: "Contrato Social", tipo: "documento", docId: "d-102", status: "ok", detalhe: "V\xE1lido." },
        { id: "ck-44-4", item: "CND Federal", tipo: "documento", docId: "d-103", status: "bad", detalhe: "Vencida em 24/10/2026." },
        { id: "ck-44-5", item: "CNDT Trabalhista", tipo: "documento", docId: "d-104", status: "ok", detalhe: "V\xE1lida at\xE9 06/02/2027." },
        { id: "ck-44-6", item: "CRF/FGTS", tipo: "documento", docId: "d-105", status: "att", detalhe: "Vence em 10 dias (26/11/2026)." }
      ]
    },
    {
      id: "HOM-2026-039",
      fornecedorId: "FOR-007",
      fornecedorNome: "ClimaFrio Engenharia",
      razaoSocial: "ClimaFrio Engenharia T\xE9rmica e Refrigera\xE7\xE3o Industrial S.A.",
      cnpj: "82.410.500/0001-55",
      investida: "PLX",
      categoria: "Facilities",
      subcategoria: "Manuten\xE7\xE3o e Climatiza\xE7\xE3o",
      status: "aprovada",
      rotuloStatus: "Homologado",
      diasNaEtapa: 3,
      slaDias: 5,
      pendenciasAbertas: 0,
      listaPendencias: [],
      responsavel: "Fernanda Ribeiro",
      ultimaAtualizacao: "05/11/2026 14:20",
      observacoesAnalista: "Documenta\xE7\xE3o 100% regular e capacidade t\xE9cnica comprovada por atestados CREA.",
      parecerFinal: "Aprovado sem ressalvas para todas as investidas da Plurix.",
      checklist: [
        { id: "ck-39-1", item: "Dados cadastrais e banc\xE1rios", tipo: "cadastro", status: "ok", detalhe: "Validado." },
        { id: "ck-39-2", item: "Cart\xE3o CNPJ", tipo: "documento", docId: "d-701", status: "ok", detalhe: "Validado." },
        { id: "ck-39-3", item: "Contrato Social", tipo: "documento", docId: "d-702", status: "ok", detalhe: "Validado." },
        { id: "ck-39-4", item: "CND Federal", tipo: "documento", docId: "d-703", status: "ok", detalhe: "Validado." },
        { id: "ck-39-5", item: "CNDT Trabalhista", tipo: "documento", docId: "d-704", status: "ok", detalhe: "Validado." },
        { id: "ck-39-6", item: "CRF/FGTS", tipo: "documento", docId: "d-705", status: "ok", detalhe: "Validado." }
      ]
    },
    {
      id: "HOM-2026-038",
      fornecedorId: "FOR-011",
      fornecedorNome: "Construtora Vale Norte",
      razaoSocial: "Construtora Vale Norte Obras Comerciais Ltda.",
      cnpj: "91.000.008/0001-03",
      investida: "SPO",
      categoria: "Obras e Engenharia",
      subcategoria: "Constru\xE7\xE3o Civil e Retrofit",
      status: "reprovada",
      rotuloStatus: "Reprovada",
      diasNaEtapa: 6,
      slaDias: 7,
      pendenciasAbertas: 2,
      listaPendencias: ["CNDT positiva sem efeito de negativa", "CRF/FGTS vencido sem regulariza\xE7\xE3o"],
      responsavel: "Fernanda Ribeiro",
      ultimaAtualizacao: "10/11/2026 14:00",
      observacoesAnalista: "Fornecedor n\xE3o apresentou certid\xE3o negativa trabalhista dentro do prazo de recurso.",
      parecerFinal: "Reprovado por risco trabalhista e bloqueio preventivo registrado.",
      checklist: [
        { id: "ck-38-1", item: "Dados cadastrais e banc\xE1rios", tipo: "cadastro", status: "ok", detalhe: "Validado." },
        { id: "ck-38-2", item: "Cart\xE3o CNPJ", tipo: "documento", docId: "d-1101", status: "ok", detalhe: "Validado." },
        { id: "ck-38-3", item: "CNDT Trabalhista", tipo: "documento", docId: "d-1102", status: "bad", detalhe: "Certid\xE3o positiva com d\xE9bitos." },
        { id: "ck-38-4", item: "CRF/FGTS", tipo: "documento", docId: "d-1103", status: "bad", detalhe: "Vencido h\xE1 47 dias." }
      ]
    }
  ],
  cotacoes: [
    {
      id: "COT-0142",
      titulo: "Materiais de limpeza e qu\xEDmicos t\xE9cnicos, reposi\xE7\xE3o trimestral",
      descricao: "Fornecimento trimestral de detergentes clorados, desinfetantes de uso alimentar, bobinas de papel toalha e sacos de lixo refor\xE7ados para 64 lojas do AMG e 19 lojas do BOA.",
      categoria: "Embalagens e Insumos",
      subcategoria: "Qu\xEDmicos e Higieniza\xE7\xE3o",
      investida: "AMG",
      comprador: "Mariana Costa",
      abertura: "07/11/2026",
      prazo: "17/11/2026 18:00",
      horasRestantes: 31,
      status: "Em an\xE1lise",
      valorEstimado: 192400,
      condicoesSolicitadas: {
        pagamentoPadrao: "45 DDL via boleto banc\xE1rio PJ",
        tipoFretePreferencial: "CIF incluso com entrega nos CDs Maring\xE1 (AMG) e Jundia\xED (BOA)",
        localEntrega: "CD Maring\xE1 PR e CD Jundia\xED SP",
        impostosRegra: "ICMS, PIS e COFINS inclusos no pre\xE7o unit\xE1rio l\xEDquido",
        validadeMinimaDias: 30,
        observacoesGerais: "Exigido laudo ANVISA e FISPQ para todos os qu\xEDmicos de a\xE7ougue e padaria."
      },
      itens: [
        { id: "IT-01", codigo: "INS-4401", descricao: "Detergente Desengordurante Alcalino Clorado Gal\xE3o 5L", quantidade: 1800, unidade: "GL", especificacao: "Registro ANVISA ativo, dilui\xE7\xE3o m\xEDnima 1:50 para piso e bancada inox.", precoReferenciaUnit: 42.5 },
        { id: "IT-02", codigo: "INS-4408", descricao: "Desinfetante Quatern\xE1rio de Am\xF4nio Sem Cheiro Gal\xE3o 5L", quantidade: 1400, unidade: "GL", especificacao: "Uso em \xE1reas de manipula\xE7\xE3o alimentar (a\xE7ougue, frios e padaria).", precoReferenciaUnit: 48 },
        { id: "IT-03", codigo: "INS-4415", descricao: "Bobina Papel Toalha Interfolhado 100% Celulose Virgem Cx c/ 2400 fls", quantidade: 950, unidade: "CX", especificacao: "Gramatura m\xEDnima 28g/m\xB2, alvura superior a 85%.", precoReferenciaUnit: 36 },
        { id: "IT-04", codigo: "INS-4422", descricao: "Saco para Lixo Refor\xE7ado 200 Litros Preto 12 Micras Pct c/ 100 un", quantidade: 600, unidade: "PCT", especificacao: "Solda estrela refor\xE7ada, norma ABNT NBR 9191.", precoReferenciaUnit: 24.5 }
      ],
      fornecedoresConvidados: [
        { fornecedorId: "FOR-003", nomeFantasia: "Limpeza Brilhante", cnpj: "91.000.001/0001-91", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "14/11/2026 11:20", statusConvite: "Respondido" },
        { fornecedorId: "FOR-001", nomeFantasia: "Pinheiro Distribuidora", cnpj: "91.000.003/0001-80", statusHomologacao: "Homologado", docVencido: true, bloqueado: false, respondeu: true, dataResposta: "15/11/2026 14:10", statusConvite: "Respondido" },
        { fornecedorId: "FOR-002", nomeFantasia: "Embalagens Aurora", cnpj: "91.000.002/0001-36", statusHomologacao: "Homologado", docVencido: true, bloqueado: false, respondeu: true, dataResposta: "14/11/2026 16:40", statusConvite: "Respondido" }
      ],
      propostas: [
        {
          id: "PROP-142-A",
          fornecedorId: "FOR-003",
          fornecedorNome: "Limpeza Brilhante",
          cnpj: "91.000.001/0001-91",
          statusHomologacao: "Homologado",
          homologado: true,
          docVencido: false,
          enviadaEm: "14/11/2026 11:20",
          condicaoPagamento: "45 DDL",
          prazoEntregaMedioDias: 5,
          tipoFrete: "CIF (incluso)",
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 18,
          validadeProposta: "30 dias (at\xE9 14/12/2026)",
          observacoes: "Entrega fracionada quinzenal sem custo adicional de frete. Todos os laudos ANVISA anexados.",
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: "IT-01", precoUnitario: 38.9, precoTotal: 70020, aliquotaImpostoPct: 18, prazoEntregaDias: 5, marcaModelo: "Brilhante Pro Chlor 5L" },
            { itemId: "IT-02", precoUnitario: 44.5, precoTotal: 62300, aliquotaImpostoPct: 18, prazoEntregaDias: 5, marcaModelo: "Brilhante Quat Food 5L" },
            { itemId: "IT-03", precoUnitario: 34.8, precoTotal: 33060, aliquotaImpostoPct: 18, prazoEntregaDias: 4, marcaModelo: "SoftPure Virgem 28g" },
            { itemId: "IT-04", precoUnitario: 23.2, precoTotal: 13920, aliquotaImpostoPct: 18, prazoEntregaDias: 4, marcaModelo: "MaxBag 200L 12m" }
          ],
          subtotalItens: 179300,
          totalEqualizado: 179300
        },
        {
          id: "PROP-142-B",
          fornecedorId: "FOR-001",
          fornecedorNome: "Pinheiro Distribuidora",
          cnpj: "91.000.003/0001-80",
          statusHomologacao: "Homologado",
          homologado: true,
          docVencido: true,
          enviadaEm: "15/11/2026 14:10",
          condicaoPagamento: "60 DDL",
          prazoEntregaMedioDias: 7,
          tipoFrete: "FOB (por conta do comprador)",
          valorFreteTotal: 4200,
          impostosInclusos: true,
          aliquotaMediaPct: 18,
          validadeProposta: "30 dias (at\xE9 15/12/2026)",
          observacoes: "Condi\xE7\xE3o de pagamento estendida para 60 DDL. Frete FOB calculado \xE0 parte em R$ 4,2k. CND Federal em renova\xE7\xE3o.",
          incompleta: false,
          divergencias: ["Frete FOB diverge do padr\xE3o CIF solicitado (+R$ 4,2k)", "CND Federal vencida h\xE1 23 dias"],
          itens: [
            { itemId: "IT-01", precoUnitario: 37.8, precoTotal: 68040, aliquotaImpostoPct: 18, prazoEntregaDias: 7, marcaModelo: "Pinheiro Alcalino 5L" },
            { itemId: "IT-02", precoUnitario: 43.2, precoTotal: 60480, aliquotaImpostoPct: 18, prazoEntregaDias: 7, marcaModelo: "Pinheiro Quat 5L" },
            { itemId: "IT-03", precoUnitario: 36.9, precoTotal: 35055, aliquotaImpostoPct: 18, prazoEntregaDias: 7, marcaModelo: "Celupack 28g" },
            { itemId: "IT-04", precoUnitario: 24, precoTotal: 14400, aliquotaImpostoPct: 18, prazoEntregaDias: 7, marcaModelo: "Pinheiro Bag 200L" }
          ],
          subtotalItens: 177975,
          totalEqualizado: 182175
        },
        {
          id: "PROP-142-C",
          fornecedorId: "FOR-002",
          fornecedorNome: "Embalagens Aurora",
          cnpj: "91.000.002/0001-36",
          statusHomologacao: "Homologado",
          homologado: true,
          docVencido: true,
          enviadaEm: "14/11/2026 16:40",
          condicaoPagamento: "45 DDL",
          prazoEntregaMedioDias: 3,
          tipoFrete: "CIF (incluso)",
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 18,
          validadeProposta: "20 dias (at\xE9 04/12/2026)",
          observacoes: "Somos fabricantes diretos dos itens de papel e sacos pl\xE1sticos (IT-03 e IT-04). N\xE3o cotamos o item IT-02.",
          incompleta: true,
          divergencias: ["Proposta parcial: item IT-02 n\xE3o cotado", "Validade de 20 dias inferior ao m\xEDnimo de 30 dias", "CRF/FGTS vencido h\xE1 3 dias"],
          itens: [
            { itemId: "IT-01", precoUnitario: 41, precoTotal: 73800, aliquotaImpostoPct: 18, prazoEntregaDias: 4, marcaModelo: "Aurora Clean 5L" },
            { itemId: "IT-02", precoUnitario: null, precoTotal: null, aliquotaImpostoPct: 0, prazoEntregaDias: 0, marcaModelo: "N\xE3o cotado", divergenciaEspecificacao: "Item fora de linha no m\xEAs" },
            { itemId: "IT-03", precoUnitario: 31.9, precoTotal: 30305, aliquotaImpostoPct: 18, prazoEntregaDias: 3, marcaModelo: "Aurora Prime Virgem 30g" },
            { itemId: "IT-04", precoUnitario: 20.8, precoTotal: 12480, aliquotaImpostoPct: 18, prazoEntregaDias: 3, marcaModelo: "Aurora Heavy 200L 14m" }
          ],
          subtotalItens: 116585,
          totalEqualizado: 116585
        }
      ],
      adjudicacao: {
        modo: "item",
        vencedorLoteFornecedorId: "FOR-003",
        vencedoresPorItem: {
          "IT-01": "FOR-001",
          "IT-02": "FOR-001",
          "IT-03": "FOR-002",
          "IT-04": "FOR-002"
        },
        justificativaDecisao: "Adjudica\xE7\xE3o combinada por especialidade gera o menor desembolso total, condicionada \xE0 renova\xE7\xE3o das certid\xF5es antes da emiss\xE3o do pedido."
      },
      historico: [
        { id: "hc-1", dataHora: "15/11/2026 14:15", tipo: "status", titulo: "RFQ avan\xE7ou para Em an\xE1lise", detalhe: "Todas as 3 empresas convidadas enviaram propostas.", usuario: "Mariana Costa" },
        { id: "hc-2", dataHora: "07/11/2026 09:00", tipo: "abertura", titulo: "Cota\xE7\xE3o publicada e convites disparados", detalhe: "Convites enviados para Limpeza Brilhante, Pinheiro Distribuidora e Embalagens Aurora.", usuario: "Mariana Costa" }
      ]
    },
    {
      id: "COT-0147",
      titulo: "Manuten\xE7\xE3o preventiva e corretiva de ar-condicionado (28 lojas)",
      descricao: "Contrato anual de PMOC, limpeza de evaporadoras e manuten\xE7\xE3o de rooftops nas lojas do AMG e do PRN.",
      categoria: "Facilities",
      subcategoria: "Manuten\xE7\xE3o e Climatiza\xE7\xE3o",
      investida: "AMG",
      comprador: "Mariana Costa",
      abertura: "11/11/2026",
      prazo: "17/11/2026 04:00",
      horasRestantes: 18,
      status: "Recebendo propostas",
      valorEstimado: 34e4,
      condicoesSolicitadas: {
        pagamentoPadrao: "30 DDL ap\xF3s medi\xE7\xE3o mensal aprovada",
        tipoFretePreferencial: "Deslocamento t\xE9cnico incluso (CIF)",
        localEntrega: "28 lojas regionais PR e interior de SP",
        impostosRegra: "ISS e reten\xE7\xF5es legais destacadas em nota fiscal de servi\xE7o",
        validadeMinimaDias: 45,
        observacoesGerais: "Obrigat\xF3rio ART anual de PMOC assinada por Engenheiro Mec\xE2nico."
      },
      itens: [
        { id: "IT-47-1", codigo: "SRV-901", descricao: "Manuten\xE7\xE3o Preventiva Mensal PMOC Lojas Compactas (at\xE9 120 TR)", quantidade: 18, unidade: "LOJA/M\xCAS", especificacao: "Visitas quinzenais, limpeza de filtros e laudo PMOC.", precoReferenciaUnit: 9200 },
        { id: "IT-47-2", codigo: "SRV-902", descricao: "Manuten\xE7\xE3o Preventiva Mensal PMOC Lojas Grandes e Atacado (acima de 120 TR)", quantidade: 10, unidade: "LOJA/M\xCAS", especificacao: "T\xE9cnico residente ou atendimento em at\xE9 4h para chamados P1.", precoReferenciaUnit: 17440 }
      ],
      fornecedoresConvidados: [
        { fornecedorId: "FOR-007", nomeFantasia: "ClimaFrio Engenharia", cnpj: "82.410.500/0001-55", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "15/11/2026 11:00", statusConvite: "Respondido" },
        { fornecedorId: "FOR-008", nomeFantasia: "ArTemp Climatiza\xE7\xE3o", cnpj: "67.190.220/0001-18", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: false, statusConvite: "Visualizado" },
        { fornecedorId: "FOR-003", nomeFantasia: "Limpeza Brilhante", cnpj: "91.000.001/0001-91", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: false, statusConvite: "Aguardando resposta" },
        { fornecedorId: "FOR-005", nomeFantasia: "TecnoServ Inform\xE1tica", cnpj: "91.000.005/0001-70", statusHomologacao: "Pendente fornecedor", docVencido: true, bloqueado: false, respondeu: false, statusConvite: "Declinado" }
      ],
      propostas: [
        {
          id: "PROP-147-A",
          fornecedorId: "FOR-007",
          fornecedorNome: "ClimaFrio Engenharia",
          cnpj: "82.410.500/0001-55",
          statusHomologacao: "Homologado",
          homologado: true,
          docVencido: false,
          enviadaEm: "15/11/2026 11:00",
          condicaoPagamento: "30 DDL",
          prazoEntregaMedioDias: 2,
          tipoFrete: "CIF (incluso)",
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 14.25,
          validadeProposta: "60 dias",
          observacoes: "Equipes pr\xF3prias em Curitiba, Londrina e Maring\xE1. ART inclusa sem custo extra.",
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: "IT-47-1", precoUnitario: 8650, precoTotal: 155700, aliquotaImpostoPct: 14.25, prazoEntregaDias: 2, marcaModelo: "Equipe Pr\xF3pria PMOC" },
            { itemId: "IT-47-2", precoUnitario: 16200, precoTotal: 162e3, aliquotaImpostoPct: 14.25, prazoEntregaDias: 2, marcaModelo: "SLA 4h Cr\xEDtico" }
          ],
          subtotalItens: 317700,
          totalEqualizado: 317700
        }
      ],
      adjudicacao: {
        modo: "lote",
        vencedorLoteFornecedorId: "FOR-007",
        vencedoresPorItem: { "IT-47-1": "FOR-007", "IT-47-2": "FOR-007" },
        justificativaDecisao: "Aguardando encerramento do prazo (18h restantes) e resposta da ArTemp Climatiza\xE7\xE3o para equaliza\xE7\xE3o final."
      },
      historico: [
        { id: "hc-47-1", dataHora: "16/11/2026 08:30", tipo: "alerta", titulo: "Cota\xE7\xE3o encerrando em 18h com 1 de 4 respostas", detalhe: "Cobran\xE7a enviada para ArTemp Climatiza\xE7\xE3o.", usuario: "Mariana Costa" }
      ]
    },
    {
      id: "COT-0149",
      titulo: "Uniformes operacionais de frente de caixa e perec\xEDveis",
      descricao: "Enxoval de ver\xE3o 2027 para operadores de caixa, reposi\xE7\xE3o e balconistas de padaria/a\xE7ougue das investidas BOA, AVE e JPY.",
      categoria: "Marketing e PDV",
      subcategoria: "Uniformes Operacionais",
      investida: "BOA",
      comprador: "Ricardo Almeida",
      abertura: "09/11/2026",
      prazo: "19/11/2026 18:00",
      horasRestantes: 79,
      status: "Em negocia\xE7\xE3o",
      valorEstimado: 148e3,
      condicoesSolicitadas: {
        pagamentoPadrao: "30/60 DDL",
        tipoFretePreferencial: "CIF CD Jundia\xED",
        localEntrega: "CD Jundia\xED SP",
        impostosRegra: "Todos os tributos inclusos",
        validadeMinimaDias: 30,
        observacoesGerais: "Bordado eletr\xF4nico com logo da bandeira incluso."
      },
      itens: [
        { id: "IT-49-1", codigo: "UNI-101", descricao: "Camisa Polo Piquet PA Bordada Frente de Caixa", quantidade: 3200, unidade: "UN", especificacao: "Malha Piquet 50% algod\xE3o 50% poli\xE9ster antipilling.", precoReferenciaUnit: 34 },
        { id: "IT-49-2", codigo: "UNI-108", descricao: "Avental Imperme\xE1vel A\xE7ougue e Peixaria Branco", quantidade: 800, unidade: "UN", especificacao: "PVC forrado com CA ativo no MTE.", precoReferenciaUnit: 49 }
      ],
      fornecedoresConvidados: [
        { fornecedorId: "FOR-010", nomeFantasia: "Kobrasol Uniformes", cnpj: "73.812.900/0001-62", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "15/11/2026 16:10", statusConvite: "Respondido" },
        { fornecedorId: "FOR-004", nomeFantasia: "Tinta & Tra\xE7o Gr\xE1fica", cnpj: "91.000.004/0001-25", statusHomologacao: "Em an\xE1lise", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "15/11/2026 17:00", statusConvite: "Respondido" },
        { fornecedorId: "FOR-006", nomeFantasia: "Casa Nova Utilidades", cnpj: "91.000.006/0001-14", statusHomologacao: "Aguardando an\xE1lise", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "15/11/2026 18:10", statusConvite: "Respondido" },
        { fornecedorId: "FOR-002", nomeFantasia: "Embalagens Aurora", cnpj: "91.000.002/0001-36", statusHomologacao: "Homologado", docVencido: true, bloqueado: false, respondeu: false, statusConvite: "Aguardando resposta" },
        { fornecedorId: "FOR-012", nomeFantasia: "EcoPack Bobinas", cnpj: "99.000.123/0001-90", statusHomologacao: "Convidado", docVencido: false, bloqueado: false, respondeu: false, statusConvite: "Aguardando resposta" }
      ],
      propostas: [
        {
          id: "PROP-149-A",
          fornecedorId: "FOR-010",
          fornecedorNome: "Kobrasol Uniformes",
          cnpj: "73.812.900/0001-62",
          statusHomologacao: "Homologado",
          homologado: true,
          docVencido: false,
          enviadaEm: "15/11/2026 16:10",
          condicaoPagamento: "30/60/90 DDL",
          prazoEntregaMedioDias: 15,
          tipoFrete: "CIF (incluso)",
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 12,
          validadeProposta: "30 dias",
          observacoes: "Grade completa do PP ao EXG pronta para produ\xE7\xE3o.",
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: "IT-49-1", precoUnitario: 31.4, precoTotal: 100480, aliquotaImpostoPct: 12, prazoEntregaDias: 15, marcaModelo: "Kobrasol Pro Piquet" },
            { itemId: "IT-49-2", precoUnitario: 45.9, precoTotal: 36720, aliquotaImpostoPct: 12, prazoEntregaDias: 12, marcaModelo: "Kobrasol EPI CA 41029" }
          ],
          subtotalItens: 137200,
          totalEqualizado: 137200
        },
        {
          id: "PROP-149-B",
          fornecedorId: "FOR-006",
          fornecedorNome: "Casa Nova Utilidades",
          cnpj: "91.000.006/0001-14",
          statusHomologacao: "Aguardando an\xE1lise",
          homologado: false,
          docVencido: false,
          enviadaEm: "15/11/2026 18:10",
          condicaoPagamento: "28 DDL",
          prazoEntregaMedioDias: 22,
          tipoFrete: "FOB (por conta do comprador)",
          valorFreteTotal: 3100,
          impostosInclusos: true,
          aliquotaMediaPct: 6,
          validadeProposta: "15 dias",
          observacoes: "Empresa optante pelo Simples Nacional.",
          incompleta: false,
          divergencias: ["Fornecedor ainda Aguardando an\xE1lise de homologa\xE7\xE3o", "Prazo de pagamento 28 DDL inferior ao solicitado (30/60 DDL)", "Frete FOB (+R$ 3,1k)"],
          itens: [
            { itemId: "IT-49-1", precoUnitario: 32.8, precoTotal: 104960, aliquotaImpostoPct: 6, prazoEntregaDias: 22, marcaModelo: "Confec\xE7\xE3o Parceira SP" },
            { itemId: "IT-49-2", precoUnitario: 47.5, precoTotal: 38e3, aliquotaImpostoPct: 6, prazoEntregaDias: 20, marcaModelo: "ProtCap PVC" }
          ],
          subtotalItens: 142960,
          totalEqualizado: 146060
        }
      ],
      adjudicacao: {
        modo: "lote",
        vencedorLoteFornecedorId: "FOR-010",
        vencedoresPorItem: { "IT-49-1": "FOR-010", "IT-49-2": "FOR-010" },
        justificativaDecisao: "Kobrasol Uniformes apresenta o menor pre\xE7o equalizado, frete CIF, pagamento em 30/60/90 DDL e homologa\xE7\xE3o 100% regular."
      },
      historico: [
        { id: "hc-49-1", dataHora: "16/11/2026 09:10", tipo: "negociacao", titulo: "Rodada de negocia\xE7\xE3o aberta com Kobrasol", detalhe: "Obtido parcelamento em 30/60/90 DDL sem acr\xE9scimo.", usuario: "Ricardo Almeida" }
      ]
    },
    {
      id: "COT-0151",
      titulo: "Transporte dedicado refrigerado CD Jundia\xED para lojas BOA e JPY",
      descricao: "Contrata\xE7\xE3o de 6 caminh\xF5es 3/4 refrigerados com rastreamento para abastecimento di\xE1rio de FLV e latic\xEDnios.",
      categoria: "Log\xEDstica",
      subcategoria: "Fretes e Transporte",
      investida: "BOA",
      comprador: "Ricardo Almeida",
      abertura: "12/11/2026",
      prazo: "18/11/2026 12:00",
      horasRestantes: 44,
      status: "Aberta",
      valorEstimado: 485e3,
      condicoesSolicitadas: {
        pagamentoPadrao: "30 DDL quinzenal",
        tipoFretePreferencial: "Franquia mensal km + di\xE1ria dedicada",
        localEntrega: "CD Jundia\xED e 36 lojas SP",
        impostosRegra: "ICMS transporte e seguro RCTR-C inclusos",
        validadeMinimaDias: 60,
        observacoesGerais: "Frota com idade m\xE1xima de 4 anos e term\xF3grafo calibrado."
      },
      itens: [
        { id: "IT-51-1", codigo: "LOG-301", descricao: "Franquia Mensal Ve\xEDculo VUC/3/4 Refrigerado (-5\xB0C a +4\xB0C) c/ Motorista", quantidade: 6, unidade: "VE\xCDC/M\xCAS", especificacao: "At\xE9 5.000 km/m\xEAs por ve\xEDculo.", precoReferenciaUnit: 80800 }
      ],
      fornecedoresConvidados: [
        { fornecedorId: "FOR-009", nomeFantasia: "TransRota Log\xEDstica", cnpj: "55.710.890/0001-40", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "14/11/2026 18:00", statusConvite: "Respondido" },
        { fornecedorId: "FOR-007", nomeFantasia: "ClimaFrio Engenharia", cnpj: "82.410.500/0001-55", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: false, statusConvite: "Visualizado" },
        { fornecedorId: "FOR-008", nomeFantasia: "ArTemp Climatiza\xE7\xE3o", cnpj: "67.190.220/0001-18", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: false, statusConvite: "Aguardando resposta" }
      ],
      propostas: [
        {
          id: "PROP-151-A",
          fornecedorId: "FOR-009",
          fornecedorNome: "TransRota Log\xEDstica",
          cnpj: "55.710.890/0001-40",
          statusHomologacao: "Homologado",
          homologado: true,
          docVencido: false,
          enviadaEm: "14/11/2026 18:00",
          condicaoPagamento: "30 DDL",
          prazoEntregaMedioDias: 10,
          tipoFrete: "CIF (incluso)",
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 12,
          validadeProposta: "60 dias",
          observacoes: "Frota 2025 Euro 6 com telemetria de temperatura integrada \xE0 torre Plurix.",
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: "IT-51-1", precoUnitario: 76500, precoTotal: 459e3, aliquotaImpostoPct: 12, prazoEntregaDias: 10, marcaModelo: "Frota Refrigerada Euro 6" }
          ],
          subtotalItens: 459e3,
          totalEqualizado: 459e3
        }
      ],
      adjudicacao: {
        modo: "lote",
        vencedorLoteFornecedorId: "FOR-009",
        vencedoresPorItem: { "IT-51-1": "FOR-009" },
        justificativaDecisao: "Em coleta de mais propostas at\xE9 o prazo de 18/11."
      },
      historico: [
        { id: "hc-51-1", dataHora: "12/11/2026 10:00", tipo: "abertura", titulo: "RFQ publicada", detalhe: "Aberta para recebimento de propostas no Portal.", usuario: "Ricardo Almeida" }
      ]
    },
    {
      id: "COT-0138",
      titulo: "Bobinas t\xE9rmicas PDV 80x40m e etiquetas de g\xF4ndola",
      descricao: "Compra consolidada semestral para todas as 178 lojas da Plurix.",
      categoria: "Embalagens e Insumos",
      subcategoria: "Sacolas e Bobinas PDV",
      investida: "PLX",
      comprador: "Davi Bigotto",
      abertura: "25/10/2026",
      prazo: "08/11/2026 18:00",
      horasRestantes: 0,
      status: "Encerrada",
      valorEstimado: 265e3,
      condicoesSolicitadas: {
        pagamentoPadrao: "60 DDL",
        tipoFretePreferencial: "CIF CDs regionais",
        localEntrega: "CDs AMG, BOA, AVE, PRN, SPO e JPY",
        impostosRegra: "Inclusos",
        validadeMinimaDias: 30,
        observacoesGerais: "Papel t\xE9rmico livre de Bisfenol A (BPA Free) com garantia de imagem de 5 anos."
      },
      itens: [
        { id: "IT-38-1", codigo: "PDV-001", descricao: "Bobina T\xE9rmica 80mm x 40m KPH 48g Cx c/ 30 rolos", quantidade: 3500, unidade: "CX", especificacao: "BPA Free homologado para impressoras Elgin e Bematech.", precoReferenciaUnit: 75.7 }
      ],
      fornecedoresConvidados: [
        { fornecedorId: "FOR-002", nomeFantasia: "Embalagens Aurora", cnpj: "91.000.002/0001-36", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "05/11/2026 14:00", statusConvite: "Respondido" },
        { fornecedorId: "FOR-004", nomeFantasia: "Tinta & Tra\xE7o Gr\xE1fica", cnpj: "91.000.004/0001-25", statusHomologacao: "Em an\xE1lise", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "06/11/2026 10:30", statusConvite: "Respondido" },
        { fornecedorId: "FOR-001", nomeFantasia: "Pinheiro Distribuidora", cnpj: "91.000.003/0001-80", statusHomologacao: "Homologado", docVencido: false, bloqueado: false, respondeu: true, dataResposta: "06/11/2026 16:20", statusConvite: "Respondido" }
      ],
      propostas: [
        {
          id: "PROP-138-A",
          fornecedorId: "FOR-002",
          fornecedorNome: "Embalagens Aurora",
          cnpj: "91.000.002/0001-36",
          statusHomologacao: "Homologado",
          homologado: true,
          docVencido: false,
          enviadaEm: "05/11/2026 14:00",
          condicaoPagamento: "60 DDL",
          prazoEntregaMedioDias: 5,
          tipoFrete: "CIF (incluso)",
          valorFreteTotal: 0,
          impostosInclusos: true,
          aliquotaMediaPct: 18,
          validadeProposta: "45 dias",
          observacoes: "Adjudicada com entrega programada.",
          incompleta: false,
          divergencias: [],
          itens: [
            { itemId: "IT-38-1", precoUnitario: 69.8, precoTotal: 244300, aliquotaImpostoPct: 18, prazoEntregaDias: 5, marcaModelo: "Aurora Thermal KPH" }
          ],
          subtotalItens: 244300,
          totalEqualizado: 244300
        }
      ],
      adjudicacao: {
        modo: "lote",
        vencedorLoteFornecedorId: "FOR-002",
        vencedoresPorItem: { "IT-38-1": "FOR-002" },
        justificativaDecisao: "Adjudicado para Embalagens Aurora por menor custo total e entrega CIF em todos os 6 CDs.",
        aprovadoPor: "Davi Bigotto",
        aprovadoEm: "09/11/2026 15:00"
      },
      historico: [
        { id: "hc-38-1", dataHora: "09/11/2026 15:00", tipo: "encerramento", titulo: "Cota\xE7\xE3o adjudicada e encerrada", detalhe: "Vencedor: Embalagens Aurora (R$ 244,3k vs baseline R$ 265,0k).", usuario: "Davi Bigotto" }
      ]
    },
    {
      id: "COT-0154",
      titulo: "Renova\xE7\xE3o de links dedicados redundantes para 38 lojas SPO",
      descricao: "Links IP dedicados 200 Mbps com SLA de 99,8% e failover autom\xE1tico 5G.",
      categoria: "TI e Telecom",
      subcategoria: "Links e Conectividade",
      investida: "SPO",
      comprador: "Mariana Costa",
      abertura: "16/11/2026",
      prazo: "25/11/2026 18:00",
      horasRestantes: 216,
      status: "Convite programado",
      valorEstimado: 218e3,
      condicoesSolicitadas: {
        pagamentoPadrao: "30 DDL mensal",
        tipoFretePreferencial: "Instala\xE7\xE3o inclusa",
        localEntrega: "38 lojas SPO PR/SC",
        impostosRegra: "ICMS/FUST/FUNTTEL inclusos",
        validadeMinimaDias: 60,
        observacoesGerais: "Disparo de convites agendado para 17/11 \xE0s 08h."
      },
      itens: [
        { id: "IT-54-1", codigo: "TEL-201", descricao: "Link Dedicado Fibra 200 Mbps Full Duplex c/ Ger\xEAncia Proativa", quantidade: 38, unidade: "LINK/M\xCAS", especificacao: "Reparo em at\xE9 4 horas.", precoReferenciaUnit: 5736.84 }
      ],
      fornecedoresConvidados: [
        { fornecedorId: "FOR-005", nomeFantasia: "TecnoServ Inform\xE1tica", cnpj: "91.000.005/0001-70", statusHomologacao: "Pendente fornecedor", docVencido: true, bloqueado: false, respondeu: false, statusConvite: "Aguardando resposta" }
      ],
      propostas: [],
      adjudicacao: {
        modo: "lote",
        vencedorLoteFornecedorId: null,
        vencedoresPorItem: {},
        justificativaDecisao: ""
      },
      historico: [
        { id: "hc-54-1", dataHora: "16/11/2026 09:00", tipo: "rascunho", titulo: "Convite programado para disparo", detalhe: "Aguardando regulariza\xE7\xE3o do CRF/FGTS da TecnoServ.", usuario: "Mariana Costa" }
      ]
    },
    {
      id: "COT-0155",
      titulo: "Adequa\xE7\xE3o civil de docas e niveladoras CD Avenida",
      descricao: "Escopo t\xE9cnico em revis\xE3o pela Engenharia antes da abertura aos fornecedores.",
      categoria: "Obras e Engenharia",
      subcategoria: "Constru\xE7\xE3o Civil e Retrofit",
      investida: "AVE",
      comprador: "Ricardo Almeida",
      abertura: "16/11/2026",
      prazo: "30/11/2026 18:00",
      horasRestantes: 336,
      status: "Rascunho",
      valorEstimado: null,
      condicoesSolicitadas: {
        pagamentoPadrao: "Medi\xE7\xE3o quinzenal 30 DDL",
        tipoFretePreferencial: "Material e BDI inclusos",
        localEntrega: "CD Assis SP (AVE)",
        impostosRegra: "ISS retido na fonte conforme legisla\xE7\xE3o municipal",
        validadeMinimaDias: 45,
        observacoesGerais: "Em elabora\xE7\xE3o."
      },
      itens: [
        { id: "IT-55-1", codigo: "OBR-701", descricao: "Fornecimento e instala\xE7\xE3o de niveladora eletro-hidr\xE1ulica 6 ton", quantidade: 4, unidade: "UN", especificacao: "Pestana articulada e guarda-corpo NR-12.", precoReferenciaUnit: 42e3 }
      ],
      fornecedoresConvidados: [],
      propostas: [],
      adjudicacao: {
        modo: "lote",
        vencedorLoteFornecedorId: null,
        vencedoresPorItem: {},
        justificativaDecisao: ""
      },
      historico: [
        { id: "hc-55-1", dataHora: "16/11/2026 10:15", tipo: "rascunho", titulo: "Rascunho iniciado", detalhe: "Aguardando memorial descritivo final da Engenharia.", usuario: "Ricardo Almeida" }
      ]
    }
  ]
};

// src/services/gestaoFornecedores/servico.ts
var banco = structuredClone(SEMENTE_GESTAO_FORNECEDORES);
function agoraPtBr() {
  return (/* @__PURE__ */ new Date()).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function hojePtBr() {
  return (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR");
}
function obterEstadoCompleto(investidaFiltro) {
  const inv = investidaFiltro && investidaFiltro !== "PLX" ? investidaFiltro : null;
  const fornecedores = inv ? banco.fornecedores.filter(
    (f) => f.investidasHomologadas.includes(inv) || f.investidasHomologadas.length === 0
  ) : banco.fornecedores;
  const homologacoes = inv ? banco.homologacoes.filter((h) => h.investida === inv || h.investida === "PLX") : banco.homologacoes;
  const cotacoes = inv ? banco.cotacoes.filter((c) => c.investida === inv || c.investida === "PLX") : banco.cotacoes;
  const fornecedoresAtivos = fornecedores.filter((f) => !f.bloqueado && f.statusHomologacao !== "Reprovado").length;
  const fornecedoresHomologados = fornecedores.filter((f) => f.statusHomologacao === "Homologado").length;
  const pctHomologados = fornecedores.length > 0 ? Math.round(fornecedoresHomologados / fornecedores.length * 1e3) / 10 : 0;
  const homologAguardando = homologacoes.filter((h) => h.status === "aguardando_analise").length;
  const homologEmAnalise = homologacoes.filter((h) => h.status === "em_analise").length;
  const homologComFornecedor = homologacoes.filter((h) => h.status === "com_fornecedor").length;
  const homologFilaTotal = homologAguardando + homologEmAnalise + homologComFornecedor;
  let docsVencidos = 0;
  let docsVencendo30d = 0;
  const alertasAtencao = [];
  for (const f of fornecedores) {
    for (const d of f.documentos) {
      if (d.status === "vencido" || d.status === "rejeitado") {
        docsVencidos++;
        alertasAtencao.push({
          id: `alt-doc-${f.id}-${d.id}`,
          tipo: "documento_vencido",
          criticidade: "bad",
          fornecedorOuRef: f.nomeFantasia,
          subtitulo: f.cnpj,
          detalhe: `${d.tipoNome} ${d.status === "rejeitado" ? "reprovado na an\xE1lise" : `vencido h\xE1 ${Math.abs(d.diasParaVencer || 3)} dias`}`,
          investida: f.investidasHomologadas[0] || "PLX",
          acaoRotulo: "Cobrar documento",
          alvoModulo: "fornecedor",
          alvoId: f.id
        });
      } else if (d.status === "proximo_vencimento") {
        docsVencendo30d++;
      }
    }
  }
  for (const h of homologacoes) {
    if ((h.status === "aguardando_analise" || h.status === "com_fornecedor") && h.diasNaEtapa >= 2) {
      alertasAtencao.push({
        id: `alt-hom-${h.id}`,
        tipo: h.status === "com_fornecedor" ? "pendencia_fornecedor" : "homologacao_parada",
        criticidade: h.diasNaEtapa >= h.slaDias ? "bad" : "att",
        fornecedorOuRef: h.fornecedorNome,
        subtitulo: `${h.id} \xB7 ${h.categoria}`,
        detalhe: h.status === "com_fornecedor" ? `Homologa\xE7\xE3o devolvida ao fornecedor h\xE1 ${h.diasNaEtapa} dias (${h.pendenciasAbertas} pend\xEAncia aberta)` : `Homologa\xE7\xE3o aguardando an\xE1lise h\xE1 ${h.diasNaEtapa} dias (SLA ${h.slaDias}d)`,
        investida: h.investida,
        acaoRotulo: "Analisar fila",
        alvoModulo: "homologacao",
        alvoId: h.id
      });
    }
  }
  const cotacoesAbertasLista = cotacoes.filter(
    (c) => ["Aberta", "Recebendo propostas", "Em an\xE1lise", "Em negocia\xE7\xE3o"].includes(c.status)
  );
  const cotacoesEncerrando48h = cotacoesAbertasLista.filter((c) => c.horasRestantes > 0 && c.horasRestantes <= 48).length;
  let convitesTotaisAbertos = 0;
  let respostasRecebidasAbertas = 0;
  let fornecedoresPendentesRfq = 0;
  for (const c of cotacoesAbertasLista) {
    const conv = c.fornecedoresConvidados.length;
    const resp = c.fornecedoresConvidados.filter((fc) => fc.respondeu).length;
    convitesTotaisAbertos += conv;
    respostasRecebidasAbertas += resp;
    fornecedoresPendentesRfq += Math.max(0, conv - resp);
    if (c.horasRestantes > 0 && c.horasRestantes <= 48) {
      alertasAtencao.push({
        id: `alt-cot-prazo-${c.id}`,
        tipo: "cotacao_prazo",
        criticidade: resp < 2 ? "bad" : "att",
        fornecedorOuRef: `${c.id} \xB7 ${c.titulo}`,
        subtitulo: `Comprador: ${c.comprador}`,
        detalhe: `Encerra em ${c.horasRestantes}h com ${resp} de ${conv} propostas recebidas`,
        investida: c.investida,
        acaoRotulo: "Abrir cota\xE7\xE3o",
        alvoModulo: "cotacao",
        alvoId: c.id
      });
    } else if (conv >= 3 && resp < 2) {
      alertasAtencao.push({
        id: `alt-cot-resp-${c.id}`,
        tipo: "cotacao_baixa_resposta",
        criticidade: "att",
        fornecedorOuRef: `${c.id} \xB7 ${c.titulo}`,
        subtitulo: `Comprador: ${c.comprador}`,
        detalhe: `Baixa ades\xE3o at\xE9 o momento: apenas ${resp} de ${conv} fornecedores responderam`,
        investida: c.investida,
        acaoRotulo: "Cobrar propostas",
        alvoModulo: "cotacao",
        alvoId: c.id
      });
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
      pendenciasCriticas: alertasAtencao.filter((a) => a.criticidade === "bad").length,
      tempoMedioHomologacaoDias: 3.4,
      slaDentroPrazoPct: 86.5,
      tempoMedioRfqDias: 6.2
    },
    alertasAtencao,
    investidas: banco.investidas,
    categorias: banco.categorias,
    tiposDocumento: banco.tiposDocumento,
    regrasHomologacao: banco.regrasHomologacao,
    usuarios: banco.usuarios,
    fornecedores,
    homologacoes,
    cotacoes
  };
}
function convidarFornecedor(dados) {
  const seq = banco.fornecedores.length + 1;
  const id = `FOR-${String(seq).padStart(3, "0")}`;
  const token = `plx-portal-${id.toLowerCase()}-${Date.now().toString(36)}`;
  const catObj = banco.categorias.find((c) => c.nome === dados.categoria) || banco.categorias[0];
  const novoFornecedor = {
    id,
    razaoSocial: dados.razaoSocial.trim(),
    nomeFantasia: (dados.nomeFantasia || dados.razaoSocial).trim(),
    cnpj: dados.cnpj.trim(),
    inscricaoEstadual: "Em preenchimento",
    regimeTributario: "A confirmar no Portal",
    porte: "M\xE9dio Porte",
    categoriaId: catObj.id,
    categoria: catObj.nome,
    subcategoria: dados.subcategoria || (catObj.subcategorias[0]?.nome ?? "Geral"),
    cidade: dados.cidade || "S\xE3o Paulo",
    uf: dados.uf || "SP",
    endereco: "Aguardando preenchimento no Portal do Fornecedor",
    cep: "00000-000",
    contatoComercial: {
      nome: dados.contatoNome || "Respons\xE1vel Comercial",
      email: dados.email.trim(),
      telefone: dados.telefone || "(11) 99999-0000",
      cargo: "Comercial"
    },
    contatoFinanceiro: {
      nome: dados.contatoNome || "Financeiro",
      email: dados.email.trim(),
      banco: "A informar",
      agencia: "-",
      conta: "-",
      pix: dados.cnpj.trim()
    },
    socios: ["Aguardando Contrato Social"],
    investidasHomologadas: [],
    statusHomologacao: "Convidado",
    statusDocumental: "Pendente envio",
    docsVencidos: 0,
    docsVencendo30d: 0,
    docsPendentes: 5,
    elegibilidade: "Com ressalva",
    bloqueado: false,
    notaHomologacao: null,
    ultimaAtualizacao: hojePtBr(),
    portalToken: token,
    documentos: [
      { id: `d-${seq}-1`, tipoId: "doc-cnpj", tipoNome: "Cart\xE3o CNPJ", obrigatorio: true, emissao: "-", validade: "Sem validade", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: "Solicitado no convite." },
      { id: `d-${seq}-2`, tipoId: "doc-contrato", tipoNome: "Contrato Social", obrigatorio: true, emissao: "-", validade: "Sem validade", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: "Solicitado no convite." },
      { id: `d-${seq}-3`, tipoId: "doc-cnd-fed", tipoNome: "CND Federal", obrigatorio: true, emissao: "-", validade: "180 dias", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: "Solicitado no convite." },
      { id: `d-${seq}-4`, tipoId: "doc-cndt", tipoNome: "CNDT", obrigatorio: true, emissao: "-", validade: "180 dias", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: "Solicitado no convite." },
      { id: `d-${seq}-5`, tipoId: "doc-fgts", tipoNome: "CRF/FGTS", obrigatorio: true, emissao: "-", validade: "30 dias", diasParaVencer: null, status: "pendente", arquivo: "", tamanhoKb: 0, ultimaAtualizacao: hojePtBr(), observacaoAnalista: "Solicitado no convite." }
    ],
    historico: [
      {
        id: `h-${Date.now()}`,
        dataHora: agoraPtBr(),
        tipo: "convite",
        titulo: "Convite enviado para cadastro e homologa\xE7\xE3o",
        detalhe: `Link de acesso ao Portal do Fornecedor enviado para ${dados.email} (Escopo: ${(dados.investidasAlvo || ["PLX"]).join(", ")}).`,
        usuario: dados.usuario || "Davi Bigotto"
      }
    ]
  };
  banco.fornecedores.unshift(novoFornecedor);
  const novaHomolog = {
    id: `HOM-2026-0${45 + banco.homologacoes.length}`,
    fornecedorId: novoFornecedor.id,
    fornecedorNome: novoFornecedor.nomeFantasia,
    razaoSocial: novoFornecedor.razaoSocial,
    cnpj: novoFornecedor.cnpj,
    investida: dados.investidasAlvo?.[0] || "PLX",
    categoria: novoFornecedor.categoria,
    subcategoria: novoFornecedor.subcategoria,
    status: "aguardando_analise",
    rotuloStatus: "Aguardando an\xE1lise",
    diasNaEtapa: 0,
    slaDias: catObj.slaHomologacaoDias,
    pendenciasAbertas: 5,
    listaPendencias: ["Aguardando envio inicial dos documentos obrigat\xF3rios no Portal do Fornecedor"],
    responsavel: "Fernanda Ribeiro",
    ultimaAtualizacao: agoraPtBr(),
    observacoesAnalista: "Fornecedor rec\xE9m-convidado. Link ativo no Portal do Fornecedor.",
    checklist: [
      { id: `ck-${seq}-1`, item: "Dados cadastrais e banc\xE1rios", tipo: "cadastro", status: "pendente", detalhe: "Aguardando preenchimento pelo fornecedor." },
      { id: `ck-${seq}-2`, item: "Cart\xE3o CNPJ", tipo: "documento", docId: `d-${seq}-1`, status: "pendente", detalhe: "Pendente de envio." },
      { id: `ck-${seq}-3`, item: "Contrato Social", tipo: "documento", docId: `d-${seq}-2`, status: "pendente", detalhe: "Pendente de envio." },
      { id: `ck-${seq}-4`, item: "CND Federal", tipo: "documento", docId: `d-${seq}-3`, status: "pendente", detalhe: "Pendente de envio." },
      { id: `ck-${seq}-5`, item: "CNDT Trabalhista", tipo: "documento", docId: `d-${seq}-4`, status: "pendente", detalhe: "Pendente de envio." },
      { id: `ck-${seq}-6`, item: "CRF/FGTS", tipo: "documento", docId: `d-${seq}-5`, status: "pendente", detalhe: "Pendente de envio." }
    ]
  };
  banco.homologacoes.unshift(novaHomolog);
  return { fornecedor: novoFornecedor, homologacao: novaHomolog };
}
function avaliarDocumentoFornecedor(dados) {
  const forn = banco.fornecedores.find((f) => f.id === dados.fornecedorId);
  if (!forn) throw new Error("Fornecedor n\xE3o localizado.");
  const doc = forn.documentos.find((d) => d.id === dados.docId);
  if (!doc) throw new Error("Documento n\xE3o localizado.");
  let novoStatusDoc = doc.status;
  let statusChecklist = "ok";
  let tituloHist = "";
  if (dados.acao === "aprovar") {
    novoStatusDoc = "valido";
    statusChecklist = "ok";
    if (doc.emissao === "-") doc.emissao = hojePtBr();
    if (!doc.arquivo) doc.arquivo = `${doc.tipoNome.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${forn.id.toLowerCase()}.pdf`;
    if (doc.diasParaVencer !== null && doc.diasParaVencer < 0) {
      doc.diasParaVencer = 180;
      doc.validade = "15/05/2027";
    }
    tituloHist = `Documento aprovado: ${doc.tipoNome}`;
  } else if (dados.acao === "reprovar") {
    novoStatusDoc = "rejeitado";
    statusChecklist = "bad";
    tituloHist = `Documento reprovado: ${doc.tipoNome}`;
  } else if (dados.acao === "pedir_correcao") {
    novoStatusDoc = "pendente";
    statusChecklist = "att";
    tituloHist = `Corre\xE7\xE3o solicitada ao fornecedor: ${doc.tipoNome}`;
  } else if (dados.acao === "simular_reenvio") {
    novoStatusDoc = "em_analise";
    statusChecklist = "pendente";
    doc.emissao = hojePtBr();
    doc.validade = doc.tipoId === "doc-fgts" ? "16/12/2026" : "15/05/2027";
    doc.diasParaVencer = doc.tipoId === "doc-fgts" ? 30 : 180;
    doc.arquivo = `${doc.tipoNome.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_renovado_nov26.pdf`;
    doc.tamanhoKb = 312;
    tituloHist = `Nova vers\xE3o enviada pelo fornecedor: ${doc.tipoNome}`;
  }
  doc.status = novoStatusDoc;
  doc.ultimaAtualizacao = hojePtBr();
  if (dados.observacao) {
    doc.observacaoAnalista = dados.observacao.trim();
  }
  forn.docsVencidos = forn.documentos.filter((d) => d.status === "vencido" || d.status === "rejeitado").length;
  forn.docsVencendo30d = forn.documentos.filter((d) => d.status === "proximo_vencimento").length;
  forn.docsPendentes = forn.documentos.filter((d) => d.status === "pendente").length;
  if (forn.docsVencidos > 0) forn.statusDocumental = "Com vencidos";
  else if (forn.docsPendentes > 0) forn.statusDocumental = "Pendente envio";
  else if (forn.documentos.some((d) => d.status === "em_analise")) forn.statusDocumental = "Em valida\xE7\xE3o";
  else if (forn.docsVencendo30d > 0) forn.statusDocumental = "Pr\xF3ximo do vencimento";
  else forn.statusDocumental = "Completo";
  forn.ultimaAtualizacao = hojePtBr();
  forn.historico.unshift({
    id: `h-${Date.now()}`,
    dataHora: agoraPtBr(),
    tipo: "documento",
    titulo: tituloHist,
    detalhe: dados.observacao || doc.observacaoAnalista,
    usuario: dados.usuario || "Fernanda Ribeiro"
  });
  for (const hom of banco.homologacoes.filter((h) => h.fornecedorId === forn.id)) {
    const ck = hom.checklist.find((c) => c.docId === doc.id || c.item.toLowerCase().includes(doc.tipoNome.toLowerCase().slice(0, 8)));
    if (ck) {
      ck.status = statusChecklist;
      ck.detalhe = dados.observacao || doc.observacaoAnalista;
    }
    hom.pendenciasAbertas = hom.checklist.filter((c) => c.status === "bad" || c.status === "pendente").length;
    hom.ultimaAtualizacao = agoraPtBr();
  }
  return forn;
}
function decidirHomologacao(dados) {
  const hom = banco.homologacoes.find((h) => h.id === dados.homologacaoId);
  if (!hom) throw new Error("Processo de homologa\xE7\xE3o n\xE3o encontrado.");
  const forn = banco.fornecedores.find((f) => f.id === hom.fornecedorId);
  let novoStatusHom = hom.status;
  let rotulo = hom.rotuloStatus;
  let tituloEvento = "";
  if (dados.decisao === "aprovar") {
    novoStatusHom = "aprovada";
    rotulo = "Homologado";
    hom.pendenciasAbertas = 0;
    hom.checklist.forEach((c) => {
      if (c.status === "pendente") c.status = "ok";
    });
    if (forn) {
      forn.statusHomologacao = "Homologado";
      forn.elegibilidade = forn.docsVencidos > 0 ? "Com ressalva" : "Apto";
      forn.notaHomologacao = forn.notaHomologacao || 92;
      const invs = dados.investidasAprovadas?.length ? dados.investidasAprovadas : [hom.investida];
      for (const sg of invs) {
        if (!forn.investidasHomologadas.includes(sg)) forn.investidasHomologadas.push(sg);
      }
      forn.documentos.forEach((d) => {
        if (d.status === "em_analise") d.status = "valido";
      });
      forn.statusDocumental = forn.docsVencidos > 0 ? "Com vencidos" : "Completo";
    }
    tituloEvento = `Homologa\xE7\xE3o ${hom.id} aprovada (${hom.investida})`;
  } else if (dados.decisao === "reprovar") {
    novoStatusHom = "reprovada";
    rotulo = "Reprovada";
    if (forn) {
      forn.statusHomologacao = "Reprovado";
      forn.elegibilidade = "Impedido";
    }
    tituloEvento = `Homologa\xE7\xE3o ${hom.id} reprovada`;
  } else if (dados.decisao === "devolver_fornecedor") {
    novoStatusHom = "com_fornecedor";
    rotulo = "Com fornecedor";
    if (dados.parecer) {
      hom.listaPendencias.unshift(dados.parecer.trim());
      hom.pendenciasAbertas = hom.listaPendencias.length;
    }
    if (forn) {
      forn.statusHomologacao = "Pendente fornecedor";
    }
    tituloEvento = `Homologa\xE7\xE3o ${hom.id} devolvida ao fornecedor com pend\xEAncia`;
  } else if (dados.decisao === "iniciar_analise") {
    novoStatusHom = "em_analise";
    rotulo = "Em an\xE1lise";
    hom.responsavel = dados.usuario || "Fernanda Ribeiro";
    if (forn && forn.statusHomologacao === "Aguardando an\xE1lise") {
      forn.statusHomologacao = "Em an\xE1lise";
    }
    tituloEvento = `An\xE1lise t\xE9cnica iniciada na homologa\xE7\xE3o ${hom.id}`;
  }
  hom.status = novoStatusHom;
  hom.rotuloStatus = rotulo;
  hom.ultimaAtualizacao = agoraPtBr();
  if (dados.parecer) {
    hom.observacoesAnalista = dados.parecer.trim();
    hom.parecerFinal = dados.parecer.trim();
  }
  if (forn) {
    forn.ultimaAtualizacao = hojePtBr();
    forn.historico.unshift({
      id: `h-${Date.now()}`,
      dataHora: agoraPtBr(),
      tipo: "homologacao",
      titulo: tituloEvento,
      detalhe: dados.parecer || hom.observacoesAnalista,
      usuario: dados.usuario || "Fernanda Ribeiro"
    });
  }
  return { homologacao: hom, fornecedor: forn };
}
function criarNovaCotacao(dados) {
  const num = 156 + banco.cotacoes.length;
  const id = `COT-0${num}`;
  const itensFormatados = dados.itens.map((it, idx) => ({
    id: `IT-${num}-${idx + 1}`,
    codigo: it.codigo || `SKU-${idx + 1}`,
    descricao: it.descricao,
    quantidade: Number(it.quantidade) || 1,
    unidade: it.unidade || "UN",
    especificacao: it.especificacao || "Conforme especifica\xE7\xE3o padr\xE3o Plurix",
    precoReferenciaUnit: Number(it.precoReferenciaUnit) || 0
  }));
  const valorEstimado = itensFormatados.reduce((acc, it) => acc + it.quantidade * it.precoReferenciaUnit, 0);
  const convidados = dados.fornecedorIds.map((fid) => banco.fornecedores.find((f) => f.id === fid)).filter((f) => !!f).map((f) => ({
    fornecedorId: f.id,
    nomeFantasia: f.nomeFantasia,
    cnpj: f.cnpj,
    statusHomologacao: f.statusHomologacao,
    docVencido: f.docsVencidos > 0,
    bloqueado: f.bloqueado,
    respondeu: false,
    statusConvite: "Aguardando resposta"
  }));
  const nova = {
    id,
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim(),
    categoria: dados.categoria,
    subcategoria: dados.subcategoria || "Geral",
    investida: dados.investida || "PLX",
    comprador: dados.comprador || "Davi Bigotto",
    abertura: hojePtBr(),
    prazo: dados.prazo || "26/11/2026 18:00",
    horasRestantes: 168,
    status: dados.rascunho ? "Rascunho" : "Aberta",
    valorEstimado: valorEstimado > 0 ? valorEstimado : null,
    condicoesSolicitadas: dados.condicoesSolicitadas,
    itens: itensFormatados,
    fornecedoresConvidados: convidados,
    propostas: [],
    adjudicacao: {
      modo: "lote",
      vencedorLoteFornecedorId: null,
      vencedoresPorItem: {},
      justificativaDecisao: ""
    },
    historico: [
      {
        id: `hc-${Date.now()}`,
        dataHora: agoraPtBr(),
        tipo: "abertura",
        titulo: dados.rascunho ? "Cota\xE7\xE3o salva em rascunho" : `Cota\xE7\xE3o ${id} publicada e enviada a ${convidados.length} fornecedor(es)`,
        detalhe: `Escopo: ${dados.investida} \xB7 ${itensFormatados.length} item(ns) \xB7 Prazo: ${dados.prazo}`,
        usuario: dados.comprador || "Davi Bigotto"
      }
    ]
  };
  banco.cotacoes.unshift(nova);
  return nova;
}
function adjudicarCotacao(dados) {
  const cot = banco.cotacoes.find((c) => c.id === dados.cotacaoId);
  if (!cot) throw new Error("Cota\xE7\xE3o n\xE3o encontrada.");
  cot.adjudicacao = {
    modo: dados.modo,
    vencedorLoteFornecedorId: dados.vencedorLoteFornecedorId,
    vencedoresPorItem: dados.vencedoresPorItem || {},
    justificativaDecisao: dados.justificativaDecisao.trim(),
    aprovadoPor: dados.usuario || "Davi Bigotto",
    aprovadoEm: agoraPtBr()
  };
  if (dados.encerrarCotacao) {
    cot.status = "Encerrada";
    cot.horasRestantes = 0;
  } else if (cot.status === "Aberta" || cot.status === "Recebendo propostas") {
    cot.status = "Em negocia\xE7\xE3o";
  }
  cot.historico.unshift({
    id: `hc-${Date.now()}`,
    dataHora: agoraPtBr(),
    tipo: "decisao",
    titulo: dados.encerrarCotacao ? `Decis\xE3o registrada e cota\xE7\xE3o encerrada (${dados.modo === "lote" ? "Por lote global" : "Por item"})` : `Equaliza\xE7\xE3o atualizada (${dados.modo === "lote" ? "Por lote global" : "Por item"})`,
    detalhe: dados.justificativaDecisao || "Sele\xE7\xE3o de vencedor atualizada no Mapa Comparativo.",
    usuario: dados.usuario || "Davi Bigotto"
  });
  return cot;
}
function salvarConfiguracao(dados) {
  if (dados.tipo === "investida") {
    const p = dados.payload;
    const existente = banco.investidas.find((i) => i.sigla === p.sigla);
    if (existente) {
      Object.assign(existente, p);
    } else {
      banco.investidas.push({
        sigla: String(p.sigla || "NV").toUpperCase(),
        razaoSocial: String(p.razaoSocial || ""),
        nomeFantasia: String(p.nomeFantasia || ""),
        cnpj: String(p.cnpj || "00.000.000/0001-00"),
        uf: String(p.uf || "SP"),
        filiais: Number(p.filiais) || 1,
        situacao: "Ativa",
        cadastro: hojePtBr()
      });
    }
  } else if (dados.tipo === "categoria") {
    const p = dados.payload;
    const novaCat = {
      id: `cat-${Date.now()}`,
      nome: p.nome,
      descricao: p.descricao || "",
      criticidade: p.criticidade || "P2",
      slaHomologacaoDias: Number(p.slaHomologacaoDias) || 5,
      situacao: "Ativa",
      subcategorias: p.subcategoriaInicial ? [{ id: `sub-${Date.now()}`, nome: p.subcategoriaInicial, fornecedoresAtivos: 0, situacao: "Ativa" }] : []
    };
    banco.categorias.push(novaCat);
  } else if (dados.tipo === "subcategoria") {
    const p = dados.payload;
    const cat = banco.categorias.find((c) => c.id === p.categoriaId);
    if (cat) {
      cat.subcategorias.push({
        id: `sub-${Date.now()}`,
        nome: p.nome,
        fornecedoresAtivos: 0,
        situacao: "Ativa"
      });
    }
  } else if (dados.tipo === "tipo_documento") {
    const p = dados.payload;
    banco.tiposDocumento.push({
      id: `doc-${Date.now()}`,
      nome: String(p.nome),
      descricao: String(p.descricao || ""),
      validadeDias: p.validadeDias ? Number(p.validadeDias) : null,
      obrigatorio: Boolean(p.obrigatorio),
      categoriasAplicaveis: Array.isArray(p.categoriasAplicaveis) ? p.categoriasAplicaveis : ["Todas as categorias"],
      investidasAplicaveis: Array.isArray(p.investidasAplicaveis) ? p.investidasAplicaveis : ["PLX"],
      situacao: "Ativo"
    });
  } else if (dados.tipo === "regra_homologacao") {
    const p = dados.payload;
    const reg = banco.regrasHomologacao.find((r) => r.id === p.id);
    if (reg) {
      if (typeof p.ativa === "boolean") reg.ativa = p.ativa;
      if (typeof p.valorParametro === "string") reg.valorParametro = p.valorParametro;
    }
  } else if (dados.tipo === "usuario") {
    const p = dados.payload;
    banco.usuarios.push({
      id: `usr-${Date.now()}`,
      nome: String(p.nome),
      email: String(p.email),
      papel: p.papel || "Comprador",
      investidas: Array.isArray(p.investidas) && p.investidas.length ? p.investidas : ["PLX"],
      situacao: "Ativo",
      ultimoAcesso: "Convite enviado"
    });
  }
  return obterEstadoCompleto();
}

// src/gestaoFornecedores.ts
function resolverCaminhoHtml() {
  const candidatos = [
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "views/pages/gestao_fornecedores.html"),
    path.resolve(process.cwd(), "src/views/pages/gestao_fornecedores.html"),
    path.resolve(process.cwd(), "public/index.html")
  ];
  for (const c of candidatos) {
    if (fs.existsSync(c)) return c;
  }
  return candidatos[1];
}
function createGestaoFornecedoresRouter(opcoes = {}) {
  const router = express.Router();
  router.use(express.json({ limit: "5mb" }));
  const caminhoHtml = resolverCaminhoHtml();
  router.get("/", (_req, res) => {
    const html = fs.readFileSync(caminhoHtml, "utf-8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });
  router.get("/api/estado", (req, res) => {
    try {
      const investida = typeof req.query.investida === "string" ? req.query.investida : void 0;
      const dados = obterEstadoCompleto(investida);
      res.json({ success: true, data: dados });
    } catch {
      res.status(500).json({ success: false, error: "Erro ao carregar os dados de fornecedores e cota\xE7\xF5es." });
    }
  });
  router.post("/api/fornecedores/convidar", (req, res) => {
    try {
      const { razaoSocial, cnpj, email } = req.body || {};
      if (!razaoSocial || !cnpj || !email) {
        res.status(400).json({ success: false, error: "Campos obrigat\xF3rios n\xE3o informados (Raz\xE3o social, CNPJ e E-mail)." });
        return;
      }
      const user = opcoes.getUser?.(req) || "Davi Bigotto";
      const resultado = convidarFornecedor({ ...req.body, usuario: user });
      res.json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || "Erro ao convidar fornecedor." });
    }
  });
  router.post("/api/documentos/avaliar", (req, res) => {
    try {
      const { fornecedorId, docId, acao, observacao } = req.body || {};
      if (!fornecedorId || !docId || !acao) {
        res.status(400).json({ success: false, error: "Campos obrigat\xF3rios n\xE3o informados para avalia\xE7\xE3o do documento." });
        return;
      }
      const user = opcoes.getUser?.(req) || "Fernanda Ribeiro";
      const forn = avaliarDocumentoFornecedor({ fornecedorId, docId, acao, observacao, usuario: user });
      res.json({ success: true, data: forn });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || "Erro ao avaliar documento." });
    }
  });
  router.post("/api/homologacoes/decidir", (req, res) => {
    try {
      const { homologacaoId, decisao, parecer, investidasAprovadas } = req.body || {};
      if (!homologacaoId || !decisao) {
        res.status(400).json({ success: false, error: "Informe a homologa\xE7\xE3o e a decis\xE3o." });
        return;
      }
      const user = opcoes.getUser?.(req) || "Fernanda Ribeiro";
      const resultado = decidirHomologacao({
        homologacaoId,
        decisao,
        parecer: parecer || "",
        investidasAprovadas,
        usuario: user
      });
      res.json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || "Erro ao registrar decis\xE3o da homologa\xE7\xE3o." });
    }
  });
  router.post("/api/cotacoes/criar", (req, res) => {
    try {
      const { titulo, categoria, investida, itens } = req.body || {};
      if (!titulo || !categoria || !Array.isArray(itens) || itens.length === 0) {
        res.status(400).json({ success: false, error: "Informe t\xEDtulo, categoria e pelo menos 1 item para a cota\xE7\xE3o." });
        return;
      }
      const nova = criarNovaCotacao({
        titulo,
        descricao: req.body.descricao || "",
        categoria,
        subcategoria: req.body.subcategoria || "Geral",
        investida: investida || "PLX",
        comprador: req.body.comprador || "Davi Bigotto",
        prazo: req.body.prazo || "26/11/2026 18:00",
        condicoesSolicitadas: req.body.condicoesSolicitadas || {
          pagamentoPadrao: "45 DDL",
          tipoFretePreferencial: "CIF incluso",
          localEntrega: "CDs Plurix",
          impostosRegra: "Impostos inclusos",
          validadeMinimaDias: 30,
          observacoesGerais: ""
        },
        itens,
        fornecedorIds: Array.isArray(req.body.fornecedorIds) ? req.body.fornecedorIds : [],
        rascunho: Boolean(req.body.rascunho)
      });
      res.json({ success: true, data: nova });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || "Erro ao criar cota\xE7\xE3o." });
    }
  });
  router.post("/api/cotacoes/adjudicar", (req, res) => {
    try {
      const { cotacaoId, modo, vencedorLoteFornecedorId, vencedoresPorItem, justificativaDecisao, encerrarCotacao } = req.body || {};
      if (!cotacaoId || !modo) {
        res.status(400).json({ success: false, error: "Informe a cota\xE7\xE3o e o modo de sele\xE7\xE3o." });
        return;
      }
      const user = opcoes.getUser?.(req) || "Davi Bigotto";
      const cot = adjudicarCotacao({
        cotacaoId,
        modo,
        vencedorLoteFornecedorId: vencedorLoteFornecedorId || null,
        vencedoresPorItem: vencedoresPorItem || {},
        justificativaDecisao: justificativaDecisao || "",
        encerrarCotacao: Boolean(encerrarCotacao),
        usuario: user
      });
      res.json({ success: true, data: cot });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || "Erro ao adjudicar cota\xE7\xE3o." });
    }
  });
  router.post("/api/configuracoes/salvar", (req, res) => {
    try {
      const { tipo, payload } = req.body || {};
      if (!tipo || !payload) {
        res.status(400).json({ success: false, error: "Informe o tipo de configura\xE7\xE3o e os dados." });
        return;
      }
      const estado = salvarConfiguracao({ tipo, payload });
      res.json({ success: true, data: estado });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || "Erro ao salvar configura\xE7\xE3o." });
    }
  });
  return router;
}

// src/server.ts
var app = express2();
var PORT = Number(process.env.PORT) || 3e3;
app.use("/public", express2.static(path2.resolve(process.cwd(), "public")));
app.use(express2.json());
var routerFornecedores = createGestaoFornecedoresRouter({
  getUser: () => "Davi Bigotto"
});
app.use("/gestao-fornecedores", routerFornecedores);
app.use("/", routerFornecedores);
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.warn(`[procurement-360] Servidor rodando em http://localhost:${PORT}/gestao-fornecedores`);
  });
}
var server_default = app;

// api/index.ts
function handler(req, res) {
  const originalUrl = req.headers["x-vercel-original-url"] || req.headers["x-matched-path"];
  if (originalUrl && (req.url === "/api/index" || req.url === "/api")) {
    req.url = originalUrl;
  }
  return server_default(req, res);
}
export {
  handler as default
};
