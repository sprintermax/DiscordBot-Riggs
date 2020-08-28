const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    const db = client.botdb;
    if (guilddb.hasOwnProperty('config')) {
        if (guilddb.config.hasOwnProperty('economy') && guilddb.config.economy == "on") {
            if (guilddb.hasOwnProperty('economy')) {
                if (args[0] == "top") {
                    if (args.length > 1) return cmdresponse.money("MONEY_TOP_MORE_ARGS", "", client, message, args, guilddb);
                    const userwallets = guilddb.economy;
                    userwallets.sort(function(b, a){
                        const useramoney = a.usermoney;
                        const userbmoney = b.usermoney;
                
                        let sortedrank = 0;
                        if (useramoney > userbmoney) {
                            sortedrank = 1;
                        } else if (useramoney < userbmoney) {
                            sortedrank = -1;
                        }
                        return sortedrank;
                    });
                    cmdresponse.money("MONEY_RESPONSE_SORTED", userwallets, client, message, args, guilddb);
                } else if (args[0] == "pay") {
                    if (args.length < 3) return cmdresponse.money("MONEY_PAY_NO_ARGS", "", client, message, args, guilddb);
                    var ruser = client.users.cache.get(args[1].replace(/[<@!>]/g, ''));
                    if (ruser.bot) return cmdresponse.money("MONEY_PAY_BOT_MENTION", ruser, client, message, args, guilddb);
                    if (!ruser) return cmdresponse.money("MONEY_INVALID_USER", args[1], client, message, args, guilddb);
                    if (args[2] == parseInt(args[2], 10) && args[2] >= 0) {


                        

                        var senduser = await db.findOne({
                            "DBGuildID": message.guild.id,
                            "economy.userid": message.author.id
                        });
                        if (senduser) {
                            if (message.author.id == ruser.id) return cmdresponse.money("MONEY_PAY_SELF_MENTION", "", client, message, args, guilddb);
                            if (parseInt(args[2], 10) <= 1) return cmdresponse.money("MONEYCFG_PAY_BELOW_ONE", "", client, message, args, guilddb);
                            const suserindex = senduser.economy.findIndex(index => index.userid == message.author.id);
                            var newsusermoney = parseInt(senduser.economy[suserindex].usermoney, 10) - parseInt(args[2], 10);
                            if (newsusermoney < 0) return cmdresponse.money("MONEYCFG_PAY_NO_MONEY", "", client, message, args, guilddb);
                            db.findOne({
                                "DBGuildID": message.guild.id,
                                "economy.userid": ruser.id
                            }).then(receiveuser => {
                                var newmoneyfee = Math.floor(parseInt(args[2], 10) - (parseInt(args[2], 10) * 0.05));
                                const questionembed = {
                                    "title": "Transferência de Economia",
                                    "description": `-Você está transferindo \`$${args[2]}\` para ${ruser}.\n-Uma taxa de 5% será aplicada e o Usuário receberá \`$${newmoneyfee}\`.\n-Você ficará com \`$${newsusermoney}\`, deseja confirma essa transação?`,
                                    "timestamp": new Date(),
                                    "footer": {
                                        "icon_url": `${message.guild.iconURL() || ""}`,
                                        "text": `${message.guild.name}`
                                    },
                                    "fields": [
                                        {
                                            "name": "Você Envia:",
                                            "value": `$${args[2]}`,
                                            "inline": true
                                        },
                                        {
                                            "name": `Usuário Recebe:`,
                                            "value": `$${newmoneyfee}`,
                                            "inline": true
                                        }
                                    ]
                                };
                                const completedembed = {
                                    "title": "Transferência de Economia",
                                    "description": `-A taxa de 5% foi aplicada e o banco recebeu \`$${parseInt(args[2], 10) - newmoneyfee}\`.\n-Você transferiu \`$${args[2]}\` e ${ruser} recebeu \`$${newmoneyfee}\`.`,
                                    "timestamp": new Date(),
                                    "footer": {
                                        "icon_url": `${message.guild.iconURL() || ""}`,
                                        "text": `${message.guild.name}`
                                    },
                                    "fields": [
                                        {
                                            "name": "Você Enviou:",
                                            "value": `$${args[2]}`,
                                            "inline": true
                                        },
                                        {
                                            "name": `Usuário Recebeu:`,
                                            "value": `$${newmoneyfee}`,
                                            "inline": true
                                        }
                                    ]
                                };
                                message.channel.send(`${message.author} Revise as Informações:`, { embed: questionembed } ).then(msg => {
                                    msg.react("✅").then(() => {
                                        msg.react("❌");
                                    });
                                    const userreaction = (reaction, user) => ( reaction.emoji.name == '✅' || reaction.emoji.name == '❌' ) && user.id == message.author.id;
                                    const msgreact = msg.createReactionCollector(userreaction, { time: 10000 });
                                    var isreacted = 0;
                                    msgreact.on('collect', r => {
                                        isreacted = 1;
                                        if (r.emoji.name == "✅") {
                                            msgreact.stop();
                                            if (receiveuser) {
                                                const ruserindex = receiveuser.economy.findIndex(index => index.userid == ruser.id);
                                                var newrusermoney = Math.floor(parseInt(receiveuser.economy[ruserindex].usermoney, 10) + newmoneyfee);
                                                db.updateOne({
                                                    "DBGuildID": message.guild.id,
                                                    "economy.userid": message.author.id
                                                },
                                                { $set: { "economy.$.usermoney": newsusermoney } } );
                                                db.updateOne({
                                                    "DBGuildID": message.guild.id,
                                                    "economy.userid": ruser.id
                                                },
                                                { $set: { "economy.$.usermoney": newrusermoney } } );
                                            } else {
                                                db.updateOne({
                                                    "DBGuildID": message.guild.id,
                                                    "economy.userid": message.author.id
                                                },
                                                { $set: { "economy.$.usermoney": newsusermoney } } );
                                                db.updateOne({
                                                    "DBGuildID": message.guild.id
                                                },
                                                { $push: { "economy": {
                                                    "userid" : ruser.id,
                                                    "usermoney" : newmoneyfee
                                                } } } );
                                            }
                                            db.findOne({
                                                "DBGuildID": message.guild.id,
                                                "economy.bankuser": "guildbank"
                                            }).then(bankuser => {
                                                var bankfee = parseInt(args[2], 10) - newmoneyfee;
                                                if (bankuser) {
                                                    const bankindex = bankuser.economy.findIndex(index => index.bankuser == "guildbank");
                                                    var bankmoney = bankuser.economy[bankindex].usermoney + bankfee
                                                    db.updateOne({
                                                        "DBGuildID": message.guild.id,
                                                        "economy.bankuser": "guildbank"
                                                    },
                                                    { $set: { "economy.$.usermoney": bankmoney } } );
                                                } else {
                                                    db.updateOne({
                                                        "DBGuildID": message.guild.id
                                                    },
                                                    { $push: { "economy": {
                                                        "bankuser" : "guildbank",
                                                        "usermoney" : bankfee
                                                    } } } );
                                                }
                                            });
                                            msg.reactions.removeAll().then(() => {
                                                msg.edit(`${message.author} Pronto! A transferência foi concluída!`, { embed: completedembed } )
                                            });
                                        } else if (r.emoji.name == "❌") {
                                            msgreact.stop();
                                            msg.reactions.removeAll().then(() => {
                                                msg.edit(`${message.author} Transferência cancelada.`, { embed: null });
                                            });
                                        }
                                    });
                                    msgreact.on('end', () => {
                                        if (isreacted == 0) msg.reactions.removeAll().then(() => {
                                            msg.edit(`${message.author} Tempo limite de resposta atingido, transferência cancelada.`, { embed: null });
                                        });
                                    });
                                });
                            });


                            //////////////////////



                        } else return cmdresponse.money("MONEY_PAY_NO_MONEY", "", client, message, args, guilddb);





                       // message.channel.send(`${message.author} Pronto! Adicionei \`${args[2]}\` pontos de Experiência ao Usuário ${user}.`);
                    } else return cmdresponse.money("MONEY_PAY_INVALID_NUMBER", args[2], client, message, args, guilddb);
                    




                    

                }
                
                
                
                
                
                
                
                



            } else return cmdresponse.money("MONEY_NO_DATA", "", client, message, args, guilddb);
        } else return cmdresponse.money("MONEY_ECONOMY_DISABLED", "", client, message, args, guilddb);
    } else return cmdresponse.money("MONEY_ECONOMY_DISABLED", "", client, message, args, guilddb);
};