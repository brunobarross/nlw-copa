import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query']
});




async function main(){
  const user = await prisma.user.create({
    data:{
      name: 'John Doe',
      email: 'altamiro@example.com',
      avatarUrl: 'https://github.com/brunobarross/brunobarross.png'
    }
  })


  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id
        }
        
      }
    }
  })

  await prisma.game.create({
    data:{
      date:'2022-11-03T12:00:00.318Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',

    }
  })

  await prisma.game.create({
    data:{
      date:'2022-11-05T12:00:00.318Z',
      firstTeamCountryCode: 'AR',
      secondTeamCountryCode: 'BR',
      guesses:{
        create:{
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant:{
            connect:{
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
          
        }
      }
    }
  })

}

main()