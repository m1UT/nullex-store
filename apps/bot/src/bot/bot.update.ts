import { Start, Help, Update } from 'nestjs-telegraf'
import { Context } from 'telegraf'

@Update()
export class BotUpdate {
  @Start()
  async onStart(ctx: Context): Promise<void> {
    await ctx.reply(
      '👋 Welcome to *Nullex Store*!\n\nBrowse and buy digital goods.',
      { parse_mode: 'Markdown' },
    )
  }

  @Help()
  async onHelp(ctx: Context): Promise<void> {
    await ctx.reply('Use the mini app button below to open the store.')
  }
}
