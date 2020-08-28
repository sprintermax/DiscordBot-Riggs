const Discord = require(`discord.js`);

module.exports.run = async (client, message, guilddb) => {
    const db = client.botdb;
    const badwords = guilddb.badwords;
	const words = message.content.replace(/[^A-ZÁÉÍÓÚáéíóúÂÊÔâêôÀàÜüÇçÑñÃÕãõ\s\d]/ig," ").split(/ +/g);
	var badword = "";
	words.forEach(word => {
		if(badwords.includes(word.toLowerCase())) {
			badword += `"${word}" `
		}
	});
	if (message.author) staffmember = message.member.hasPermission("MANAGE_MESSAGES");
	if (badword && !message.author.bot && (message.content.indexOf(`${guilddb.prefix}`) == -1)) {
		let embed = new Discord.MessageEmbed()
			.setTitle('~ Uma palavra inapropriada foi encontrada!')
		if(message.author.bot || staffmember) {
			embed.setDescription(`*A mensagem não foi excluída pois o usuário é um moderador ou está na lista branca.*`);
		} else message.delete();
		embed.setThumbnail(message.author.avatarURL())
			.addField('❗ Contéudo inteiro da mensagem:', message.content)
			.addField('🚫 Contéudo inapropriado da mensagem:', badword)
			.addField('💬 Onde ocorreu e quem enviou:', `Mensagem enviada por ${message.author} no chat ${message.channel}`)
			.setFooter(message.guild.name, message.guild.iconURL() || "");
        const logchannel = message.guild.channels.cache.get(guilddb.config.badwordlog);
        if (logchannel.permissionsFor(message.guild.me).has('VIEW_CHANNEL') && logchannel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            logchannel.send(embed);
        } else {
            db.updateOne(
                { "DBGuildID": message.guild.id },
                { $set: { "config.badwordlog" : "off" } }
            );
        }
	}
};