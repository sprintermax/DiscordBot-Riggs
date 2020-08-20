module.exports.config = async (error, client, message, args, guilddb) => {
    if (error == "NO_PERM_MANAGE_GUILD") {
        message.channel.send(`${message.author} Erro: Você não tem permissão para executar esse comando.`)
    } else if (error == "GERAL_INVALID_CMD") {
        message.channel.send(`${message.author} pagina inicial config`)
    } else if (error == "PREFIX_NO_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Nenhum prefixo definido`)
    } else if (error == "PREFIX_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    } else if (error == "ECONOMY_UNSUPPORTED") {
        message.channel.send(`${message.author} Erro: opções válidas são enabled ou disabled`)
    } else if (error == "ECONOMY_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    } else if (error == "LEVELING_UNSUPPORTED") {
        message.channel.send(`${message.author} Erro: opções válidas são enabled ou disabled`)
    } else if (error == "LEVELING_MORE_ARGS") {
        message.channel.send(`${message.author} Comando Errado: Mais Argumentos do que precisa`)
    }
};