module.exports = async client => {
	client.user.setStatus("online");
	client.user.setActivity(`Trabalhando em ${client.guilds.cache.size} Servidores | r!help`, {type: `PLAYING`});
	console.info(`[INFO] O Bot está online no usuário "${client.user.tag}" (${client.user.id})`);
	console.info(`[INFO] Link de convite do Bot: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=517190`);
}