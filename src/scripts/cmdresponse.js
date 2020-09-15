const Discord = require(`discord.js`);

module.exports.config = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "NO_PERM_MANAGE_GUILD") {
        message.channel.send(`${message.author} Erro: Você não tem permissão para executar esse comando.`)
    } else if (ERR_ID == "CONFIG_NO_ARGS") {
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
        message.channel.send(`${message.author} O estado do levelng é "\`${cmddata}\`".`)
    }  else if (ERR_ID == "LEVELING_UNSUPPORTED") {
        message.channel.send(`${message.author} Erro: opções válidas são on ou off`)
    } else if (ERR_ID == "LEVELING_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    } else if (ERR_ID == "BADWORD_NO_ARGS") {
        message.channel.send(`${message.author} O estado do bloqueio de palavras é "\`${cmddata}\`".`)
    }  else if (ERR_ID == "BADWORD_UNSUPPORTED") {
        message.channel.send(`${message.author} Erro: opções válidas são on ou off`)
    } else if (ERR_ID == "BADWORD_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    } else if (ERR_ID == "BADWORD_LOG_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    } else if (ERR_ID == "BADWORD_LOG_NO_ARG") {
        message.channel.send(`${message.author} O estado do log do módulo badword é "\`${cmddata}\`".`)
    } else if (ERR_ID == "BADWORD_LOG_INVALID_CHANNEL") {
        message.channel.send(`${message.author} "\`${cmddata}\`" É inválido, você precisa informar o ID ou mencionar algum chat que eu tenha permissão de ler e enviar mensagens`)
    } else if (ERR_ID == "BADWORD_LOG_NO_PERM_CHANNEL") {
        message.channel.send(`${message.author} Oops! Eu não tenho permissão para ler e/ou enviar mensagens no chat <#${cmddata.replace(/[<#>]/g, '')}> e por isso não posso usa-lo.`)
    } else if (ERR_ID == "BADWORD_LOG_CHANNEL_INFO") {
        message.channel.send(`${message.author} O chat atualmente definido como log para o modo badword é <#${cmddata}>.`)
    }
};

module.exports.rank = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "RANK_LEVELING_DISABLED") {
        message.channel.send(`${message.author} O módulo de Experiência está desativado nesse servidor.`)
    } else if (ERR_ID == "RANK_MORE_ARGS") {
        message.channel.send(`${message.author} o rank é global, se você deseja ver as informações suas ou de alguém, use "\`${guilddb.prefix}profile <opcional:usuário>\`"`)
    } else if (ERR_ID == "RANK_NO_DATA") {
        message.channel.send(`${message.author} não tenho dados os suficiente para montar uma tabela de liderança`)
    } else if (ERR_ID == "RANK_RESPONSE_SORTED") {
        var ranktext = "";
        var ranksize, rankpos = 0;
        ranksize = Math.min(cmddata.length, 10);
        while (ranksize > 0) {
            rankpos += 1;
            // if (rankpos == 4) ranktext += "\n";
            ranktext += `${rankpos}- <@${cmddata[rankpos-1].userid}>: ${cmddata[rankpos-1].experience} EXP\n`;
            ranksize -= 1;
        }
        embedresponse = {
            "title": "Rank de Experiência do Servidor",
            "description": ranktext,
            "timestamp": new Date(),
            "footer": {
              "icon_url": `${message.guild.iconURL() || ""}`,
              "text": `${message.guild.name}`
            }
          }
        
          message.channel.send(`${message.author} Aqui está:`, { embed: embedresponse } );
    }
};

