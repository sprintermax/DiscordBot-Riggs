const DBTools = require(`../scripts/dbtools.js`);
const Leveling = require(`../modules/leveling.js`);

const XPCoolDown = new Set();

module.exports = (client, message) => {
	if (message.author.bot || !message.guild) return;

	DBTools.getguilddb(client, message).then(function(guilddb) {

		if (guilddb.hasOwnProperty('config')) {
			if ((message.content.indexOf(guilddb.prefix) !== 0)) {
				
				if (guilddb.config.hasOwnProperty('leveling') && guilddb.config.leveling == "on") {
					if (XPCoolDown.has(message.author.id)) return;
					XPCoolDown.add(message.author.id);
					setTimeout(() => {
						XPCoolDown.delete(message.author.id);
					}, 30000);
					Leveling.run(client, message, guilddb);
				}
				/*if (guilddb.config.hasOwnProperty('economy') && guilddb.config.economy == "on") {
					Economy.run(client, message, guilddb)
				}*/
			}
		}

		if (message.content == `<@${client.user.id}> help`
		|| message.content == `<@${client.user.id}> ?`
		|| message.content == `<@!${client.user.id}> help`
		|| message.content == `<@!${client.user.id}> ?`) {
			message.channel.send(`${message.author} meu prefixo está configurado para "\`${guilddb.prefix}\`" nesse servidor, caso queira ver uma lista com meus comandos digite "\`${guilddb.prefix}help\`"`);
		}
		if (message.content.indexOf(guilddb.prefix) !== 0) return;
		const args = message.content.toLowerCase().slice(guilddb.prefix.length).trim().split(/ +/g);
		const command = args.shift();
		const cmd = client.commands.get(command);
		if (cmd) cmd.run(client, message, args, guilddb);
	});
}