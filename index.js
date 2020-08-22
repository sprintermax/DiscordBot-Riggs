require(`dotenv`).config();
const mongo = require('mongodb').MongoClient;
const Discord = require(`discord.js`);
const fs = require(`fs`);


const client = new Discord.Client();
client.commands = new Discord.Collection();

client.defaultcfg = require(`./src/defaultcfg.json`);

fs.readdir("./src/events/", (err, files) => {
    console.log('[INFO] Importação dos eventos iniciada.');
    if (err) return console.error(err);
    if (files.length >= 1) {
        files.forEach(file => {
            const event = require(`./src/events/${file}`);
            let eventName = file.split(".js")[0];
            client.on(eventName, event.bind(null, client));
            console.log(`-----> Evento "${eventName}" carregado com sucesso.`);
        });
        console.log('[INFO] Importação dos eventos finalizada.');
    } else {
        console.log('[INFO] Nenhum evento encontrado.');
    }
});

fs.readdir("./src/commands/", (err, files) => {
	console.log('[INFO] Importação dos comandos iniciada.');
    if (err) return console.error(err);
    if (files.length >= 1) {
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            let props = require(`./src/commands/${file}`);
            let commandName = file.split(".js")[0];
            client.commands.set(commandName, props);
            console.log(`-----> Comando "${commandName}" carregado com sucesso.`);
        });
    } else {
        console.log('[INFO] Nenhum comando encontrado.');
    }
	console.log('[INFO] Importação dos comandos finalizada.');
});

mongo.connect(process.env.MONGO_DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, (err, mongodb) => {
    if (err) return console.error(err);
    db = mongodb.db("RiggsDatabase").collection("StoredData");
	client.botdb = db;
	db.find({"DBNameID":"GeneralData"}).toArray((err, items) => {
        client.botdata = items[0];
		client.login(process.env.DISCORD_TOKEN);
	});
});