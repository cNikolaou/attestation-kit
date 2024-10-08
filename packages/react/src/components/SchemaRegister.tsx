import * as React from 'react';
import { useState } from 'react';

import { useAccount } from 'wagmi';
import { contracts } from '@attkit/core';

import { useSchemaRegister, useEthersSigner } from '../hooks';

export function SchemaRegister() {
  const { chain, isConnected } = useAccount();
  const [schemaRaw, setSchemaRaw] = useState('');
  const [isRevocable, setIsRevocable] = useState(false);
  const [resolverAddress, setResolverAddress] = useState('');

  const schemaRegistryContractAddress = chain ? contracts[chain.id]?.schemaRegistry : undefined;

  const signer = useEthersSigner();
  const { schemaUID, error, registerNewSchema } = useSchemaRegister(
    signer,
    schemaRegistryContractAddress,
  );

  function handleCreate() {
    if (schemaRaw !== '') {
      registerNewSchema({ schemaRaw });
    }
  }

  if (!isConnected || !chain) {
    return <div>Waiting to connect to your wallet!</div>;
  }

  return (
    <>
      <h2>Register New Schema</h2>
      <div>
        <label htmlFor="schema-schema">Schema: </label>
        <input
          type="text"
          id="schema-schema"
          value={schemaRaw}
          onChange={(e) => setSchemaRaw(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="schema-revocable">Is Revocable?: </label>
        <input
          type="checkbox"
          id="schema-revocable"
          checked={isRevocable}
          onChange={() => setIsRevocable(!isRevocable)}
        />
      </div>
      <div>
        <label htmlFor="schema-resolver">Resolver address: </label>
        <input
          type="text"
          id="schema-resolver"
          value={resolverAddress}
          onChange={(e) => setResolverAddress(e.target.value)}
        />
      </div>
      <button onClick={handleCreate}>Create Schema</button>
      {error ? (
        <div>Error when creating schema {error.message}</div>
      ) : (
        <div>SchemaUID: {schemaUID}.</div>
      )}
    </>
  );
}
