module.exports.getguilddb = async (client, message) => {
        return new Promise(async function(resolve) {
        const db = client.botdb;
        var guilddb = await db.findOne({"DBGuildID": message.guild.id});
        if (!guilddb) {
            const newguild = {
                "DBGuildID": message.guild.id,
                "prefix": "r!"
            };
            db.insertOne(newguild)
            resolve(newguild);
        } else {
            resolve(guilddb);
        }
    });
};