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