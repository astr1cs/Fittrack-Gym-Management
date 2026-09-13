import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Pusher from 'pusher'

@Injectable()
export class PusherService {
  private pusher: Pusher

  constructor(private config: ConfigService) {
    this.pusher = new Pusher({
      appId: this.config.get<string>('PUSHER_APP_ID')!,
      key: this.config.get<string>('PUSHER_KEY')!,
      secret: this.config.get<string>('PUSHER_SECRET')!,
      cluster: this.config.get<string>('PUSHER_CLUSTER')!,
      useTLS: true,
    })
  }

  async trigger(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data)
  }
}