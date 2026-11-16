import pg from 'pg';
import type {
  EstadoBancoFornecedores,
  Fornecedor,
  ProcessoHomologacao,
  CotacaoRFQ,
  Investida,
  CategoriaCompras,
  TipoDocumento,
  RegraHomologacao,
  UsuarioPlataforma,
} from '../services/gestaoFornecedores/dados.js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_4wFgAPz6yNRm@ep-winter-math-bele647p-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 5000,
  allowExitOnIdle: true,
});

export async function carregarEstadoDoNeon(): Promise<EstadoBancoFornecedores | null> {
  try {
    const [
      resInv,
      resCat,
      resSub,
      resDoc,
      resReg,
      resUsr,
      resForn,
      resHom,
      resCot,
    ] = await Promise.all([
      pool.query('SELECT * FROM investidas ORDER BY sigla ASC'),
      pool.query('SELECT * FROM categorias ORDER BY nome ASC'),
      pool.query('SELECT * FROM subcategorias ORDER BY nome ASC'),
      pool.query('SELECT * FROM tipos_documento ORDER BY nome ASC'),
      pool.query('SELECT * FROM regras_homologacao ORDER BY codigo ASC'),
      pool.query('SELECT * FROM usuarios ORDER BY nome ASC'),
      pool.query('SELECT * FROM fornecedores ORDER BY created_at DESC'),
      pool.query('SELECT * FROM homologacoes ORDER BY created_at DESC'),
      pool.query('SELECT * FROM cotacoes ORDER BY created_at DESC'),
    ]);

    const subcategoriasPorCat = new Map<string, Array<{ id: string; nome: string; fornecedoresAtivos: number; situacao: 'Ativa' | 'Inativa' }>>();
    for (const r of resSub.rows) {
      const list = subcategoriasPorCat.get(r.categoria_id) || [];
      list.push({
        id: r.id,
        nome: r.nome,
        fornecedoresAtivos: r.fornecedores_ativos,
        situacao: r.situacao,
      });
      subcategoriasPorCat.set(r.categoria_id, list);
    }

    const categorias: CategoriaCompras[] = resCat.rows.map(r => ({
      id: r.id,
      nome: r.nome,
      descricao: r.descricao,
      criticidade: r.criticidade,
      slaHomologacaoDias: r.sla_homologacao_dias,
      situacao: r.situacao,
      subcategorias: subcategoriasPorCat.get(r.id) || [],
    }));

    const investidas: Investida[] = resInv.rows.map(r => ({
      sigla: r.sigla,
      razaoSocial: r.razao_social,
      nomeFantasia: r.nome_fantasia,
      cnpj: r.cnpj,
      uf: r.uf,
      filiais: r.filiais,
      situacao: r.situacao,
      cadastro: r.cadastro,
    }));

    const tiposDocumento: TipoDocumento[] = resDoc.rows.map(r => ({
      id: r.id,
      nome: r.nome,
      descricao: r.descricao,
      validadeDias: r.validade_dias,
      obrigatorio: r.obrigatorio,
      categoriasAplicaveis: typeof r.categorias_aplicaveis === 'string' ? JSON.parse(r.categorias_aplicaveis) : r.categorias_aplicaveis,
      investidasAplicaveis: typeof r.investidas_aplicaveis === 'string' ? JSON.parse(r.investidas_aplicaveis) : r.investidas_aplicaveis,
      situacao: r.situacao,
    }));

    const regrasHomologacao: RegraHomologacao[] = resReg.rows.map(r => ({
      id: r.id,
      codigo: r.codigo,
      titulo: r.titulo,
      descricao: r.descricao,
      escopo: r.escopo,
      valorParametro: r.valor_parametro,
      ativa: r.ativa,
    }));

    const usuarios: UsuarioPlataforma[] = resUsr.rows.map(r => ({
      id: r.id,
      nome: r.nome,
      email: r.email,
      papel: r.papel,
      investidas: typeof r.investidas === 'string' ? JSON.parse(r.investidas) : r.investidas,
      situacao: r.situacao,
      ultimoAcesso: r.ultimo_acesso,
    }));

    const fornecedores: Fornecedor[] = resForn.rows.map(r => ({
      id: r.id,
      razaoSocial: r.razao_social,
      nomeFantasia: r.nome_fantasia,
      cnpj: r.cnpj,
      inscricaoEstadual: r.inscricao_estadual,
      regimeTributario: r.regime_tributario,
      porte: r.porte,
      categoriaId: r.categoria_id,
      categoria: r.categoria,
      subcategoria: r.subcategoria,
      cidade: r.cidade,
      uf: r.uf,
      endereco: r.endereco,
      cep: r.cep,
      contatoComercial: typeof r.contato_comercial === 'string' ? JSON.parse(r.contato_comercial) : r.contato_comercial,
      contatoFinanceiro: typeof r.contato_financeiro === 'string' ? JSON.parse(r.contato_financeiro) : r.contato_financeiro,
      socios: typeof r.socios === 'string' ? JSON.parse(r.socios) : r.socios,
      investidasHomologadas: typeof r.investidas_homologadas === 'string' ? JSON.parse(r.investidas_homologadas) : r.investidas_homologadas,
      statusHomologacao: r.status_homologacao,
      statusDocumental: r.status_documental,
      docsVencidos: r.docs_vencidos,
      docsVencendo30d: r.docs_vencendo30d,
      docsPendentes: r.docs_pendentes,
      elegibilidade: r.elegibilidade,
      bloqueado: r.bloqueado,
      motivoBloqueio: r.motivo_bloqueio,
      notaHomologacao: r.nota_homologacao,
      ultimaAtualizacao: r.ultima_atualizacao,
      portalToken: r.portal_token,
      documentos: typeof r.documentos === 'string' ? JSON.parse(r.documentos) : r.documentos,
      historico: typeof r.historico === 'string' ? JSON.parse(r.historico) : r.historico,
    }));

    const homologacoes: ProcessoHomologacao[] = resHom.rows.map(r => ({
      id: r.id,
      fornecedorId: r.fornecedor_id,
      fornecedorNome: r.fornecedor_nome,
      razaoSocial: r.razao_social,
      cnpj: r.cnpj,
      investida: r.investida,
      categoria: r.categoria,
      subcategoria: r.subcategoria,
      status: r.status,
      rotuloStatus: r.rotulo_status,
      diasNaEtapa: r.dias_na_etapa,
      slaDias: r.sla_dias,
      pendenciasAbertas: r.pendencias_abertas,
      listaPendencias: typeof r.lista_pendencias === 'string' ? JSON.parse(r.lista_pendencias) : r.lista_pendencias,
      responsavel: r.responsavel,
      ultimaAtualizacao: r.ultima_atualizacao,
      observacoesAnalista: r.observacoes_analista,
      parecerFinal: r.parecer_final,
      checklist: typeof r.checklist === 'string' ? JSON.parse(r.checklist) : r.checklist,
    }));

    const cotacoes: CotacaoRFQ[] = resCot.rows.map(r => ({
      id: r.id,
      titulo: r.titulo,
      descricao: r.descricao,
      categoria: r.categoria,
      subcategoria: r.subcategoria,
      investida: r.investida,
      comprador: r.comprador,
      abertura: r.abertura,
      prazo: r.prazo,
      horasRestantes: r.horas_restantes,
      status: r.status,
      valorEstimado: r.valor_estimado ? Number(r.valor_estimado) : null,
      condicoesSolicitadas: typeof r.condicoes_solicitadas === 'string' ? JSON.parse(r.condicoes_solicitadas) : r.condicoes_solicitadas,
      itens: typeof r.itens === 'string' ? JSON.parse(r.itens) : r.itens,
      fornecedoresConvidados: typeof r.fornecedores_convidados === 'string' ? JSON.parse(r.fornecedores_convidados) : r.fornecedores_convidados,
      propostas: typeof r.propostas === 'string' ? JSON.parse(r.propostas) : r.propostas,
      adjudicacao: typeof r.adjudicacao === 'string' ? JSON.parse(r.adjudicacao) : r.adjudicacao,
      historico: typeof r.historico === 'string' ? JSON.parse(r.historico) : r.historico,
    }));

    return {
      investidas,
      categorias,
      tiposDocumento,
      regrasHomologacao,
      usuarios,
      fornecedores,
      homologacoes,
      cotacoes,
    };
  } catch (error) {
    console.warn('[neonService] Falha ao carregar dados do Neon, usando cache em memória:', (error as Error).message);
    return null;
  }
}

