import express from 'express'
import path from 'node:path'
import { createGestaoFornecedoresRouter } from './gestaoFornecedores.js'

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use('/public', express.static(path.resolve(process.cwd(), 'public')))
app.use(express.json())

const routerFornecedores = createGestaoFornecedoresRouter({
  getUser: () => 'Davi Bigotto',
})

app.use('/gestao-fornecedores', routerFornecedores)
app.use('/', routerFornecedores)

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.warn(`[procurement-360] Servidor rodando em http://localhost:${PORT}/gestao-fornecedores`)
  })
}

export default app
