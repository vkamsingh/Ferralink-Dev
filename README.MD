<p align="center">
  <img src="https://media.discordapp.net/attachments/936271538196451379/1035586844617883708/feralink_tape.png?width=705&height=134">
</p>

[![Discord](https://img.shields.io/discord/1035595149385945088?color=fa860a&logo=discord&logoColor=white)](https://discord.gg/7M6yGBTn79)
[![npm version](https://img.shields.io/npm/v/ferra-link?style=flat-square)](https://www.npmjs.com/package/ferra-link)
[![npm download](https://img.shields.io/npm/dt/ferra-link.svg?maxAge=3600)](https://www.npmjs.com/package/ferra-link)
![GitHub issues](https://img.shields.io/github/issues-raw/Cd-corgi/Ferralink?style=flat-square)


# 🎶 FerraLink

A Simple but powerful Lavalink Client for your JavaScript Discord Bot!

# 🔨 Requirements 

* Node.js >= 16.9.0 or Latest.
* Discord.js >= 14.6.0.

# 📖 Documentation
- [FerraLink Docs](https://ferralink.gitbook.io/docs/).
- [Shoukaku Docs](https://deivu.github.io/Shoukaku).

# 📂 Implementation
- A [example bot](https://github.com/vkamsingh/Ferralink-Example) as guide for beginners.
- If you have any issues, please join our [support server](https://discord.gg/8n3yNqtPAE).

# 📦 How to Install FerraLink
* Dev: `npm i https://github.com/FerralTeam/Ferralink.git`
* Stable: `npm i npm i ferra-link`

# How to Setup our FerraLink

## Set the Initilizer of Ferralink

*Creating in a way like the code example you can import the bot, nodes and shoukakuOptions.*

```js
const { Client, GatewayIntentBits } = require("discord.js");
const { FerraLink } = require("ferra-link");
const { Connectors } = require("shoukaku");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
});


client.FerraLink = new FerraLink({
    nodes: [{
      name: "Lavalink",
      url: "localhost:2333",
      auth: "youshallpass",
      secure: false
    }],
    shoukakuoptions: {
        moveOnDisconnect: false,
        resumable: false,
        resumableTimeout: 60,
        reconnectTries: 10,
        restTimeout: 60000
    },
    defaultSearchEngine: "spsearch",
}, new Connectors.DiscordJS(client));

client.login("token");
```

## A small example to create play command.
```js
const { LoadType } = require('shoukaku');

module.exports = {
   name: "play",
   aliases: ["p"],
   run: async (client, message, args) => {
   
const player = await client.FerraLink.createPlayer({
    guildId: message.guild.id,
    voiceId: message.member.voice.channel.id,
    textId: message.channel.id,
    shardId: message.guild.shardId,
    volume: 100,
    deaf: true,
});

const resolve = await player.search(args.join(' '));
if (!resolve || [LoadType.ERROR, LoadType.EMPTY].includes(resolve.loadType)) return message.reply({ content: "No match songs result found!" });

if (resolve.loadType === LoadType.PLAYLIST) {
        for (const track of resolve.data.tracks) {
        player.queue.add(track);
    }
} else if (resolve.loadType === LoadType.SEARCH) {
    player.queue.add(resolve.data[0]);
} else {
    player.queue.add(resolve.data);
}

if (resolve.loadType === LoadType.PLAYLIST) {
    message.channel.send({ content: `Added ${player.queue.length} tracks from **${resolve.data.info.name}**` });
} else {
    message.channel.send({ content: `Added [${resolve.data[0].info.title}](${resolve.data[0].info.uri}) to queue` });
}

if (!player.playing && !player.paused) await player.play();
```

# Getting the Events (shoukaku)

> *You can access event with the help of `client.FerraLink.shoukaku.on()....`.*

<center>

| **Event Name** 	|   **Elements**  	  |       **Description**         |
|:--------------:	|:------------------: |:----------------------------: |
|   ready 	      | name, resumed       | Event of the node connection. |
|   error         | name, error 	      | Event of the node error.      |
|   close         | name, code, reason  | Event of the node close.	    |
|   disconnect    | name, players, move | Event of the node disconnect.	|
|   debug         | name, reason	      | Event of the node debug.      |
</center>

# Getting the Events (FerraLink)

> *You can access event with the help of `client.FerraLink.on()....`.*

<center>

| **Event Name** 	  |   **Elements**  |       **Description**         |
|:----------------: |:--------------: |:----------------------------: |
|   trackStart	    | player, track   | Event of the track start.     |
|   trackEnd        | player, track	  | Event of the track end.       |
|   queueEnd        | player          | Event of the queue end.	      |
|   PlayerClosed    | player, data    | Event of the player close.	  |
|   trackException  | player, data	  | Event of the track exception. |
|   PlayerUpdate    | player, data	  | Event of the player update.   |
|   trackStuck      | player, data	  | Event of the track stuck.     |
|   trackError      | player, error   | Event of the track error.     |
|   PlayerResumed   | player          | Event of the player resumed.  |
|   PlayerDestroy   | player	        | Event of the player destroyed.|
|   PlayerCreate    | player	        | Event of the player create.   |
</center>

## Donations 🧡🧡
> You can donate to us to improve our project!

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/CorgiOtterBot)

## Contributors
> Deivu as the owner of [Shoukaku](https://github.com/Deivu/Shoukaku).
>
> Vkamsingh, Corgi as the owner of [FerraLink](https://github.com/Cd-corgi/Ferralink).
>
> Prahar as the maintainer of [FerraLink Docs](https://ferralink.gitbook.io/untitled).
>
> Inspired by [kazagumo](https://www.npmjs.com/package/kazagumo), [Poru](https://www.npmjs.com/package/poru) and [erela.js](https://www.npmjs.com/package/erela.js).