export async function salvarFornecedorNoNeon(forn: Fornecedor): Promise<void> {
  try {
    await pool.query(`
      INSERT INTO fornecedores (
        id, razao_social, nome_fantasia, cnpj, inscricao_estadual, regime_tributario, porte,
        categoria_id, categoria, subcategoria, cidade, uf, endereco, cep,
        contato_comercial, contato_financeiro, socios, investidas_homologadas,
        status_homologacao, status_documental, docs_vencidos, docs_vencendo30d, docs_pendentes,
        elegibilidade, bloqueado, motivo_bloqueio, nota_homologacao, ultima_atualizacao, portal_token,
        documentos, historico, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18,
        $19, $20, $21, $22, $23,
        $24, $25, $26, $27, $28, $29,
        $30, $31, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        razao_social = EXCLUDED.razao_social,
        nome_fantasia = EXCLUDED.nome_fantasia,
        cnpj = EXCLUDED.cnpj,
        status_homologacao = EXCLUDED.status_homologacao,
        status_documental = EXCLUDED.status_documental,
        docs_vencidos = EXCLUDED.docs_vencidos,
        docs_vencendo30d = EXCLUDED.docs_vencendo30d,
        docs_pendentes = EXCLUDED.docs_pendentes,
        elegibilidade = EXCLUDED.elegibilidade,
        bloqueado = EXCLUDED.bloqueado,
        motivo_bloqueio = EXCLUDED.motivo_bloqueio,
        nota_homologacao = EXCLUDED.nota_homologacao,
        ultima_atualizacao = EXCLUDED.ultima_atualizacao,
        investidas_homologadas = EXCLUDED.investidas_homologadas,
        documentos = EXCLUDED.documentos,
        historico = EXCLUDED.historico,
        updated_at = NOW();
    `, [
      forn.id, forn.razaoSocial, forn.nomeFantasia, forn.cnpj, forn.inscricaoEstadual, forn.regimeTributario, forn.porte,
      forn.categoriaId, forn.categoria, forn.subcategoria, forn.cidade, forn.uf, forn.endereco, forn.cep,
      JSON.stringify(forn.contatoComercial), JSON.stringify(forn.contatoFinanceiro), JSON.stringify(forn.socios), JSON.stringify(forn.investidasHomologadas),
      forn.statusHomologacao, forn.statusDocumental, forn.docsVencidos, forn.docsVencendo30d, forn.docsPendentes,
      forn.elegibilidade, forn.bloqueado, forn.motivoBloqueio, forn.notaHomologacao, forn.ultimaAtualizacao, forn.portalToken,
      JSON.stringify(forn.documentos), JSON.stringify(forn.historico),
    ]);
  } catch (err) {
    console.error('[neonService] Erro ao salvar fornecedor no Neon:', (err as Error).message);
  }
}

