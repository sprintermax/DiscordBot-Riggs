const DBTools = require(`../scripts/dbtools.js`);

module.exports = (client, message) => {
	if (message.author.bot || !message.guild) return;
	const defaultcfg = client.defaultcfg;
	var prefix;

	DBTools.checkcfg(client, message).then(function(guilddb) {
		if (!guilddb.prefix) prefix = defaultcfg.prefix; else prefix = guilddb.prefix;
		if (message.content.indexOf(prefix) !== 0) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const cmd = client.commands.get(command);

		if (cmd) {
			cmd.run(client, message, args, guilddb);
		}
	});
}