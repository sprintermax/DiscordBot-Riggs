const Discord = require(`discord.js`);

module.exports.config = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "NO_PERM_MANAGE_GUILD") {
        message.channel.send(`${message.author} Erro: Você não tem permissão para executar esse comando.`)
    } else if (ERR_ID == "GERAL_INVALID_CMD") {
        message.channel.send(`${message.author} pagina inicial config`)
    } else if (ERR_ID == "PREFIX_NO_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Nenhum prefixo definido`)
    } else if (ERR_ID == "PREFIX_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    } else if (ERR_ID == "ECONOMY_NO_ARGS") {
        message.channel.send(`${message.author} O estado da economia é "\`${cmddata}\`".`)
    } else if (ERR_ID == "ECONOMY_UNSUPPORTED") {
        message.channel.send(`${message.author} Erro: opções válidas são on ou off`)
    } else if (ERR_ID == "ECONOMY_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    } else if (ERR_ID == "LEVELING_NO_ARGS") {
        message.channel.send(`${message.author} As opções são: on e off`)
    }  else if (ERR_ID == "LEVELING_UNSUPPORTED") {
        message.channel.send(`${message.author} Erro: opções válidas são on ou off`)
    } else if (ERR_ID == "LEVELING_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    }
};

module.exports.rank = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "RANK_LEVELING_DISABLED") {
        message.channel.send(`${message.author} O módulo de leveling esta desativado nesse servidor`)
    } else if (ERR_ID == "RANK_MORE_ARGS") {
        message.channel.send(`${message.author} o rank é global, se você deseja ver as informações de alguém, use "\`${guilddb.prefix}profile @user\`"`)
    } else if (ERR_ID == "RANK_NO_DATA") {
        message.channel.send(`${message.author} não tenho dados os sulficiente para montar uma tabela de liderança`)
    } else if (ERR_ID == "RANK_RESPONSE_SORTED") {
        var ranktext = "";
        var ranksize, rankpos = 0;
        ranksize = Math.min(cmddata.length, 10);
        while (ranksize > 0) {
            rankpos += 1;
            ranktext += `${rankpos}- <@${cmddata[rankpos-1].userid}>: ${cmddata[rankpos-1].userxp} EXP\n`;
            ranksize -= 1;
        }
        embedresponse = {
            "title": "Rank de Experiência do Servidor",
            "description": ranktext,
            "color": 5407405,
            "timestamp": new Date(),
            "footer": {
              "icon_url": `${message.guild.iconURL() || ""}`,
              "text": `${message.guild.name}`
            }
          }
        
          message.channel.send(`${message.author} Aqui está:`, { embed: embedresponse } );
    }
};