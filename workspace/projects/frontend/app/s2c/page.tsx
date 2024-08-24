'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const s2c = () => {
  const [contractId, setContractId] = useState('');
  const router = useRouter();

  const handleSign = async () => {

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">

    </div>
  );
};

export default s2c;
