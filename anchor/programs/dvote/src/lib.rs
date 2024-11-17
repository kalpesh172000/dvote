#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod dvote {
    use super::*;

  pub fn close(_ctx: Context<CloseDvote>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dvote.count = ctx.accounts.dvote.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.dvote.count = ctx.accounts.dvote.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDvote>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.dvote.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDvote<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Dvote::INIT_SPACE,
  payer = payer
  )]
  pub dvote: Account<'info, Dvote>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDvote<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub dvote: Account<'info, Dvote>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub dvote: Account<'info, Dvote>,
}

#[account]
#[derive(InitSpace)]
pub struct Dvote {
  count: u8,
}
