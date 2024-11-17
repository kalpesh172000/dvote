// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DvoteIDL from '../target/idl/dvote.json'
import type { Dvote } from '../target/types/dvote'

// Re-export the generated IDL and type
export { Dvote, DvoteIDL }

// The programId is imported from the program IDL.
export const DVOTE_PROGRAM_ID = new PublicKey(DvoteIDL.address)

// This is a helper function to get the Dvote Anchor program.
export function getDvoteProgram(provider: AnchorProvider) {
  return new Program(DvoteIDL as Dvote, provider)
}

// This is a helper function to get the program ID for the Dvote program depending on the cluster.
export function getDvoteProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Dvote program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return DVOTE_PROGRAM_ID
  }
}
