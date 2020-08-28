const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    var member;
    var perfil = {
        thumbnail: {},
        fields: []
    };
    if (args.length < 1) member = message.guild.members.cache.get(message.author.id);
    if (args.length == 1) member = message.guild.members.cache.get(args[0].replace(/[<@!>]/g, ''));
    if (!member) return cmdresponse.perfil("PERFIL_INVALID_USER", args[1], client, message, args, guilddb);
    if (member.user.bot) return cmdresponse.perfil("PERFIL_USER_BOT", "", client, message, args, guilddb);
    
    perfil.title = `Perfil de ${member.displayName} | ${"viewssize"} Visualizações`;
    perfil.timestamp = new Date();
    perfil.footer = {
        "icon_url": `${message.guild.iconURL() || ""}`,
        "text": `${message.guild.name}`
    };
    perfil.thumbnail.url = "https://cdn.discordapp.com/avatars/307331927772364801/2374268661032a2cb796d3c8b1b0503c.webp?size=1024";



    if ("description" == 1) perfil.description = "**Nota:** Pode ser bobão mas é muito legal, porém costuma mandar muitas prints nos chats\n- <@217808091343749121>, 26/08/2020 às 10:02";
    
    if ("biografia" == 1) perfil.fields.push({
        "name": "Biografia:",
        "value": "Olá, eu gosto de ursas e adoro conversar, também distribuo agraços gratuitos para quem me pede sempre que eu estiver on-line :3"
    });



    if ("experiencia") expvalue = "432426"; else expvalue = 0;
    perfil.fields.push({
        "name": "Experiência:",
        "value": `${expvalue} EXP`,
        "inline": true
    });
    
    if ("carteira") moneyvalue = "7453271"; else moneyvalue = 0;
    perfil.fields.push({
        "name": "Carteira:",
        "value": `$${moneyvalue}`,
        "inline": true
    });



    if ("emblemas") perfil.fields.push({
        "name": "Emblemas:",
        "value": "`\"Emblema 1\"`, `\"Emblema 2\"`, `\"Emblema 3\"`, `\"Emblema 4\"`"
    });


    message.channel.send(`${message.author} Aqui está:`, {
        embed: perfil
    });
    const emblemafield = perfil.fields.findIndex(index => index.name == "Emblemas:")
    console.log(perfil)
    console.log(emblemafield >= 0 ? "found" : "not found")
    
    
    
    return
    var user = "<@!12345678 teste mensagem tamanho9>" //Just assuming that's their user id.
            var userID = user.replace(/[<@!>]/g, '');
            console.log(userID)
            console.log(userID.length)
    if (guilddb.config.hasOwnProperty('leveling') && guilddb.config.leveling == "on") {
        if (args.length < 1) {
            
            
            var user = "<@!123456789>" //Just assuming that's their user id.
            var userID = user.replace(/[<@!>]/g, '');
            console.log(userID)


        } else if (args.length == 1) {
            //mention
        } //else return cmdresponse.config("RANK_MORE_ARGS", "", client, message, args, guilddb);
    } //else return cmdresponse.config("RANK_LEVELING_DISABLED", "", client, message, args, guilddb);
};