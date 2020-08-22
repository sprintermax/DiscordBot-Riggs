module.exports.run = async (client, message, guilddb) => {
    const db = client.botdb;

    var userlevel = await db.findOne({
        "DBGuildID": message.guild.id,
        "leveling.userid": message.author.id
    });

    if (userlevel) {
        const userindex = userlevel.leveling.findIndex(index => index.userid == message.author.id)
        var newexp = userlevel.leveling[userindex].userxp + 3
        db.updateOne({
            "DBGuildID": message.guild.id,
            "leveling.userid": message.author.id
        },
        { $set: { "leveling.$.userxp": newexp } } );
    } else {
        db.updateOne({
            "DBGuildID": message.guild.id
        },
        { $push: { "leveling": {
            "userid" : message.author.id,
            "userxp" : 3
        } } } );
    }
};