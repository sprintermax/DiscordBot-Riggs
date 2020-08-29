const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    const db = client.botdb;
    var newexp;
    if (!message.member.hasPermission("BAN_MEMBERS")) return cmdresponse.levelcfg("NO_PERM_BAN_MEMBERS", "", client, message, args, guilddb);
        if (guilddb.config.hasOwnProperty('leveling') && guilddb.config.leveling == "on") {
                
            if (args.length < 1) return cmdresponse.levelcfg("LEVELCFG_INVALID_CMD", "", client, message, args, guilddb);
            if (args[0] == "set") {
                if (args.length < 3) return cmdresponse.levelcfg("LEVELCFG_SET_NO_ARGS", "", client, message, args, guilddb);
                var userid = client.users.cache.get(args[1].replace(/[<@!>]/g, '')).id;
                if (!userid) return cmdresponse.levelcfg("LEVELCFG_INVALID_USER", args[1], client, message, args, guilddb);
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
                            { $set: { "profiles.$.experience": parseInt(args[2], 10) } } );
                        } else {
                            db.updateOne({
                                "DBGuildID": message.guild.id
                            },
                            { $push: { "profiles": {
                                "userid" : userid,
                                "experience" : parseInt(args[2], 10)
                            } } } );
                        }
                    });
                    message.channel.send(`${message.author} Pronto! Defini a Experiência do Usuário <@${userid}> para \`${args[2]}\`.`);
                } else return cmdresponse.levelcfg("LEVELCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "add") {
                if (args.length < 3) return cmdresponse.levelcfg("LEVELCFG_ADD_NO_ARGS", "", client, message, args, guilddb);
                var userid = client.users.cache.get(args[1].replace(/[<@!>]/g, '')).id;
                if (!userid) return cmdresponse.levelcfg("LEVELCFG_INVALID_USER", args[1], client, message, args, guilddb);
                if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {
                    db.findOne({
                        "DBGuildID": message.guild.id,
                        "profiles.userid": userid
                    }).then(data => {
                        if (data) {
                            const userindex = data.profiles.findIndex(index => index.userid == userid)
                            if (!data.profiles[userindex].experience) {
                                newexp = parseInt(args[2], 10);
                            } else {
                                newexp = data.profiles[userindex].experience + parseInt(args[2], 10);
                            }
                            db.updateOne({
                                "DBGuildID": message.guild.id,
                                "profiles.userid": userid
                            },
                            { $set: { "profiles.$.experience": newexp } } );
                        } else {
                            db.updateOne({
                                "DBGuildID": message.guild.id
                            },
                            { $push: { "profiles": {
                                "userid" : userid,
                                "experience" : parseInt(args[2], 10)
                            } } } );
                        }
                    });
                    message.channel.send(`${message.author} Pronto! Adicionei \`${args[2]}\` pontos de Experiência ao Usuário <@${userid}>.`);
                } else return cmdresponse.levelcfg("LEVELCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "rem") {
                if (args.length < 3) return cmdresponse.levelcfg("LEVELCFG_REM_NO_ARGS", "", client, message, args, guilddb);
                var userid = client.users.cache.get(args[1].replace(/[<@!>]/g, '')).id;
                if (!userid) return cmdresponse.levelcfg("LEVELCFG_INVALID_USER", args[1], client, message, args, guilddb);
                if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {
                    db.findOne({
                        "DBGuildID": message.guild.id,
                        "profiles.userid": userid
                    }).then(data => {
                        if (data) {
                            const userindex = data.profiles.findIndex(index => index.userid == userid)
                            if (!data.profiles[userindex].experience) return cmdresponse.levelcfg("LEVELCFG_REM_BELOW_ZERO", "", client, message, args, guilddb);
                            newexp = data.profiles[userindex].experience - parseInt(args[2], 10);
                            if (newexp < 0) return cmdresponse.levelcfg("LEVELCFG_REM_BELOW_ZERO", "", client, message, args, guilddb);
                            db.updateOne({
                                "DBGuildID": message.guild.id,
                                "profiles.userid": userid
                            },
                            { $set: { "profiles.$.experience": newexp } } );
                            message.channel.send(`${message.author} Pronto! Removi \`${args[2]}\` pontos de Experiência do Usuário <@${userid}>.`);
                        } else return cmdresponse.levelcfg("LEVELCFG_REM_BELOW_ZERO", "", client, message, args, guilddb);
                    });
                } else return cmdresponse.levelcfg("LEVELCFG_INVALID_NUMBER", args[2], client, message, args, guilddb);
            } else if (args[0] == "resetall") {
                message.channel.send(`${message.author} Esta ação irá redefinir a Experiência de TODOS do servidor e NÃO poderá ser desfeita, tem certeza que quer fazer isso?`).then(msg => {
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
                            /*db.findOne({
                                "DBGuildID": message.guild.id,
                                "profiles.experience": { $ne: false }
                            }).then(data => {
                                console.log(data)
                            })*/
                            db.updateOne({ 
                                "DBGuildID": message.guild.id
                            }, { $unset: {"profiles.$[profile].experience": { $exists: true }} },
                            { 
                                "arrayFilters": [ { "profile.experience": { $exists: true } } ]
                            } );
                            
                            msg.reactions.removeAll().then(() => {
                                msg.edit(`${message.author} Pronto! Redefini a Experiência de Todos do servidor.`);
                            });
                        } else if (r.emoji.name == "❌") {
                            msgreact.stop();
                            msg.reactions.removeAll().then(() => {
                                msg.edit(`${message.author} Redefinição de Experiência cancelada.`);
                            });
                        }
                    });
                    msgreact.on('end', () => {
                        if (isreacted == 0) msg.reactions.removeAll().then(() => {
                            msg.edit(`${message.author} Tempo limite de resposta atingido, redefinição de Experiência cancelada.`);
                        });
                    });
                });
            }
        } else return cmdresponse.levelcfg("LEVELCFG_LEVELING_DISABLED", "", client, message, args, guilddb);
};