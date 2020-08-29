const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
        if (guilddb.config.hasOwnProperty('leveling') && guilddb.config.leveling == "on") {
            if (guilddb.hasOwnProperty('profiles')) {
                if (args.length > 0) return cmdresponse.rank("RANK_MORE_ARGS", "", client, message, args, guilddb);

                const userprofiles = guilddb.profiles;
                const rankedusers = userprofiles.filter(profile => profile.experience)
                if (rankedusers.length < 1) return cmdresponse.rank("RANK_NO_DATA", "", client, message, args, guilddb);
                const userrank = rankedusers.sort(function(b, a) {
                    const useraxp = a.experience;
                    const userbxp = b.experience;
                
                    let sortedrank = 0;
                    if (useraxp > userbxp) {
                        sortedrank = 1;
                    } else if (useraxp < userbxp) {
                        sortedrank = -1;
                    }
                    return sortedrank;
                });
                cmdresponse.rank("RANK_RESPONSE_SORTED", userrank, client, message, args, guilddb);
            } else return cmdresponse.rank("RANK_NO_DATA", "", client, message, args, guilddb);
        } else return cmdresponse.rank("RANK_LEVELING_DISABLED", "", client, message, args, guilddb);
};