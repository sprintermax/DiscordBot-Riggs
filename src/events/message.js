const DBTools = require(`../scripts/dbtools.js`);
/*const Leveling = require(`../modules/leveling.js`);*/

module.exports = (client, message) => {
	if (message.author.bot || !message.guild) return;
	const defaultcfg = client.defaultcfg;
	var prefix;

	DBTools.getguilddb(client, message).then(function(guilddb) {
		console.log("Testmessage: ", guilddb)
		if (!guilddb.prefix) prefix = defaultcfg.prefix; else prefix = guilddb.prefix;
		/*if (guilddb.config.leveling == "on") {
			Leveling.run(client, message, guilddb)
		}*/
		if (message.content == `<@${client.user.id}> help`
		|| message.content == `<@${client.user.id}> ?`
		|| message.content == `<@!${client.user.id}> help`
		|| message.content == `<@!${client.user.id}> ?`) {
			message.channel.send(`${message.author} meu prefixo está configurado para "\`${prefix}\`" nesse servidor, caso queira ver uma lista com meus comandos digite "\`${prefix}help\`"`);
		}
		if (message.content.indexOf(prefix) !== 0) return;
		const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
		const command = args.shift();
		const cmd = client.commands.get(command);
		if (cmd) cmd.run(client, message, args, guilddb);
	});
}