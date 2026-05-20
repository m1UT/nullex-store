import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import * as crypto from 'crypto'

function parseInitData(initData: string, botToken: string): Record<string, unknown> | null {
  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) return null
    params.delete('hash')

    const checkString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
    const expected = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex')
    if (expected !== hash) return null

    const userStr = params.get('user')
    if (!userStr) return null
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

@Injectable()
export class TmaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const initData: string = req.headers['x-telegram-init-data'] ?? ''

    if (!initData) throw new UnauthorizedException('Missing Telegram init data')

    const tgUser = parseInitData(initData, process.env.BOT_TOKEN ?? '')
    if (!tgUser) throw new UnauthorizedException('Invalid Telegram init data')

    req.tgUser = tgUser
    return true
  }
}
