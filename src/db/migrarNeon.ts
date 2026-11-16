import pg from 'pg';
import { SEMENTE_GESTAO_FORNECEDORES } from '../services/gestaoFornecedores/dados.js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_4wFgAPz6yNRm@ep-winter-math-bele647p-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export async function criarTabelasEPopular() {
  const client = await pool.connect();
  try {
    console.log('🚀 Iniciando estruturação do banco Neon PostgreSQL...');
    await client.query('BEGIN');

    // 1. Tabela de Investidas
    await client.query(`
      CREATE TABLE IF NOT EXISTS investidas (
        sigla VARCHAR(20) PRIMARY KEY,
        razao_social VARCHAR(255) NOT NULL,
        nome_fantasia VARCHAR(255) NOT NULL,
        cnpj VARCHAR(30) NOT NULL,
        uf VARCHAR(2) NOT NULL,
        filiais INT NOT NULL DEFAULT 1,
        situacao VARCHAR(30) NOT NULL DEFAULT 'Ativa',
        cadastro VARCHAR(30) NOT NULL
      );
    `);

    // 2. Tabela de Categorias
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        criticidade VARCHAR(10) NOT NULL DEFAULT 'P2',
        sla_homologacao_dias INT NOT NULL DEFAULT 5,
        situacao VARCHAR(30) NOT NULL DEFAULT 'Ativa'
      );
    `);

    // 3. Tabela de Subcategorias
    await client.query(`
      CREATE TABLE IF NOT EXISTS subcategorias (
        id VARCHAR(50) PRIMARY KEY,
        categoria_id VARCHAR(50) REFERENCES categorias(id) ON DELETE CASCADE,
        nome VARCHAR(255) NOT NULL,
        fornecedores_ativos INT NOT NULL DEFAULT 0,
        situacao VARCHAR(30) NOT NULL DEFAULT 'Ativa'
      );
    `);

    // 4. Tabela de Tipos de Documento
    await client.query(`
      CREATE TABLE IF NOT EXISTS tipos_documento (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        validade_dias INT,
        obrigatorio BOOLEAN NOT NULL DEFAULT true,
        categorias_aplicaveis JSONB NOT NULL DEFAULT '[]',
        investidas_aplicaveis JSONB NOT NULL DEFAULT '[]',
        situacao VARCHAR(30) NOT NULL DEFAULT 'Ativo'
      );
    `);

    // 5. Tabela de Regras de Homologação
    await client.query(`
      CREATE TABLE IF NOT EXISTS regras_homologacao (
        id VARCHAR(50) PRIMARY KEY,
        codigo VARCHAR(50) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        escopo VARCHAR(100) NOT NULL DEFAULT 'Todas as investidas',
        valor_parametro TEXT,
        ativa BOOLEAN NOT NULL DEFAULT true
      );
    `);

    // 6. Tabela de Usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        papel VARCHAR(50) NOT NULL,
        investidas JSONB NOT NULL DEFAULT '[]',
        situacao VARCHAR(30) NOT NULL DEFAULT 'Ativo',
        ultimo_acesso VARCHAR(50)
      );
    `);

    // 7. Tabela de Fornecedores
    await client.query(`
      CREATE TABLE IF NOT EXISTS fornecedores (
        id VARCHAR(50) PRIMARY KEY,
        razao_social VARCHAR(255) NOT NULL,
        nome_fantasia VARCHAR(255) NOT NULL,
        cnpj VARCHAR(30) NOT NULL,
        inscricao_estadual VARCHAR(50),
        regime_tributario VARCHAR(50),
        porte VARCHAR(50),
        categoria_id VARCHAR(50),
        categoria VARCHAR(255) NOT NULL,
        subcategoria VARCHAR(255) NOT NULL,
        cidade VARCHAR(100) NOT NULL,
        uf VARCHAR(2) NOT NULL,
        endereco TEXT,
        cep VARCHAR(20),
        contato_comercial JSONB NOT NULL DEFAULT '{}',
        contato_financeiro JSONB NOT NULL DEFAULT '{}',
        socios JSONB NOT NULL DEFAULT '[]',
        investidas_homologadas JSONB NOT NULL DEFAULT '[]',
        status_homologacao VARCHAR(50) NOT NULL,
        status_documental VARCHAR(50) NOT NULL,
        docs_vencidos INT NOT NULL DEFAULT 0,
        docs_vencendo30d INT NOT NULL DEFAULT 0,
        docs_pendentes INT NOT NULL DEFAULT 0,
        elegibilidade VARCHAR(50) NOT NULL,
        bloqueado BOOLEAN NOT NULL DEFAULT false,
        motivo_bloqueio TEXT,
        nota_homologacao INT,
        ultima_atualizacao VARCHAR(50) NOT NULL,
        portal_token VARCHAR(100) NOT NULL,
        documentos JSONB NOT NULL DEFAULT '[]',
        historico JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 8. Tabela de Homologações
    await client.query(`
      CREATE TABLE IF NOT EXISTS homologacoes (
        id VARCHAR(50) PRIMARY KEY,
        fornecedor_id VARCHAR(50) REFERENCES fornecedores(id) ON DELETE CASCADE,
        fornecedor_nome VARCHAR(255) NOT NULL,
        razao_social VARCHAR(255) NOT NULL,
        cnpj VARCHAR(30) NOT NULL,
        investida VARCHAR(20) NOT NULL,
        categoria VARCHAR(255) NOT NULL,
        subcategoria VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        rotulo_status VARCHAR(50) NOT NULL,
        dias_na_etapa INT NOT NULL DEFAULT 0,
        sla_dias INT NOT NULL DEFAULT 5,
        pendencias_abertas INT NOT NULL DEFAULT 0,
        lista_pendencias JSONB NOT NULL DEFAULT '[]',
        responsavel VARCHAR(255) NOT NULL,
        ultima_atualizacao VARCHAR(50) NOT NULL,
        observacoes_analista TEXT,
        parecer_final TEXT,
        checklist JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 9. Tabela de Cotações (RFQ)
    await client.query(`
      CREATE TABLE IF NOT EXISTS cotacoes (
        id VARCHAR(50) PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        categoria VARCHAR(255) NOT NULL,
        subcategoria VARCHAR(255) NOT NULL,
        investida VARCHAR(20) NOT NULL,
        comprador VARCHAR(255) NOT NULL,
        abertura VARCHAR(50) NOT NULL,
        prazo VARCHAR(50) NOT NULL,
        horas_restantes INT NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL,
        valor_estimado NUMERIC(15, 2),
        condicoes_solicitadas JSONB NOT NULL DEFAULT '{}',
        itens JSONB NOT NULL DEFAULT '[]',
        fornecedores_convidados JSONB NOT NULL DEFAULT '[]',
        propostas JSONB NOT NULL DEFAULT '[]',
        adjudicacao JSONB NOT NULL DEFAULT '{}',
        historico JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Criar índices estratégicos para consultas rápidas
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_fornecedores_cnpj ON fornecedores(cnpj);
      CREATE INDEX IF NOT EXISTS idx_fornecedores_status ON fornecedores(status_homologacao);
      CREATE INDEX IF NOT EXISTS idx_homologacoes_status ON homologacoes(status);
      CREATE INDEX IF NOT EXISTS idx_cotacoes_status ON cotacoes(status);
    `);

    console.log('✅ Tabelas e índices criados com sucesso.');
    console.log('📥 Populando dados da base inicial Plurix...');

    const s = SEMENTE_GESTAO_FORNECEDORES;

    // Popular Investidas
    for (const inv of s.investidas) {
      await client.query(`
        INSERT INTO investidas (sigla, razao_social, nome_fantasia, cnpj, uf, filiais, situacao, cadastro)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (sigla) DO UPDATE SET
          razao_social = EXCLUDED.razao_social,
          nome_fantasia = EXCLUDED.nome_fantasia,
          cnpj = EXCLUDED.cnpj,
          uf = EXCLUDED.uf,
          filiais = EXCLUDED.filiais,
          situacao = EXCLUDED.situacao,
          cadastro = EXCLUDED.cadastro;
      `, [inv.sigla, inv.razaoSocial, inv.nomeFantasia, inv.cnpj, inv.uf, inv.filiais, inv.situacao, inv.cadastro]);
    }

    // Popular Categorias e Subcategorias
    for (const cat of s.categorias) {
      await client.query(`
        INSERT INTO categorias (id, nome, descricao, criticidade, sla_homologacao_dias, situacao)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          nome = EXCLUDED.nome,
          descricao = EXCLUDED.descricao,
          criticidade = EXCLUDED.criticidade,
          sla_homologacao_dias = EXCLUDED.sla_homologacao_dias,
          situacao = EXCLUDED.situacao;
      `, [cat.id, cat.nome, cat.descricao, cat.criticidade, cat.slaHomologacaoDias, cat.situacao]);

      for (const sub of cat.subcategorias) {
        await client.query(`
          INSERT INTO subcategorias (id, categoria_id, nome, fornecedores_ativos, situacao)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET
            categoria_id = EXCLUDED.categoria_id,
            nome = EXCLUDED.nome,
            fornecedores_ativos = EXCLUDED.fornecedores_ativos,
            situacao = EXCLUDED.situacao;
        `, [sub.id, cat.id, sub.nome, sub.fornecedoresAtivos, sub.situacao]);
      }
    }

    // Popular Tipos de Documento
    for (const doc of s.tiposDocumento) {
      await client.query(`
        INSERT INTO tipos_documento (id, nome, descricao, validade_dias, obrigatorio, categorias_aplicaveis, investidas_aplicaveis, situacao)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          nome = EXCLUDED.nome,
          descricao = EXCLUDED.descricao,
          validade_dias = EXCLUDED.validade_dias,
          obrigatorio = EXCLUDED.obrigatorio,
          categorias_aplicaveis = EXCLUDED.categorias_aplicaveis,
          investidas_aplicaveis = EXCLUDED.investidas_aplicaveis,
          situacao = EXCLUDED.situacao;
      `, [
        doc.id, doc.nome, doc.descricao, doc.validadeDias, doc.obrigatorio,
        JSON.stringify(doc.categoriasAplicaveis), JSON.stringify(doc.investidasAplicaveis), doc.situacao
      ]);
    }

    // Popular Regras de Homologação
    for (const reg of s.regrasHomologacao) {
      await client.query(`
        INSERT INTO regras_homologacao (id, codigo, titulo, descricao, escopo, valor_parametro, ativa)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          codigo = EXCLUDED.codigo,
          titulo = EXCLUDED.titulo,
          descricao = EXCLUDED.descricao,
          escopo = EXCLUDED.escopo,
          valor_parametro = EXCLUDED.valor_parametro,
          ativa = EXCLUDED.ativa;
      `, [reg.id, reg.codigo, reg.titulo, reg.descricao, reg.escopo || 'Todas as investidas', reg.valorParametro, reg.ativa]);
    }

    // Popular Usuários
    for (const usr of s.usuarios) {
      await client.query(`
        INSERT INTO usuarios (id, nome, email, papel, investidas, situacao, ultimo_acesso)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          nome = EXCLUDED.nome,
          email = EXCLUDED.email,
          papel = EXCLUDED.papel,
          investidas = EXCLUDED.investidas,
          situacao = EXCLUDED.situacao,
          ultimo_acesso = EXCLUDED.ultimo_acesso;
      `, [usr.id, usr.nome, usr.email, usr.papel, JSON.stringify(usr.investidas), usr.situacao, usr.ultimoAcesso]);
    }

    // Popular Fornecedores
    for (const f of s.fornecedores) {
      await client.query(`
        INSERT INTO fornecedores (
          id, razao_social, nome_fantasia, cnpj, inscricao_estadual, regime_tributario, porte,
          categoria_id, categoria, subcategoria, cidade, uf, endereco, cep,
          contato_comercial, contato_financeiro, socios, investidas_homologadas,
          status_homologacao, status_documental, docs_vencidos, docs_vencendo30d, docs_pendentes,
          elegibilidade, bloqueado, motivo_bloqueio, nota_homologacao, ultima_atualizacao, portal_token,
          documentos, historico
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18,
          $19, $20, $21, $22, $23,
          $24, $25, $26, $27, $28, $29,
          $30, $31
        )
        ON CONFLICT (id) DO UPDATE SET
          razao_social = EXCLUDED.razao_social,
          nome_fantasia = EXCLUDED.nome_fantasia,
          cnpj = EXCLUDED.cnpj,
          status_homologacao = EXCLUDED.status_homologacao,
          status_documental = EXCLUDED.status_documental,
          documentos = EXCLUDED.documentos,
          historico = EXCLUDED.historico;
      `, [
        f.id, f.razaoSocial, f.nomeFantasia, f.cnpj, f.inscricaoEstadual, f.regimeTributario, f.porte,
        f.categoriaId, f.categoria, f.subcategoria, f.cidade, f.uf, f.endereco, f.cep,
        JSON.stringify(f.contatoComercial), JSON.stringify(f.contatoFinanceiro), JSON.stringify(f.socios), JSON.stringify(f.investidasHomologadas),
        f.statusHomologacao, f.statusDocumental, f.docsVencidos, f.docsVencendo30d, f.docsPendentes,
        f.elegibilidade, f.bloqueado, f.motivoBloqueio, f.notaHomologacao, f.ultimaAtualizacao, f.portalToken,
        JSON.stringify(f.documentos), JSON.stringify(f.historico)
      ]);
    }

    // Popular Homologações
    for (const h of s.homologacoes) {
      await client.query(`
        INSERT INTO homologacoes (
          id, fornecedor_id, fornecedor_nome, razao_social, cnpj, investida,
          categoria, subcategoria, status, rotulo_status, dias_na_etapa, sla_dias,
          pendencias_abertas, lista_pendencias, responsavel, ultima_atualizacao,
          observacoes_analista, parecer_final, checklist
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16,
          $17, $18, $19
        )
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          rotulo_status = EXCLUDED.rotulo_status,
          dias_na_etapa = EXCLUDED.dias_na_etapa,
          pendencias_abertas = EXCLUDED.pendencias_abertas,
          checklist = EXCLUDED.checklist,
          observacoes_analista = EXCLUDED.observacoes_analista;
      `, [
        h.id, h.fornecedorId, h.fornecedorNome, h.razaoSocial, h.cnpj, h.investida,
        h.categoria, h.subcategoria, h.status, h.rotuloStatus, h.diasNaEtapa, h.slaDias,
        h.pendenciasAbertas, JSON.stringify(h.listaPendencias), h.responsavel, h.ultimaAtualizacao,
        h.observacoesAnalista, h.parecerFinal ?? null, JSON.stringify(h.checklist)
      ]);
    }

    // Popular Cotações (RFQ)
    for (const c of s.cotacoes) {
      await client.query(`
        INSERT INTO cotacoes (
          id, titulo, descricao, categoria, subcategoria, investida, comprador,
          abertura, prazo, horas_restantes, status, valor_estimado,
          condicoes_solicitadas, itens, fornecedores_convidados, propostas, adjudicacao, historico
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18
        )
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          horas_restantes = EXCLUDED.horas_restantes,
          adjudicacao = EXCLUDED.adjudicacao,
          historico = EXCLUDED.historico;
      `, [
        c.id, c.titulo, c.descricao, c.categoria, c.subcategoria, c.investida, c.comprador,
        c.abertura, c.prazo, c.horasRestantes, c.status, c.valorEstimado,
        JSON.stringify(c.condicoesSolicitadas), JSON.stringify(c.itens), JSON.stringify(c.fornecedoresConvidados),
        JSON.stringify(c.propostas), JSON.stringify(c.adjudicacao), JSON.stringify(c.historico)
      ]);
    }

    await client.query('COMMIT');
    console.log('🎉 Migração concluída com sucesso no Neon PostgreSQL!');

    // Mostrar contagem das tabelas
    const contagens = await client.query(`
      SELECT 
        (SELECT count(*) FROM investidas) as investidas,
        (SELECT count(*) FROM categorias) as categorias,
        (SELECT count(*) FROM subcategorias) as subcategorias,
        (SELECT count(*) FROM tipos_documento) as tipos_documento,
        (SELECT count(*) FROM regras_homologacao) as regras_homologacao,
        (SELECT count(*) FROM usuarios) as usuarios,
        (SELECT count(*) FROM fornecedores) as fornecedores,
        (SELECT count(*) FROM homologacoes) as homologacoes,
        (SELECT count(*) FROM cotacoes) as cotacoes;
    `);
    console.log('📊 Registros inseridos no Neon:');
    console.table(contagens.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro na migração para o Neon:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (process.argv[1]?.endsWith('migrarNeon.ts') || process.argv[1]?.endsWith('migrarNeon.js')) {
  criarTabelasEPopular();
}
