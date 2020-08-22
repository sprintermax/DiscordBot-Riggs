module.exports.run = async (client, message, guilddb) => {
    const db = client.botdb;

    var userlevel = await db.findOne({
        "DBGuildID": message.guild.id,
        "levels.userid": message.author.id
    });

    if (userlevel) {
        const userindex = userlevel.levels.findIndex(index => index.userid == message.author.id)
        var newexp = userlevel.levels[userindex].userxp + 3
        db.updateOne({
            "DBGuildID": message.guild.id,
            "levels.userid": message.author.id
        },
        { $set: { "levels.$.userxp": newexp } } );
    } else {
        db.updateOne({
            "DBGuildID": message.guild.id
        },
        { $push: { "levels": {
            "userid" : message.author.id,
            "userxp" : 3
        } } } );
    }
};