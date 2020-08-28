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
    } else if (args[0] == "economy") {
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
    } else if (args[0] == "leveling") {
        if (args.length > 2) return cmdresponse.config("LEVELING_MORE_ARGS", "", client, message, args, guilddb);
        if (args[1] && args[1] != "on" && args[1] != "off") return cmdresponse.config("LEVELING_UNSUPPORTED", "", client, message, args, guilddb);
        var levelingstate = await db.findOne({"DBGuildID": message.guild.id, $or: [ { "config.leveling": "on" }, { "config.leveling": "off" } ] } );
        if (args.length == 1 && !levelingstate) {
            db.updateOne(
                { "DBGuildID": message.guild.id },
                { $set: { "config.leveling" : "off" } }
            );
            cmdresponse.config("LEVELING_NO_ARGS", "off", client, message, args, guilddb);
        } else if (args.length == 1 && levelingstate) {
            cmdresponse.config("LEVELING_NO_ARGS", guilddb.config.leveling, client, message, args, guilddb);
        } else if (args[1]) {
            db.updateOne(
                { "DBGuildID": message.guild.id },
                { $set: { "config.leveling" : args[1] } }
            );
            message.channel.send(`${message.author} Estado do leveling alterado para "\`${args[1]}\`".`);
        }
    } else if (args[0] == "badword") {
        if (args[1] && args[1] == "log") {
            if (args.length > 3) return cmdresponse.config("BADWORD_LOG_MORE_ARGS", "", client, message, args, guilddb);
            if (guilddb.hasOwnProperty('config')) {
                if (guilddb.config.hasOwnProperty('badwordlog')) {
                    if (args.length == 2) {
                        if (guilddb.config.badwordlog == "off") return cmdresponse.config("BADWORD_LOG_NO_ARG", "off", client, message, args, guilddb);
                        cmdresponse.config("BADWORD_LOG_CHANNEL_INFO", guilddb.config.badwordlog, client, message, args, guilddb);
                        
                    } else if (args[2] == "off") {
                        db.updateOne(
                            { "DBGuildID": message.guild.id },
                            { $set: { "config.badwordlog" : "off" } }
                        );
                        message.channel.send(`${message.author} Pronto! Desativei o log do módulo badword.`);
                    } else {
                        var logchannel = message.guild.channels.cache.get(args[2].replace(/[<#>]/g, ''));
                        if (!logchannel) return cmdresponse.config("BADWORD_LOG_INVALID_CHANNEL", args[2], client, message, args, guilddb);
                        if (!logchannel.permissionsFor(message.guild.me).has('VIEW_CHANNEL') || !logchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
                            cmdresponse.config("BADWORD_LOG_NO_PERM_CHANNEL", args[2], client, message, args, guilddb);
                        } else {
                            db.updateOne(
                                { "DBGuildID": message.guild.id },
                                { $set: { "config.badwordlog" : args[2].replace(/[<#>]/g, '') } }
                            );
                            message.channel.send(`${message.author} Pronto! Usarei o chat <#${args[2].replace(/[<#>]/g, '')}> como log do múdulo badword.`);
                        }
                    }
                } else {
                    if (args.length == 2 || args[2] == "off") {
                        db.updateOne(
                            { "DBGuildID": message.guild.id },
                            { $set: { "config.badwordlog" : "off" } }
                        );
                        cmdresponse.config("BADWORD_LOG_NO_ARG", "off", client, message, args, guilddb);
                    } else {
                        var logchannel = message.guild.channels.cache.get(args[2].replace(/[<#>]/g, ''));
                        if (!logchannel) return cmdresponse.config("BADWORD_LOG_INVALID_CHANNEL", args[2], client, message, args, guilddb);
                        if (!logchannel.permissionsFor(message.guild.me).has('VIEW_CHANNEL') || !logchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
                            cmdresponse.config("BADWORD_LOG_NO_PERM_CHANNEL", args[2], client, message, args, guilddb);
                        } else {
                            db.updateOne(
                                { "DBGuildID": message.guild.id },
                                { $set: { "config.badwordlog" : args[2].replace(/[<#>]/g, '') } }
                            );
                            message.channel.send(`${message.author} Pronto! Usarei o chat <#${args[2].replace(/[<#>]/g, '')}> como log do múdulo badword.`);
                        }
                    }
                }
            } else {
                if (args.length == 2 || args[2] == "off") {
                    db.updateOne(
                        { "DBGuildID": message.guild.id },
                        { $set: { "config.badwordlog" : "off" } }
                    );
                    cmdresponse.config("BADWORD_LOG_NO_ARG", "off", client, message, args, guilddb);
                } else {
                    var logchannel = message.guild.channels.cache.get(args[2].replace(/[<#>]/g, ''));
                    if (!logchannel) return cmdresponse.config("BADWORD_LOG_INVALID_CHANNEL", args[2], client, message, args, guilddb);
                    if (!logchannel.permissionsFor(message.guild.me).has('VIEW_CHANNEL') || !logchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
                        cmdresponse.config("BADWORD_LOG_NO_PERM_CHANNEL", args[2], client, message, args, guilddb);
                    } else {
                        db.updateOne(
                            { "DBGuildID": message.guild.id },
                            { $set: { "config.badwordlog" : args[2].replace(/[<#>]/g, '') } }
                        );
                        message.channel.send(`${message.author} Pronto! Usarei o chat <#${args[2].replace(/[<#>]/g, '')}> como log do múdulo badword.`);
                    }
                }
            }
        } else {
            if (args.length > 2) return cmdresponse.config("BADWORD_MORE_ARGS", "", client, message, args, guilddb);
            if (args[1] && args[1] != "on" && args[1] != "off") return cmdresponse.config("BADWORD_UNSUPPORTED", "", client, message, args, guilddb);
            var badwordstate = await db.findOne({"DBGuildID": message.guild.id, $or: [ { "config.badword": "on" }, { "config.badword": "off" } ] } );
            if (args.length == 1 && !badwordstate) {
                db.updateOne(
                    { "DBGuildID": message.guild.id },
                    { $set: { "config.badword" : "off" } }
                );
                cmdresponse.config("BADWORD_NO_ARGS", "off", client, message, args, guilddb);
            } else if (args.length == 1 && badwordstate) {
                cmdresponse.config("BADWORD_NO_ARGS", guilddb.config.badword, client, message, args, guilddb);
            } else if (args[1]) {
                db.updateOne(
                    { "DBGuildID": message.guild.id },
                    { $set: { "config.badword" : args[1], badwords: [] } }
                );
                message.channel.send(`${message.author} Estado do bloqueio de palavras alterado para "\`${args[1]}\`".`);
            }
        }
    }
};