module.exports.levelcfg = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "NO_PERM_BAN_MEMBERS") {
        message.channel.send(`${message.author} você não tem permissão para usar esse comando! a permissão que precisa é: banir membros`)
    } else if (ERR_ID == "LEVELCFG_LEVELING_DISABLED") {
        message.channel.send(`${message.author} O módulo de Experiência está desativado nesse servidor.`)
    } else if (ERR_ID == "LEVELCFG_INVALID_CMD") {
        message.channel.send(`${message.author} use set, add, rem ou reset`)
    } else if (ERR_ID == "LEVELCFG_SET_NO_ARGS") {
        message.channel.send(`${message.author} especifique o usuário e a quantia de xp a ser definida`)
    } else if (ERR_ID == "LEVELCFG_INVALID_USER") {
        message.channel.send(`${message.author} "${cmddata}" é inválido. Você precisa especificar algum usuário desse servidor.`)
    } else if (ERR_ID == "LEVELCFG_INVALID_NUMBER") {
        message.channel.send(`${message.author} "${cmddata}" é inválido. Você precisa especificar um número inteiro positivo`)
    } else if (ERR_ID == "LEVELCFG_ADD_NO_ARGS") {
        message.channel.send(`${message.author} especifique o usuário e a quantia de xp a ser adicionada`)
    } else if (ERR_ID == "LEVELCFG_REM_NO_ARGS") {
        message.channel.send(`${message.author} especifique o usuário e a quantia de xp a ser adicionada`)
    } else if (ERR_ID == "LEVELCFG_REM_BELOW_ZERO") {
        message.channel.send(`${message.author} erro: a experiência do usuário não pode ficar abaixo de zero`)
    }
};

module.exports.moneycfg = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "NO_PERM_BAN_MEMBERS") {
        message.channel.send(`${message.author} você não tem permissão para usar esse comando! a permissão que precisa é: banir membros`)
    } else if (ERR_ID == "MONEYCFG_ECONOMY_DISABLED") {
        message.channel.send(`${message.author} O módulo de economia está desativado nesse servidor.`)
    } else if (ERR_ID == "MONEYCFG_INVALID_CMD") {
        message.channel.send(`${message.author} use set, add, rem ou reset`)
    } else if (ERR_ID == "MONEYCFG_SET_NO_ARGS") {
        message.channel.send(`${message.author} especifique o usuário e a quantia de dinheiro a ser definida`)
    } else if (ERR_ID == "MONEYCFG_INVALID_USER") {
        message.channel.send(`${message.author} "${cmddata}" é inválido. Você precisa especificar algum usuário desse servidor.`)
    } else if (ERR_ID == "MONEYCFG_INVALID_NUMBER") {
        message.channel.send(`${message.author} "${cmddata}" é inválido. Você precisa especificar um número inteiro positivo`)
    } else if (ERR_ID == "MONEYCFG_ADD_NO_ARGS") {
        message.channel.send(`${message.author} especifique o usuário e a quantia de xp a ser adicionada`)
    } else if (ERR_ID == "MONEYCFG_REM_NO_ARGS") {
        message.channel.send(`${message.author} especifique o usuário e a quantia de xp a ser removida`)
    } else if (ERR_ID == "MONEYCFG_REM_BELOW_ZERO") {
        message.channel.send(`${message.author} erro: a experiência do usuário não pode ficar abaixo de zero`)
    }
};

