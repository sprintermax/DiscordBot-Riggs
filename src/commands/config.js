const wrongcmd = require(`../scripts/wrongcmd.js`);

module.exports.run = async (client, message, args, guilddb) => {
    const db = client.botdb;
    message.channel.send(`${message.author} Você subiu para o nível 2!`);
	if (!message.member.hasPermission("MANAGE_GUILD")) return wrongcmd.config("NO_PERM_MANAGE_GUILD", client, message, args, guilddb);
    if (args.length < 1) return wrongcmd.config("GERAL_INVALID_CMD", client, message, args, guilddb);

    if (args[0] == "prefix") {
        if (args.length < 2) return wrongcmd.config("PREFIX_NO_ARGS", client, message, args, guilddb);
        if (args.length > 2) return wrongcmd.config("PREFIX_MORE_ARGS", client, message, args, guilddb);
        db.updateOne(
            { "guilds.guildid": message.guild.id },
            { $set: { "guilds.$.prefix" : args[1] } }
        );
        message.channel.send(`${message.author} Prefixo do Bot definido para "\`${args[1]}\`".`);
    }

    if (args[0] == "economy") {
        if (args.length == 1) return message.channel.send(`${message.author} O estado da economia é "\`${guilddb.config.economy}\`".`);
        if (args.length > 2) return wrongcmd.config("ECONOMY_INVALID_ARGS", client, message, args, guilddb);
        if (args[1] != "on" && args[1] != "off") return wrongcmd.config("ECONOMY_UNSUPPORTED", client, message, args, guilddb);
        db.updateOne(
            { "guilds.guildid": message.guild.id },
            { $set: { "guilds.$.config.economy" : args[1] } }
        );
        message.channel.send(`${message.author} Estado da economia alterado para "\`${args[1]}\`".`);
    }

    if (args[0] == "leveling") {
        if (args.length == 1) return message.channel.send(`${message.author} O estado do leveling é "\`${guilddb.config.leveling}\`".`);
        if (args.length > 2) return wrongcmd.config("LEVELING_MORE_ARGS", client, message, args, guilddb);
        if (args[1] != "on" && args[1] != "off") return wrongcmd.config("LEVELING_UNSUPPORTED", client, message, args, guilddb);
        db.updateOne(
            { "guilds.guildid": message.guild.id },
            { $set: { "guilds.$.config.leveling" : args[1] } }
        );
        message.channel.send(`${message.author} Estado do leveling alterado para "\`${args[1]}\`".`);
    }
};