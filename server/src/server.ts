import Fastify from "fastify";
import cors from '@fastify/cors'
import {PrismaClient} from '@prisma/client'
import {z} from 'zod'
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
  // pra debugar a execução
  log: ['query']
})

async function bootstrap(){
  const fastify = Fastify({
    logger: true, //solta log de tudo que estiver sendo feito na aplicação
  })

  await fastify.register(cors,{
    origin: true,
  })

  //criando rotas
  //http://localhost:3333/pools/count
      // rota de contagem de bolões
  fastify.get('/pools/count',  async ()=>{
    const count = await prisma.pool.count()

    return {count}
  })

  fastify.get('/users/count',  async ()=>{
    const count = await prisma.user.count()

    return {count}
  })

  fastify.get('/guesses/count',  async ()=>{
    const count = await prisma.guess.count()

    return {count}
  })

  fastify.post('/pools',  async (request,reply)=>{
    //validação de que não pode ser vazio
    const createPoolBody = z.object({
      title: z.string(),
    })
    const {title} = createPoolBody.parse(request.body)
    const generate = new ShortUniqueId({length: 6})
    const code = String(generate()).toLowerCase();
    
    await prisma.pool.create({
      data:{
        title,
        code: code
      }
    })
    return reply.status(201).send({code})
  })


  await fastify.listen({port: 3333, /*host: '0.0.0.0'*/})
}

bootstrap()

//TSX automatiza o processo de compilação do ts