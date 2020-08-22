const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
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