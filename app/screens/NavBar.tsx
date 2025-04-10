import React from 'react';
import Link from 'next/link';
import { HiOutlineWallet } from "react-icons/hi2";
import { VscSymbolColor } from "react-icons/vsc"; 
// import HeySolanaLogo from '../components/HeySolanaLogo';



const NavBar = () => {
  return (
    <div className="text-black">
      <div>
        <Link href="/" className="text-2xl font-bold">
          <HiOutlineWallet />
        </Link>
        <Link href="/" className="text-2xl font-bold">
          <VscSymbolColor />
        </Link>
      </div>
    </div>
  )
}

export default NavBar
