module.exports.getguilddb = async (client, message) => {
        return new Promise(async function(resolve) {
        const db = client.botdb;
        var guilddb = await db.findOne({"DBGuildID": message.guild.id});
        if (!guilddb) {
            db.insertOne({"DBGuildID": message.guild.id})
            resolve({"DBGuildID": message.guild.id});
        } else {
            resolve(guilddb);
        }
    });
};