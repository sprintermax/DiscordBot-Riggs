const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    const db = client.botdb;
        if (guilddb.config.hasOwnProperty('badword') && guilddb.config.badword == "on") {
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return cmdresponse.badword("BADWORD_NO_PERM_MANAGE_MESSAGES", "", client, message, args, guilddb);
            if (args.length < 1) return cmdresponse.badword("BADWORD_NO_ARGS", "", client, message, args, guilddb);

            if (args[0] == "list") {
                if (guilddb.hasOwnProperty('badwords')) {
                    if (guilddb.badwords.length < 1) return cmdresponse.badword("BADWORD_BLANK_LIST", "", client, message, args, guilddb);
                    message.channel.send(`${message.author} Aqui está uma lista com todas as palavras proibidas:\n\`\`\`${guilddb.badwords.join(", ")}\`\`\``);
                } else return cmdresponse.badword("BADWORD_BLANK_LIST", "", client, message, args, guilddb);
            } else if (args[0] == "add") {
                if (args.length < 2) return cmdresponse.badword("BADWORD_ADD_NO_WORD", "", client, message, args, guilddb);
                if (guilddb.hasOwnProperty('badwords')) {
                    if (guilddb.badwords.indexOf(args[1].toLowerCase()) > -1) return cmdresponse.badword("BADWORD_DUPLICATED_WORD", args[1].toLowerCase(), client, message, args, guilddb);
                    db.updateOne({
                        "DBGuildID": message.guild.id
                    },
                    { $push: { "badwords": args[1].toLowerCase() } } );
                    message.channel.send(`${message.author} Pronto! Adicionei "\`${args[1].toLowerCase()}\`" à lista de palavras proibidas!`);
                } else {
                    db.updateOne({
                        "DBGuildID": message.guild.id
                    },
                    { $push: { "badwords": args[1].toLowerCase() } } );
                    message.channel.send(`${message.author} Pronto! Adicionei "\`${args[1].toLowerCase()}\`" à lista de palavras proibidas!`);
                }
            } else if (args[0] == "rem") {
                if (args.length < 2) return cmdresponse.badword("BADWORD_REM_NO_WORD", "", client, message, args, guilddb);
                if (guilddb.hasOwnProperty('badwords')) {
                    if (guilddb.badwords.indexOf(args[1].toLowerCase()) > -1) {
                        db.updateOne({
                            "DBGuildID": message.guild.id
                        },
                        { $pull: { "badwords": args[1].toLowerCase() } } );
                    } else return cmdresponse.badword("BADWORD_REM_NO_WORD_DB", args[1].toLowerCase(), client, message, args, guilddb);
                    message.channel.send(`${message.author} Pronto! Removi "\`${args[1].toLowerCase()}\`" da lista de palavras proibidas!`);
                } else return cmdresponse.badword("BADWORD_REM_BLANK_DB", "", client, message, args, guilddb);
            }
        } else return cmdresponse.badword("BADWORD_BADWORD_DISABLED", "", client, message, args, guilddb);
}