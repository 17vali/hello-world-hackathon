const BaseCommand = require('../../utils/structures/BaseCommand');
const fetch = require('node-fetch');
const base_url = 'http://gateway.marvel.com/v1/public';
const config = require('../../../config.json');
const ts = new Date().getTime();
var CryptoJS = require("crypto-js");
const str = ts + config.marvelPrivateKey + config.marvelApiKey;
const hash = CryptoJS.MD5(str).toString().toLowerCase();
const { EmbedBuilder } = require('discord.js');
const UserConfig = require('../../database/schemas/UserConfig');

module.exports = class FavouriteCommand extends BaseCommand {
  constructor() {
    super('favourite', 'marvel', ['fav']);
  }

  async run(client, message, args) {
    if (args[0] == 'add') {
      try {
        const author = message.author;

        const heroArg = args.slice(1);
        const body = await fetch(`${base_url}/characters?name=${heroArg}&ts=${ts}&apikey=${config.marvelApiKey}&hash=${hash}`);
        const response = await body.json();

        const userConfig = await UserConfig.create({
          userId: author.id,
          userTag: author.tag,
          favHeroes: [response.data.results[0].id]
        });
        console.log('added to database')
      } catch (err) {
        console.log(err);
      }
    } else {

    }
    message.channel.send('favourite command works');
  }
}