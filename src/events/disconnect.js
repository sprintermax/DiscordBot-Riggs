module.exports = async client => {
	client.user.setStatus("offline");
	console.log(`[INFO] O Bot ficou Offline`);
}