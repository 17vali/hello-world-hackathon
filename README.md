# hello-world-hackathon
A Discord bot coded in Node.js using the Discord.js Library and the Marvel Comics API.

This project is in the early phase and i plan to further add more commands.

Features-

1.!characters <character> <index> - fetching marvel comic characters by name + showing list of characters starting with <character> indexed
    
2.!fav add <character> - using mongodb to store list of favourite characters and comics(still not implemented) of a particular user
    
3.!fav - list of a user's favourite characters fetched from the database

Future plans-

1.full fledged collection database of marvel characters
    
2.a dashboard made with the MERN stack showing your list of favourite characters and comics, most searched characters and comics of a server, comic recommendations based on your list of servers
    
3.a minigame using webhooks, consisting of the marvel characters

How to run local instance-

1.clone the repo and generate a discord bot token in the developer portal(https://discord.com/developers/applications/)
    
2.generate marvel public and private api keys from marvel developer portal(https://developer.marvel.com/)
    
3.add config.json in the hello-world directory of the format
```
{
    "name": "hello-world",
    "language": "javascript",
    "manager": "npm",
    "token": "<discord-token>",
    "prefix": "!",
    "marvelApiKey": "<marvel-public-key>",
    "marvelPrivateKey": "<marvel-private-key>",
    "mongoPassword": "<mongo-password>"
}
```
4.make a mongodb cluster in mongodb atlas and keep the username hello-world-bot and add the password in config.json file
    
5.add the discord bot to a test server and run ```npm run dev``` in terminal(inside the hello-world directory).
