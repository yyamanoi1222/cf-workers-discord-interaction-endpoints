#! /usr/bin/env node

import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder().setName('ping').setDescription('replies with pong!');

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [data.toJSON()]});
})();
