module.exports = async client => {
	client.user.setStatus("online");
	client.user.setActivity(`Trabalhando em ${client.guilds.cache.size} Servidores | r!help`, {type: `PLAYING`});
	console.info(`O Bot está online no usuário "${client.user.tag}" (${client.user.id})`);
}