export async function salvarHomologacaoNoNeon(hom: ProcessoHomologacao): Promise<void> {
  try {
    await pool.query(`
      INSERT INTO homologacoes (
        id, fornecedor_id, fornecedor_nome, razao_social, cnpj, investida,
        categoria, subcategoria, status, rotulo_status, dias_na_etapa, sla_dias,
        pendencias_abertas, lista_pendencias, responsavel, ultima_atualizacao,
        observacoes_analista, parecer_final, checklist, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        rotulo_status = EXCLUDED.rotulo_status,
        dias_na_etapa = EXCLUDED.dias_na_etapa,
        pendencias_abertas = EXCLUDED.pendencias_abertas,
        lista_pendencias = EXCLUDED.lista_pendencias,
        responsavel = EXCLUDED.responsavel,
        ultima_atualizacao = EXCLUDED.ultima_atualizacao,
        observacoes_analista = EXCLUDED.observacoes_analista,
        parecer_final = EXCLUDED.parecer_final,
        checklist = EXCLUDED.checklist,
        updated_at = NOW();
    `, [
      hom.id, hom.fornecedorId, hom.fornecedorNome, hom.razaoSocial, hom.cnpj, hom.investida,
      hom.categoria, hom.subcategoria, hom.status, hom.rotuloStatus, hom.diasNaEtapa, hom.slaDias,
      hom.pendenciasAbertas, JSON.stringify(hom.listaPendencias), hom.responsavel, hom.ultimaAtualizacao,
      hom.observacoesAnalista, hom.parecerFinal ?? null, JSON.stringify(hom.checklist),
    ]);
  } catch (err) {
    console.error('[neonService] Erro ao salvar homologação no Neon:', (err as Error).message);
  }
}

export async function salvarCotacaoNoNeon(cot: CotacaoRFQ): Promise<void> {
  try {
    await pool.query(`
      INSERT INTO cotacoes (
        id, titulo, descricao, categoria, subcategoria, investida, comprador,
        abertura, prazo, horas_restantes, status, valor_estimado,
        condicoes_solicitadas, itens, fornecedores_convidados, propostas, adjudicacao, historico, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        horas_restantes = EXCLUDED.horas_restantes,
        adjudicacao = EXCLUDED.adjudicacao,
        historico = EXCLUDED.historico,
        propostas = EXCLUDED.propostas,
        updated_at = NOW();
    `, [
      cot.id, cot.titulo, cot.descricao, cot.categoria, cot.subcategoria, cot.investida, cot.comprador,
      cot.abertura, cot.prazo, cot.horasRestantes, cot.status, cot.valorEstimado,
      JSON.stringify(cot.condicoesSolicitadas), JSON.stringify(cot.itens), JSON.stringify(cot.fornecedoresConvidados),
      JSON.stringify(cot.propostas), JSON.stringify(cot.adjudicacao), JSON.stringify(cot.historico),
    ]);
  } catch (err) {
    console.error('[neonService] Erro ao salvar cotação no Neon:', (err as Error).message);
  }
}