module.exports.money = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "MONEY_ECONOMY_DISABLED") {
        message.channel.send(`${message.author} O módulo de economia está desativado nesse servidor.`)
    } else if (ERR_ID == "MONEY_TOP_MORE_ARGS") {
        message.channel.send(`${message.author} O money rank é global, se você deseja ver as informações suas ou de alguém, use "\`${guilddb.prefix}profile <opcional:usuário>\`"`)
    } else if (ERR_ID == "MONEY_NO_DATA") {
        message.channel.send(`${message.author} Não tenho dados os suficiente para poderem usar esse recurso.`)
    } else if (ERR_ID == "MONEY_RESPONSE_SORTED") {
        var ranktext = "";
        var banktext = "";
        var ranksize, rankpos = 0;
        ranksize = Math.min(cmddata.length, 10);
        while (ranksize > 0) {
            rankpos += 1;
            if (cmddata[rankpos-1].userid) ranktext += `${rankpos}- <@${cmddata[rankpos-1].userid}>: $${cmddata[rankpos-1].money}\n`;
            if (cmddata[rankpos-1].bankuser) banktext = `\nQuantia adquirida pelo Banco com taxas: $${cmddata[rankpos-1].money}`
            ranksize -= 1;
        }
        ranktext += banktext;
        embedresponse = {
            "title": "Rank da Economia do Servidor",
            "description": ranktext,
            "timestamp": new Date(),
            "footer": {
              "icon_url": `${message.guild.iconURL() || ""}`,
              "text": `${message.guild.name}`
            }
        }
        message.channel.send(`${message.author} Aqui está:`, { embed: embedresponse } );
    } else if (ERR_ID == "MONEY_PAY_NO_ARGS") {
        message.channel.send(`${message.author} especifique o usuário e a quantia a ser enviada.`)
    } else if (ERR_ID == "MONEY_INVALID_USER") {
        message.channel.send(`${message.author} "${cmddata}" é inválido. Você precisa especificar algum usuário desse servidor.`)
    } else if (ERR_ID == "MONEY_INVALID_NUMBER") {
        message.channel.send(`${message.author} "${cmddata}" é inválido. Você precisa especificar um número inteiro positivo`)
    } else if (ERR_ID == "MONEY_PAY_NO_MONEY") {
        message.channel.send(`${message.author} Você não possui dinheiro para poder enviar.`)
    } else if (ERR_ID == "MONEYCFG_PAY_NO_MONEY") {
        message.channel.send(`${message.author} Você não tem dinheiro o suficiente para pagar essa quantia!`)
    } else if (ERR_ID == "MONEY_PAY_SELF_MENTION") {
        message.channel.send(`${message.author} Você não pode enviar dinheiro a você mesmo!`)
    } else if (ERR_ID == "MONEYCFG_PAY_BELOW_ONE") {
        message.channel.send(`${message.author} O Valor mínimo para realizar pagamentos é $2!`)
    } else if (ERR_ID == "MONEY_PAY_INVALID_NUMBER") {
        message.channel.send(`${message.author} "${cmddata}" é inválido. Você precisa especificar um número inteiro positivo maior que 1!`)
    } else if (ERR_ID == "MONEY_PAY_BOT_MENTION") {
        message.channel.send(`${message.author} O usuário é um Bot. Você só pode enviar dinheiro para outros membros do servidor!`)
    }
};

module.exports.badword = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "BADWORD_BADWORD_DISABLED") {
        message.channel.send(`${message.author} O módulo de bloqueio de palavras está desativado nesse servidor.`)
    } else if (ERR_ID == "BADWORD_NO_PERM_MANAGE_MESSAGES") {
        message.channel.send(`${message.author} você não tem permissão para usar esse comando! a permissão que precisa é: gerenciar mensagens`)
    } else if (ERR_ID == "BADWORD_NO_ARGS") {
        message.channel.send(`${message.author} você precisa especificar uma ação: add, rem ou list.`)
    } else if (ERR_ID == "BADWORD_BLANK_LIST") {
        message.channel.send(`${message.author} Atualmente não tem nenhuma palavra na lista de bloqueio!`)
    } else if (ERR_ID == "BADWORD_ADD_NO_WORD") {
        message.channel.send(`${message.author} Você precisa especificar qual palavra devo adicionar!`)
    } else if (ERR_ID == "BADWORD_DUPLICATED_WORD") {
        message.channel.send(`${message.author} Oops! \`${cmddata}\` já está na lista de palavras proibidas!`)
    } else if (ERR_ID == "BADWORD_REM_NO_WORD") {
        message.channel.send(`${message.author} Você precisa especificar qual palavra devo adicionar!`)
    } else if (ERR_ID == "BADWORD_REM_NO_WORD_DB") {
        message.channel.send(`${message.author} Oops! Não encontrei \`${cmddata}\` na lista de palavras proibidas!`)
    } else if (ERR_ID == "BADWORD_REM_BLANK_DB") {
        message.channel.send(`${message.author} Oops! Minha lista de palavras proibidas está vazia, Não tem o que ser removido!`)
    }
};

module.exports.perfil = async (ERR_ID, cmddata, client, message, args, guilddb) => {
    if (ERR_ID == "PERFIL_INVALID_USER") {
        message.channel.send(`${message.author} "${cmddata}" é inválido. Você precisa especificar algum usuário desse servidor.`)
    } else if (ERR_ID == "PERFIL_USER_BOT") {
        message.channel.send(`${message.author} Oops! Parece que você mencionou um Bot, infelizmente somente membros reais podem ter um perfil.`)
    } else if (ERR_ID == "PERFIL_USER_NO_DATA") {
        message.channel.send(`${message.author} Desculpe, mas não tenho informações o suficiente sobre esse usuário para montar um perfil`)
    }
};