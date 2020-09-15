const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    var member, money, experience, profileviewcount;
    var perfil = {
        thumbnail: {},
        fields: []
    };
    if (args.length < 1) member = message.guild.members.cache.get(message.author.id);
    if (args.length >= 1) member = message.guild.members.cache.get(args[0].replace(/[<@!>]/g, ''));
    if (!member) return cmdresponse.perfil("PERFIL_INVALID_USER", args[0], client, message, args, guilddb);
    if (member.user.bot) return cmdresponse.perfil("PERFIL_USER_BOT", "", client, message, args, guilddb);

    if (args[0] && member.user.id != message.author.id) {
        db.findOne({
            "DBGuildID": message.guild.id,
            "profiles.userid": member.user.id
        }).then(data => {
            if (data) {
                const userindex = data.profiles.findIndex(index => index.userid == member.user.id);
                if (data.profiles[userindex].profileviewcount) {
                    db.updateOne({
                        "DBGuildID": message.guild.id,
                        "profiles.userid": member.user.id
                    },
                    { $set: { "profiles.$.profileviewcount": parseInt(data.profiles[userindex].profileviewcount, 10) + 1 } } );
                } else {
                    db.updateOne({
                        "DBGuildID": message.guild.id,
                        "profiles.userid": member.user.id
                    },
                    { $set: { "profiles.$.profileviewcount": 1 } } );
                }
            } else {
                db.updateOne({
                    "DBGuildID": message.guild.id
                },
                { $push: { "profiles": {
                    "userid" : member.user.id,
                    "profileviewcount" : 1
                } } } );
            }
        });
    }

    perfil.timestamp = new Date();
    perfil.footer = {
        "icon_url": `${message.guild.iconURL() || ""}`,
        "text": `${message.guild.name}`
    };
    perfil.thumbnail.url = member.user.avatarURL();

    db.findOne({
        "DBGuildID": message.guild.id,
        "profiles.userid": member.user.id
    }).then(data => {
        if (!data) return cmdresponse.perfil("PERFIL_USER_NO_DATA", "", client, message, args, guilddb);
        const userindex = data.profiles.findIndex(index => index.userid == member.user.id)

        if (data.profiles[userindex].profileviewcount) {
            profileviewcount = `${data.profiles[userindex].profileviewcount}`;
        } else profileviewcount = 0;

        perfil.title = `Perfil de ${member.displayName} | ${profileviewcount} Visualizações`;
    
        
        if (data.profiles[userindex].description) {
            perfil.description = data.profiles[userindex].description
        }

        if (data.profiles[userindex].biografia) {
            perfil.fields.push({
                "name": "Biografia:",
                "value": data.profiles[userindex].biografia
            });
        }
        
        if ( guilddb.config.hasOwnProperty('leveling') 
        && guilddb.config.leveling == "on" 
        && data.profiles[userindex].experience) {
            experience = data.profiles[userindex].experience;
        } else experience = 0;
        perfil.fields.push({
            "name": "Experiência:",
            "value": `${experience} EXP`,
            "inline": true
        });

        if (guilddb.config.hasOwnProperty('economy') 
        && guilddb.config.economy == "on" 
        && data.profiles[userindex].money) {
            money = data.profiles[userindex].money;
        } else money = 0;
        perfil.fields.push({
            "name": "Carteira:",
            "value": `$${money}`,
            "inline": true
        });

        if (data.profiles[userindex].emblemas && data.profiles[userindex].emblemas.length > 0) {
            perfil.fields.push({
                "name": "Emblemas:",
                "value": `\`\"${data.profiles[userindex].emblemas.join("`, `")}\"\``
            });
        }

        message.channel.send(`${message.author} Aqui está:`, {
            embed: perfil
        });
    })
    //const emblemafield = perfil.fields.findIndex(index => index.name == "Emblemas:")
    //console.log(emblemafield >= 0 ? "found" : "not found")
};