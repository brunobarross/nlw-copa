import Fastify from "fastify";
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient({
  // pra debugar a execução
  log: ['query']
})

async function bootstrap(){
  const fastify = Fastify({
    logger: true, //solta log de tudo que estiver sendo feito na aplicação
  })

  //criando rotas
  //http://localhost:3333/pools/count
      // rota de contagem de bolões
  fastify.get('/pools/count',  async ()=>{
    const count = await prisma.pool.count()
    return {count}
  })
  await fastify.listen({port: 3333})
}

bootstrap()

//TSX automatiza o processo de compilação do ts