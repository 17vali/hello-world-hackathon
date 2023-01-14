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
    const author = message.author;
    if (args[0] == 'add') {
      try {
        const heroArg = args.slice(1).join('%20');
        const body = await fetch(`${base_url}/characters?name=${heroArg}&ts=${ts}&apikey=${config.marvelApiKey}&hash=${hash}`);
        const response = await body.json();

        const userConfigCheck = await UserConfig.findOne( { userId: author.id } );

        if (userConfigCheck == null) {
          const userConfig = await UserConfig.create({
            userId: author.id,
            userTag: author.tag,
            favHeroes: [response.data.results[0].id]
          });
        } else {
          const userConfigHeroArr = userConfigCheck.favHeroes;
          await userConfigHeroArr.push(response.data.results[0].id);
          const userConfig = await UserConfig.findOneAndUpdate( { userId: author.id }, {
            userTag: author.tag,
            favHeroes: userConfigHeroArr,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const userConfig = await UserConfig.findOne( { userId: author.id } );
      const userConfigHeroes = userConfig.favHeroes;
      let heroesStr = '';

      message.channel.send('**Your Favourite Heroes**');

      userConfigHeroes.forEach(async heroid => {
        const body = await fetch(`${base_url}/characters/${heroid}?&ts=${ts}&apikey=${config.marvelApiKey}&hash=${hash}`);
        const response = await body.json();
        const heroName = response.data.results[0].name
        //heroesStr = `${heroesStr}\n${heroName}`;
        message.channel.send(heroName);
      });

      /*const heroListEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .addFields(
          { name: 'Your Favourite Heroes', value: heroesStr || '\u200B' },
        );

      message.channel.send({ embeds: [heroListEmbed] });*/
    } catch (err) {
      console.log(err);
    }

    //message.channel.send('favourite command works');
  }
}