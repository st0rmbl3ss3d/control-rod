import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { api } from '~/utils/api';

const Disclosures: NextPage = () => {
  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-12 px-9 py-16 text-slate-100 text-7xl">
        <h1>THIS IS DISCLOSURES!</h1>
      </div>
        </>
    );
};

export default Disclosures;