module.exports.checkcfg = async (client, message) => {
    return new Promise(function(resolve) {
        const db = client.botdb;
        db.find({"DBNameID":"RiggsDB"}).toArray((err, items) => {
            const guilds = items[0].guilds;
            const guilddb = guilds.find(r => r.guildid == message.guild.id)
            if (guilddb) {
                resolve(guilddb);
            } else {
                CreateDefaultCfg(client, message);
            }
        });
    });
};

function CreateDefaultCfg(client, message) {
    console.log(`Criando database para o servidor "${message.guild.name}" (${message.guild.id})`);
    const changes = {
        "guildid": message.guild.id,
        "prefix": "",
        "chatids": {
            "actionlog": "",
            "wordslog": ""
        },
        "config": {
            "actionlog": "disabled",
            "words": "disabled",
            "wordfilter": "disabled"
        },
        "badwords": []
    }
    db.updateOne({ "DBNameID":"RiggsDB" }, { $push: { guilds: changes } });
}