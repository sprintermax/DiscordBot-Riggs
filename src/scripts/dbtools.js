module.exports.checkcfg = async (client, message) => {
    return new Promise(function(resolve) {
        const db = client.botdb;
        db.find({"DBNameID":"RiggsDB"}).toArray((err, items) => {
            const guilds = items[0].guilds;
            const guilddb = guilds.find(r => r.guildid == message.guild.id)
            if (guilddb) {
                resolve(guilddb);
            } else {
                console.log(`[INFO] Criando database para o servidor "${message.guild.name}" (${message.guild.id})`);
                const defaultcfg = {
                    "guildid": message.guild.id,
                    "prefix": "",
                    "chatids": {
                        "actionlog": "",
                        "wordslog": "",
                        "autoshop": ""
                    },
                    "leveling": [
                        {
                            "userid": "",
                            "userxp": ""
                        }
                    ],
                    "economy": [
                        {
                            "userid": "",
                            "balance": ""
                        }
                    ],
                    "config": {
                        "actionlog": "off",
                        "wordslog": "off",
                        "wordfilter": "off",
                        "autoshop": "off",
                        "leveling": "off",
                        "economy": "off"
                    },
                    "badwords": []
                };
                db.updateOne({ "DBNameID":"RiggsDB" }, { $push: { guilds: defaultcfg } });
                resolve(defaultcfg);
            }
        });
    });
};