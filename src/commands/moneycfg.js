const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    const db = client.botdb;
    var newmoney;
        if (guilddb.config.hasOwnProperty('economy') && guilddb.config.economy == "on") {
            if (!message.member.hasPermission("BAN_MEMBERS")) return cmdresponse.moneycfg("NO_PERM_BAN_MEMBERS", "", client, message, args, guilddb);
            if (args.length < 1) return cmdresponse.moneycfg("MONEYCFG_INVALID_CMD", "", client, message, args, guilddb);
            if (args[0] == "set") {
                if (args.length < 3) return cmdresponse.moneycfg("MONEYCFG_SET_NO_ARGS", "", client, message, args, guilddb);
                var useriddb = await db.findOne({"DBGuildID": message.guild.id, "profiles.userid": args[1]});
                var userid = client.users.cache.get(args[1].replace(/[<@!>]/g, '')) ? client.users.cache.get(args[1].replace(/[<@!>]/g, '')).id : (useriddb ? args[1] : "");
                if (!userid) return cmdresponse.moneycfg("MONEYCFG_INVALID_USER", args[1], client, message, args, guilddb);
                if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {
                    db.findOne({
                        "DBGuildID": message.guild.id,
                        "profiles.userid": userid
                    }).then(data => {
                        if (data) {
                            db.updateOne({
                                "DBGuildID": message.guild.id,
                                "profiles.userid": userid
                            },
                            { $set: { "profiles.$.money": parseInt(args[2], 10) } } );
                        } else {
                            db.updateOne({
                                "DBGuildID": message.guild.id
                            },
                            { $push: { "profiles": {
                                "userid" : userid,
                                "money" : parseInt(args[2], 10)
                            } } } );
                        }
                    });
                    message.channel.send(`${message.author} Pronto! Defini O Dinheiro do Usuário <@${userid}> para \`$${args[2]}\`.`);
                } else return cmdresponse.moneycfg("MONEYCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "add") {
                if (args.length < 3) return cmdresponse.moneycfg("MONEYCFG_ADD_NO_ARGS", "", client, message, args, guilddb);
                var useriddb = await db.findOne({"DBGuildID": message.guild.id, "profiles.userid": args[1]});
                var userid = client.users.cache.get(args[1].replace(/[<@!>]/g, '')) ? client.users.cache.get(args[1].replace(/[<@!>]/g, '')).id : (useriddb ? args[1] : "");
                if (!userid) return cmdresponse.moneycfg("MONEYCFG_INVALID_USER", args[1], client, message, args, guilddb);
                if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {
                    db.findOne({
                        "DBGuildID": message.guild.id,
                        "profiles.userid": userid
                    }).then(data => {
                        if (data) {
                            const userindex = data.profiles.findIndex(index => index.userid == userid)
                            if (!data.profiles[userindex].money) {
                                newmoney = parseInt(args[2], 10);
                            } else {
                                newmoney = data.profiles[userindex].money + parseInt(args[2], 10);
                            }
                            db.updateOne({
                                "DBGuildID": message.guild.id,
                                "profiles.userid": userid
                            },
                            { $set: { "profiles.$.money": newmoney } } );
                        } else {
                            db.updateOne({
                                "DBGuildID": message.guild.id
                            },
                            { $push: { "profiles": {
                                "userid" : userid,
                                "money" : parseInt(args[2], 10)
                            } } } );
                        }
                    });
                    message.channel.send(`${message.author} Pronto! Adicionei \`$${args[2]}\` na carteira do Usuário <@${userid}>.`);
                } else return cmdresponse.moneycfg("MONEYCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "rem") {
                if (args.length < 3) return cmdresponse.moneycfg("MONEYCFG_REM_NO_ARGS", "", client, message, args, guilddb);
                var useriddb = await db.findOne({"DBGuildID": message.guild.id, "profiles.userid": args[1]});
                var userid = client.users.cache.get(args[1].replace(/[<@!>]/g, '')) ? client.users.cache.get(args[1].replace(/[<@!>]/g, '')).id : (useriddb ? args[1] : "");
                if (!userid) return cmdresponse.moneycfg("MONEYCFG_INVALID_USER", args[1], client, message, args, guilddb);
                if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {
                    db.findOne({
                        "DBGuildID": message.guild.id,
                        "profiles.userid": userid
                    }).then(data => {
                        if (data) {
                            const userindex = data.profiles.findIndex(index => index.userid == userid)
                            if (!data.profiles[userindex].money) return cmdresponse.moneycfg("MONEYCFG_REM_BELOW_ZERO", "", client, message, args, guilddb);
                            var newmoney = parseInt(data.profiles[userindex].money, 10) - parseInt(args[2], 10)
                            if (newmoney < 0) return cmdresponse.moneycfg("MONEYCFG_REM_BELOW_ZERO", "", client, message, args, guilddb);
                            db.updateOne({
                                "DBGuildID": message.guild.id,
                                "profiles.userid": userid
                            },
                            { $set: { "profiles.$.money": newmoney } } );
                            message.channel.send(`${message.author} Pronto! Removi \`$${args[2]}\` da carteira do Usuário <@${userid}>.`);
                        } else return cmdresponse.moneycfg("MONEYCFG_REM_BELOW_ZERO", "", client, message, args, guilddb);
                    });
                } else return cmdresponse.moneycfg("LEVELCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "resetbank") {
                message.channel.send(`${message.author} O banco guarda todo o dinheiro adquirido em taxas de transações, você está prestes a redefinir toda a quantia guardada pelo banco e essa ação não poderá ser desfeita, deseja continuar?`).then(msg => {
                    msg.react("❌").then(() => {
                        msg.react("✅");
                    });
                    const userreaction = (reaction, user) => ( reaction.emoji.name == '✅' || reaction.emoji.name == '❌' ) && user.id == message.author.id;
                    const msgreact = msg.createReactionCollector(userreaction, { time: 10000 });
                    var isreacted = 0;
                    msgreact.on('collect', r => {
                        isreacted = 1;
                        if (r.emoji.name == "✅") {
                            msgreact.stop();
                            db.findOne({
                                "DBGuildID": message.guild.id,
                                "profiles.bankuser": "guildbank"
                            }).then(bankuser => {
                                if (bankuser) {
                                    db.updateOne({
                                        "DBGuildID": message.guild.id,
                                        "profiles.bankuser": "guildbank"
                                    },
                                    { $pull: { "profiles": { "bankuser": "guildbank" } } } );
                                    msg.reactions.removeAll().then(() => {
                                        msg.edit(`${message.author} Pronto! Redefini a quantia da taxa de transações guardada pelo banco.`);
                                    });
                                } else return msg.reactions.removeAll().then(() => {
                                    msg.edit(`${message.author} Oops! Parece que o banco já não possui nenhuma quantia guardada.`);
                                });
                            });
                        } else if (r.emoji.name == "❌") {
                            msgreact.stop();
                            msg.reactions.removeAll().then(() => {
                                msg.edit(`${message.author} Redefinição da do valor das taxas guardada pelo banco cancelada.`);
                            });
                        }
                    });
                    msgreact.on('end', () => {
                        if (isreacted == 0) msg.reactions.removeAll().then(() => {
                            msg.edit(`${message.author} Tempo limite de resposta atingido, redefinição da do valor das taxas cancelada.`);
                        });
                    });
                });
            } else if (args[0] == "resetall") {
                message.channel.send(`${message.author} Esta ação irá zerar a carteira de TODOS do servidor e NÃO poderá ser desfeita, tem certeza que quer fazer isso?`).then(msg => {
                    msg.react("❌").then(() => {
                        msg.react("✅");
                    });
                    const userreaction = (reaction, user) => ( reaction.emoji.name == '✅' || reaction.emoji.name == '❌' ) && user.id == message.author.id;
                    const msgreact = msg.createReactionCollector(userreaction, { time: 10000 });
                    var isreacted = 0;
                    msgreact.on('collect', r => {
                        isreacted = 1;
                        if (r.emoji.name == "✅") {
                            msgreact.stop();
                            db.updateOne({ 
                                "DBGuildID": message.guild.id
                            }, { $unset: {"profiles.$[profile].money": { $exists: true }} },
                            { 
                                "arrayFilters": [ { "profile.money": { $exists: true } } ]
                            } );
                            msg.reactions.removeAll().then(() => {
                                msg.edit(`${message.author} Pronto! Redefini a carteira de todos do Servidor.`);
                            });
                        } else if (r.emoji.name == "❌") {
                            msgreact.stop();
                            msg.reactions.removeAll().then(() => {
                                msg.edit(`${message.author} Redefinição da Economia cancelada.`);
                            });
                        }
                    });
                    msgreact.on('end', () => {
                        if (isreacted == 0) msg.reactions.removeAll().then(() => {
                            msg.edit(`${message.author} Tempo limite de resposta atingido, redefinição da Economia cancelada.`);
                        });
                    });
                });
            }
        } else return cmdresponse.moneycfg("MONEYCFG_ECONOMY_DISABLED", "", client, message, args, guilddb);
};