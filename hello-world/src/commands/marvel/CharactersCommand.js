const BaseCommand = require('../../utils/structures/BaseCommand');
const fetch = require('node-fetch');
const base_url = 'http://gateway.marvel.com/v1/public';
const config = require('../../../slappey.json');
const ts = new Date().getTime();
var CryptoJS = require("crypto-js");
const str = ts + config.marvelPrivateKey + config.marvelApiKey;
const hash = CryptoJS.MD5(str).toString().toLowerCase();
const { EmbedBuilder } = require('discord.js');

module.exports = class CharactersCommand extends BaseCommand {
  constructor() {
    super('characters', 'marvel', []);
  }

  async run(client, message, args) {
    if (args.length < 1 || !isNaN(Number(args[0]))) {
      const index = await Number(args[0]) || 1;
      const body = await fetch(`${base_url}/characters?offset=${20*(index-1)}&ts=${ts}&apikey=${config.marvelApiKey}&hash=${hash}`);
      const response = await body.json();

      const heroesList = response.data.results;
      const heroesTotal = response.data.total;
      let heroesStr = '';

      heroesList.forEach(hero =>{
        heroesStr = `${heroesStr}\n${hero.name}`
      })

      const heroListEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .addFields(
          { name: 'Heroes', value: heroesStr || '\u200B' },
        )
        .setFooter({ text: `displaying ${20*(index-1)+1}-${20*(index-1)+(response.data.count || 1)} results out of ${heroesTotal}` });

      message.channel.send({ embeds: [heroListEmbed] });
    } else{
      const heroArg = isNaN(Number(args.slice(-1))) ? await args.join('%20') : args.slice(0,-1).join('%20');
      const hero = await getHero(heroArg);

      if (hero.data.count < 1) {
        const index = await Number(args[args.length-1]) || 1;
        const body = await fetch(`${base_url}/characters?nameStartsWith=${heroArg}&offset=${20*(index-1)}&ts=${ts}&apikey=${config.marvelApiKey}&hash=${hash}`);
        const response = await body.json();

        const heroesList = response.data.results;
        const heroesTotal = response.data.total;
        let heroesStr = '';

        heroesList.forEach(hero =>{
          heroesStr = `${heroesStr}\n${hero.name}`
        })

        const heroListEmbed = new EmbedBuilder()
          .setColor(0x0099FF)
          .addFields(
            { name: `Heroes starting with ${await heroArg.replaceAll('%20', ' ')}`, value: heroesStr || '\u200B' },
          )
          .setFooter({ text: `displaying ${20*(index-1)+1}-${20*(index-1)+(response.data.count || 1)} results out of ${heroesTotal}` });

        message.channel.send({ embeds: [heroListEmbed] });
      } else {
        const heroID = hero.data.results[0].id;
        const heroName = hero.data.results[0].name;
        const heroDescription = hero.data.results[0].description;
        const heroThumbnail = `${hero.data.results[0].thumbnail.path}.${hero.data.results[0].thumbnail.extension}`;

        const comics = await getComics(heroID, 10);
        const comicsList = await comics.data.results;
        let comicsStr = '';

        comicsList.forEach(comic =>{
          comicsStr = `${comicsStr}\n${comic.title}`
        })
        console.log(heroName);
        console.log(heroDescription);
        console.log(heroThumbnail);
        console.log(comicsStr.length);

        const heroEmbed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(heroName || '\u200B' )
          .setDescription(heroDescription || '\u200B' )
          .setThumbnail(heroThumbnail || '\u200B' )
          .addFields(
            { name: 'Comics', value: comicsStr || '\u200B' },
          )
          .setImage(heroThumbnail || '\u200B' )

        message.channel.send({ embeds: [heroEmbed] });
      }
    }
  }
}


async function getHero(heroName) {
  const body = await fetch(`${base_url}/characters?name=${heroName}&ts=${ts}&apikey=${config.marvelApiKey}&hash=${hash}`);
  const response = await body.json();
  return response;
}

async function getHeroNameStartsWith(heroNameStartsWith) {
  const body = await fetch(`${base_url}/characters?nameStartsWith=${heroNameStartsWith}&ts=${ts}&apikey=${config.marvelApiKey}&hash=${hash}`);
  const response = await body.json();
  return response;
}

async function getComics(heroID, limit) {
  const body = await fetch(`${base_url}/characters/${heroID}/comics?limit=${limit}&ts=${ts}&apikey=${config.marvelApiKey}&hash=${hash}`);
  const response = await body.json();
  return response;
}