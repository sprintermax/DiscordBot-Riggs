module.exports = async client => {
	client.user.setStatus("offline");
	console.info(`O Bot ficou Offline`);
}