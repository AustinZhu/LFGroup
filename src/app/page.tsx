import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <Image
        alt='Logo'
        src="/logo.png"
        width={200}
        height={200}
      />
      <h1 className='text-4xl font-bold'>Welcome to</h1>
      <h1 className='text-4xl font-bold'>Lenstalk</h1>
      <button className='btn btn-wide'>Connect Wallet</button>
    </div>
  )
}
