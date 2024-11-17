import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Dvote} from '../target/types/dvote'

describe('dvote', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Dvote as Program<Dvote>

  const dvoteKeypair = Keypair.generate()

  it('Initialize Dvote', async () => {
    await program.methods
      .initialize()
      .accounts({
        dvote: dvoteKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([dvoteKeypair])
      .rpc()

    const currentCount = await program.account.dvote.fetch(dvoteKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Dvote', async () => {
    await program.methods.increment().accounts({ dvote: dvoteKeypair.publicKey }).rpc()

    const currentCount = await program.account.dvote.fetch(dvoteKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Dvote Again', async () => {
    await program.methods.increment().accounts({ dvote: dvoteKeypair.publicKey }).rpc()

    const currentCount = await program.account.dvote.fetch(dvoteKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Dvote', async () => {
    await program.methods.decrement().accounts({ dvote: dvoteKeypair.publicKey }).rpc()

    const currentCount = await program.account.dvote.fetch(dvoteKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set dvote value', async () => {
    await program.methods.set(42).accounts({ dvote: dvoteKeypair.publicKey }).rpc()

    const currentCount = await program.account.dvote.fetch(dvoteKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the dvote account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        dvote: dvoteKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.dvote.fetchNullable(dvoteKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
