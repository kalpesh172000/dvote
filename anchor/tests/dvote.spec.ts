import * as anchor from "@coral-xyz/anchor";
import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Dvote } from "../target/types/dvote";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
const IDL = require("../target/idl/dvote.json");

const votingAddress = new PublicKey(
  "AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ",
);
describe("dvote", () => {
  let context;
  let provider;
  let votingProgram: Program<Dvote>;
  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "dvote", programId: votingAddress }],
      [],
    );
    provider = new BankrunProvider(context);
    votingProgram = new Program<Dvote>(IDL, provider);
  });

  it("Initialize Dvote", async () => {
    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1), // pollId
        "What is your favorite character?", // description
        new anchor.BN(0), // pollStart
        new anchor.BN(1831840003), // pollEnd
      )
      .rpc();
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress,
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite character?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it("Initialize Candidate", async () => {
    await votingProgram.methods
      .initializeCandidate("Spongebob", new anchor.BN(1))
      .rpc();
    await votingProgram.methods
      .initializeCandidate("Patrick", new anchor.BN(1))
      .rpc();
    const [SpongebobAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Spongebob")],
      votingAddress,
    );
    const SpongebobCandiate =
      await votingProgram.account.candidate.fetch(SpongebobAddress);
    console.log(SpongebobCandiate);
    expect(SpongebobCandiate.candidateVotes.toNumber()).toEqual(0);
    const [PatrickAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Patrick")],
      votingAddress,
    );
    const PatrickCandiate =
      await votingProgram.account.candidate.fetch(PatrickAddress);
    console.log(PatrickCandiate);
    expect(PatrickCandiate.candidateVotes.toNumber()).toEqual(0);
  });

  it("Vote", async () => {
    await votingProgram.methods.vote("Spongebob", new anchor.BN(1)).rpc();
    await votingProgram.methods.vote("Spongebob", new anchor.BN(1)).rpc();
    await votingProgram.methods.vote("Spongebob", new anchor.BN(1)).rpc();
    const [SpongebobAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Spongebob")],
      votingAddress,
    );
    const SpongebobCandiate =
      await votingProgram.account.candidate.fetch(SpongebobAddress);
    console.log(SpongebobCandiate);
    expect(SpongebobCandiate.candidateVotes.toNumber()).toEqual(1);
  });
});
