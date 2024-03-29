<p align="center">
  <img src="https://media.discordapp.net/attachments/936271538196451379/1035586844617883708/feralink_tape.png?width=705&height=134">
</p>

[![Discord](https://img.shields.io/discord/1035595149385945088?color=fa860a&logo=discord&logoColor=white)](https://discord.gg/7M6yGBTn79)
[![npm version](https://img.shields.io/npm/v/ferra-link?style=flat-square)](https://www.npmjs.com/package/ferra-link)
[![npm download](https://img.shields.io/npm/dt/ferra-link.svg?maxAge=3600)](https://www.npmjs.com/package/ferra-link)
![GitHub issues](https://img.shields.io/github/issues-raw/Cd-corgi/Ferralink?style=flat-square)


## 🎶 FerraLink

A simple but powerful Lavalink client with amazing features

## Features

- Stable.
- ESM & CommonJS supported.
- Updated for Lavalink v4.

## 📂 Implementation
- A [example bot](https://github.com/vkamsingh/Ferralink-Example) as guide for beginners.
- If you have any issues, please join our [support server](https://discord.gg/8n3yNqtPAE).

## 📦 How to Install FerraLink
* Dev: `npm i https://github.com/vkamsingh/Ferralink-Dev.git`
* Stable: `npm i npm i ferra-link`

## Configuring the module.
### ES Modules (ESM)
```js
import { FerraLink } from 'ferra-link';
```

### CommonJS
```js
const { FerraLink } = require("ferra-link");
```

## Small code snippet examples.
> Set the Initilizer of Ferralink.
```js
const { Client } = require("discord.js");
const { FerraLink, Connectors } = require("ferra-link");

const client = new Client({....});

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
> create a player to join voice channel.
```js
const player = await client.FerraLink.createPlayer({
    guildId: interaction.guild.id,
    voiceId: interaction.member.voice.channel.id,
    textId: interaction.channel.id,
    shardId: interaction.guild.shardId,
    volume: 100,
    deaf: true,
});
```
> To search tracks and define LoadType (LoadType will be import from Shoukaku).
```js
const { LoadType } = require('shoukaku'); 

//search track from player.
const resolve = await player.search('love nawantiti', { engine: 'spsearch' });

//When tracks will not find it will return LoadType empty.
if (!resolve || [LoadType.ERROR, LoadType.EMPTY].includes(resolve.loadType)) return interaction.followUp({ content: "No match songs result found!" });

//LoadTypes for playlist, search and track.
if (resolve.loadType === LoadType.PLAYLIST) {
  for (const track of resolve.data.tracks) {
        player.queue.add(track, { requester: interaction.user });
    }
} else if (resolve.loadType === LoadType.SEARCH) {
    player.queue.add(resolve.data[0], { requester: interaction.user });
} else {
    player.queue.add(resolve.data, { requester: interaction.user });
}

// To play track after search tracks.
if (!player.playing && !player.paused) await player.play();
```

> some basic methods.
```js
// There are 3 kinds of methods you can set volume.
player.setVolume(100);
await player.shoukaku.setGlobalVolume(100);
await player.shoukaku.setFilterVolume(1.0) // 1.0 = 100;

// To set custom text channel and voice channel.
player.setTextChannel(channelId);
player.setVoiceChannel(channelId);

// There are 2 kind of methods you can set search.
player.search('love nawantiti'); // it will be search from defaultSearchEngine.
player.search('love nawantiti', { engine: 'scsearch' }); // it will search from engine you defined here not from defaultSearchEngine.

// To get node for stats, custom functions etc.
player.shoukaku.getIdealNode();
```

## Getting the Events (shoukaku)

> *You can access event with the help of `client.FerraLink.shoukaku.on(...)`.*

<center>

| **Event Name** 	|   **Elements**  	  |       **Description**         |
|:--------------:	|:------------------: |:----------------------------: |
|   ready 	      | name, resumed       | Event of the node connection. |
|   error         | name, error 	      | Event of the node error.      |
|   close         | name, code, reason  | Event of the node close.	    |
|   disconnect    | name, players, move | Event of the node disconnect.	|
|   debug         | name, reason	      | Event of the node debug.      |
</center>

## Getting the Events (FerraLink)

> *You can access event with the help of `client.FerraLink.on(...)`.*

<center>

| **Event Name** 	  |   **Elements**  |       **Description**         |
|:----------------: |:--------------: |:----------------------------: |
|   trackStart	    | player, track   | Event of the track start.     |
|   trackEnd        | player, track	  | Event of the track end.       |
|   queueEnd        | player          | Event of the queue end.	      |
|   playerClosed    | player, data    | Event of the player close.	  |
|   trackException  | player, data	  | Event of the track exception. |
|   playerUpdate    | player, data	  | Event of the player update.   |
|   trackStuck      | player, data	  | Event of the track stuck.     |
|   trackError      | player, error   | Event of the track error.     |
|   playerResumed   | player          | Event of the player resumed.  |
|   playerDestroy   | player	        | Event of the player destroyed.|
|   playerCreate    | player	        | Event of the player create.   |
</center>

## Contributors
> Deivu as the owner of [Shoukaku](https://github.com/Deivu/Shoukaku).
>
> Vkamsingh, Corgi as the owner of [FerraLink](https://github.com/Cd-corgi/Ferralink).
>
