import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'

export interface Env {
  CLIENT_PUBLIC_KEY: string
}

type InteractionBody = {
  type: InteractionType,
  data: {
    name: string
  }
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const sig = request.headers.get('X-Signature-Ed25519');
    const time = request.headers.get('X-Signature-Timestamp');
    const body = await request.json<InteractionBody>();
    const isValid = await verifyKey(JSON.stringify(body), sig, time, env.CLIENT_PUBLIC_KEY);

    if (!isValid) {
		  return new Response('invalid request');
    }

    const interaction = body;
    if(interaction && interaction.type === InteractionType.APPLICATION_COMMAND) {
      return new Response(JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `You used: ${interaction.data.name}`
        },
      }));
    } else {
      return new Response(JSON.stringify({
        type: InteractionResponseType.PONG,
      }));
    }

    return new Response('Hello World!');
  },
};
