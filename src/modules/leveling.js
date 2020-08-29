module.exports.run = async (client, message, guilddb) => {
    const db = client.botdb;
    var newexp;
    var profiledb = await db.findOne({
        "DBGuildID": message.guild.id,
        "profiles.userid": message.author.id
    });
    if (profiledb) {
        const userindex = profiledb.profiles.findIndex(index => index.userid == message.author.id)
        if (!profiledb.profiles[userindex].experience) {
            newexp = 3;
        } else {
            newexp = profiledb.profiles[userindex].experience + 3;
        }
        db.updateOne({
            "DBGuildID": message.guild.id,
            "profiles.userid": message.author.id
        },
        { $set: { "profiles.$.experience": newexp } } );
    } else {
        db.updateOne({
            "DBGuildID": message.guild.id
        },
        { $push: { "profiles": {
            "userid" : message.author.id,
            "experience" : 3
        } } } );
    }
};