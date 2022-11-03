

import Image from "next/image"
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import LogoImg from "../assets/logo.svg";
import userAvatarExampleImg from "../assets/users-avatar-example.png"
import iconCheckImg from "../assets/icon-check.svg"
import { api } from "../lib/axios";
import React, { FormEvent } from "react";

interface HomeProps{
  poolCount: Number;
  guessCount: Number;
  usersCount: Number;
}

export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle] = React.useState('');
  async function createPool(event: FormEvent){
    event.preventDefault();
    try{
      const response = await api.post('/pools',{
        title: poolTitle
      });
      const {code} = await response.data;
      await navigator.clipboard.writeText(code)
      alert('Bolão criado com sucesso, o código foi copiado para a área de transferência')
      setPoolTitle('')
    } catch(err){
     alert('Falha ao criar o bolão, tente novamente')
    }


  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28" >
      <main>
        <Image src={LogoImg} alt="Logo NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarExampleImg} alt=""/>
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex items-center gap-2">
          <input type="text" 
          required
          placeholder="Qual nome do seu bolão?"
          className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100" value={poolTitle} onChange={event => setPoolTitle(event.target.value)}
          />
    
          <button type="submit" className=" px-6 py-4 bg-yellow-500 rounded text-gray-900 font-bold text-sm uppercase transition hover:bg-yellow-700">Criar meu bolão</button>
        </form>
  
        <p className="mt-4 text-gray-300 text-sm leading-relaxed ">Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100 ">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt=""/>
            <div className="flex flex-col">
              <span className="block font-bold text-2xl">+{props.poolCount}</span>
              <span className="block text-base mt-1">Bolões criados </span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt=""/>
            <div className="flex flex-col">
              <span className="block font-bold text-2xl">+{props.guessCount}</span>
              <span className="block text-base mt-1">Palpites enviados </span>
            </div>
          </div>
        </div>

      </main>

    <Image src={appPreviewImg} alt="Dois celulares mostrando uma prévia da aplicação móvel do NLW Copa" quality={100}/>
    </div>
  )
}



//forma de usar os scripts mesmo que o javascript do navegador esteja desabilidado
export const getServerSideProps = async () => {

//promisse.all
  const [poolCountResponse,guessCountResponse,userCountResponse ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
    
  ])
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: userCountResponse.data.count,
    },
  };
};
