const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    const db = client.botdb;
    if (!message.member.hasPermission("BAN_MEMBERS")) return cmdresponse.levelcfg("NO_PERM_BAN_MEMBERS", "", client, message, args, guilddb);
    if (guilddb.hasOwnProperty('config')) {
        if (guilddb.config.hasOwnProperty('leveling') && guilddb.config.leveling == "on") {
                
            if (args.length < 1) return cmdresponse.levelcfg("LEVELCFG_INVALID_CMD", "", client, message, args, guilddb);
            if (args[0] == "set") {
                if (args.length < 3) return cmdresponse.levelcfg("LEVELCFG_SET_NO_ARGS", "", client, message, args, guilddb);
                var user = GetUser(client, args[1]);
                if (!user) return cmdresponse.levelcfg("LEVELCFG_INVALID_USER", args[1], client, message, args, guilddb);
                if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {
                    db.findOne({
                        "DBGuildID": message.guild.id,
                        "levels.userid": user.id
                    }).then(data => {
                        if (data) {
                            db.updateOne({
                                "DBGuildID": message.guild.id,
                                "levels.userid": user.id
                            },
                            { $set: { "levels.$.userxp": parseInt(args[2], 10) } } );
                        } else {
                            db.updateOne({
                                "DBGuildID": message.guild.id
                            },
                            { $push: { "levels": {
                                "userid" : user.id,
                                "userxp" : parseInt(args[2], 10)
                            } } } );
                        }
                    });
                    message.channel.send(`${message.author} Pronto! Defini a Experiência do Usuário ${user} para \`${args[2]}\`.`);
                } else return cmdresponse.levelcfg("LEVELCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "add") {
                if (args.length < 3) return cmdresponse.levelcfg("LEVELCFG_ADD_NO_ARGS", "", client, message, args, guilddb);
                var user = GetUser(client, args[1]);
                if (!user) return cmdresponse.levelcfg("LEVELCFG_INVALID_USER", args[1], client, message, args, guilddb);
                if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {
                    db.findOne({
                        "DBGuildID": message.guild.id,
                        "levels.userid": user.id
                    }).then(data => {
                        if (data) {
                            const userindex = data.levels.findIndex(index => index.userid == user.id)
                            var newexp = parseInt(data.levels[userindex].userxp, 10) + parseInt(args[2], 10)
                            db.updateOne({
                                "DBGuildID": message.guild.id,
                                "levels.userid": user.id
                            },
                            { $set: { "levels.$.userxp": newexp } } );
                        } else {
                            db.updateOne({
                                "DBGuildID": message.guild.id
                            },
                            { $push: { "levels": {
                                "userid" : user.id,
                                "userxp" : parseInt(args[2], 10)
                            } } } );
                        }
                    });
                    message.channel.send(`${message.author} Pronto! Adicionei \`${args[2]}\` pontos de Experiência ao Usuário ${user}.`);
                } else return cmdresponse.levelcfg("LEVELCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "rem") {
                if (args.length < 3) return cmdresponse.levelcfg("LEVELCFG_REM_NO_ARGS", "", client, message, args, guilddb);
                var user = GetUser(client, args[1]);
                if (!user) return cmdresponse.levelcfg("LEVELCFG_INVALID_USER", args[1], client, message, args, guilddb);
                if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {
                    db.findOne({
                        "DBGuildID": message.guild.id,
                        "levels.userid": user.id
                    }).then(data => {
                        if (data) {
                            const userindex = data.levels.findIndex(index => index.userid == user.id)
                            var newexp = parseInt(data.levels[userindex].userxp, 10) - parseInt(args[2], 10)
                            if (newexp < 0) return cmdresponse.levelcfg("LEVELCFG_REM_BELOW_ZERO", "", client, message, args, guilddb);
                            db.updateOne({
                                "DBGuildID": message.guild.id,
                                "levels.userid": user.id
                            },
                            { $set: { "levels.$.userxp": newexp } } );
                            message.channel.send(`${message.author} Pronto! Removi \`${args[2]}\` pontos de Experiência do Usuário ${user}.`);
                        } else return cmdresponse.levelcfg("LEVELCFG_REM_BELOW_ZERO", "", client, message, args, guilddb);
                    });
                } else return cmdresponse.levelcfg("LEVELCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "resetall") {
                message.channel.send(`${message.author} Esta ação irá redefinir a Experiência de TODOS do servidor, tem certeza que quer fazer isso?`).then(msg => {
                    msg.react("❌").then(() => {
                        msg.react("✅");
                    });
                    const userreaction = (reaction, user) => ( reaction.emoji.name == '✅' || reaction.emoji.name == '❌' ) && user.id == message.author.id;
                    const msgreact = msg.createReactionCollector(userreaction, { time: 10000 });
                    var isreacted = 0;
                    msgreact.on('collect', r => {
                        isreacted = 1;
                        if (r.emoji.name == "✅") {
                            db.updateOne({ "DBGuildID": message.guild.id }, { $unset: { "levels": [] } } );
                            msg.delete().then(() => {
                                message.channel.send(`${message.author} Pronto! Redefini a Experiência de Todos do servidor.`)
                            });
                        } else if (r.emoji.name = "❌") {
                            msg.delete().then(() => {
                                message.channel.send(`${message.author} Redefinição de Experiência cancelada.`)
                            });
                        }
                    });
                    msgreact.on('end', () => {
                        if (isreacted = 0) msg.delete().then(() => {
                            message.channel.send(`${message.author} Tempo limite de resposta atingido, redefinição de Experiência cancelada.`)
                        });
                    });
                });
            }
        } else return cmdresponse.levelcfg("LEVELCFG_LEVELING_DISABLED", "", client, message, args, guilddb);
    } else return cmdresponse.levelcfg("LEVELCFG_LEVELING_DISABLED", "", client, message, args, guilddb);
};

function GetUser(client, mention) {
    if (!mention) return;
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) mention = mention.slice(1);
    }
    return client.users.cache.get(mention);
}