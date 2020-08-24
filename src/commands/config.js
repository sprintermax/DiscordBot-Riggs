const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    const db = client.botdb;
	if (!message.member.hasPermission("MANAGE_GUILD")) return cmdresponse.config("NO_PERM_MANAGE_GUILD", "", client, message, args, guilddb);
    if (args.length < 1) return cmdresponse.config("CONFIG_NO_ARGS", "", client, message, args, guilddb);

    if (args[0] == "prefix") {
        if (args.length < 2) return cmdresponse.config("PREFIX_NO_ARGS", "", client, message, args, guilddb);
        if (args.length > 2) return cmdresponse.config("PREFIX_MORE_ARGS", "", client, message, args, guilddb);
        db.updateOne(
            { "DBGuildID": message.guild.id },
            { $set: { "prefix" : args[1] } }
        );
        message.channel.send(`${message.author} Prefixo do Bot definido para "\`${args[1]}\`".`);
    }

    if (args[0] == "economy") {
        if (args.length > 2) return cmdresponse.config("ECONOMY_MORE_ARGS", "", client, message, args, guilddb);
        if (args[1] && args[1] != "on" && args[1] != "off") return cmdresponse.config("ECONOMY_UNSUPPORTED", "", client, message, args, guilddb);
        var economystate = await db.findOne({"DBGuildID": message.guild.id, $or: [ { "config.economy": "on" }, { "config.economy": "off" } ] } );
        if (args.length == 1 && !economystate) {
            db.updateOne(
                { "DBGuildID": message.guild.id },
                { $set: { "config.economy" : "off" } }
            );
            cmdresponse.config("ECONOMY_NO_ARGS", "off", client, message, args, guilddb);
        } else if (args.length == 1 && economystate) {
            cmdresponse.config("ECONOMY_NO_ARGS", guilddb.config.economy, client, message, args, guilddb);
        } else if (args[1]) {
            db.updateOne(
                { "DBGuildID": message.guild.id },
                { $set: { "config.economy" : args[1] } }
            );
            message.channel.send(`${message.author} Estado da economia alterado para "\`${args[1]}\`".`);
        }
    }

    if (args[0] == "leveling") {
        if (args.length > 2) return cmdresponse.config("LEVELING_MORE_ARGS", "", client, message, args, guilddb);
        if (args[1] && args[1] != "on" && args[1] != "off") return cmdresponse.config("LEVELING_UNSUPPORTED", "", client, message, args, guilddb);
        var levelingstate = await db.findOne({"DBGuildID": message.guild.id, $or: [ { "config.leveling": "on" }, { "config.leveling": "off" } ] } );
        if (args.length == 1 && !levelingstate) {
            db.updateOne(
                { "DBGuildID": message.guild.id },
                { $set: { "config.leveling" : "off" } }
            );
            message.channel.send(`${message.author} O estado do leveling é "\`off\`".`);
        } else if (args.length == 1 && levelingstate) {
            message.channel.send(`${message.author} O estado do leveling é "\`${guilddb.config.leveling}\`".`);
        } else if (args[1]) {
            db.updateOne(
                { "DBGuildID": message.guild.id },
                { $set: { "config.leveling" : args[1] } }
            );
            message.channel.send(`${message.author} Estado do leveling alterado para "\`${args[1]}\`".`);
        }
    }
};