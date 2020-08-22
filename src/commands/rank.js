const cmdresponse = require(`../scripts/cmdresponse.js`);

module.exports.run = async (client, message, args, guilddb) => {
    if (guilddb.hasOwnProperty('config')) {
        if (guilddb.config.hasOwnProperty('leveling') && guilddb.config.leveling == "on") {
            if (guilddb.hasOwnProperty('levels')) {
                if (args.length > 0) return cmdresponse.rank("RANK_MORE_ARGS", "", client, message, args, guilddb);

                const rankedusers = guilddb.levels;

                rankedusers.sort(function(b, a){
                    const useraxp = a.userxp;
                    const userbxp = b.userxp;
                
                    let sortedrank = 0;
                    if (useraxp > userbxp) {
                        sortedrank = 1;
                    } else if (useraxp < userbxp) {
                        sortedrank = -1;
                    }
                    return sortedrank;
                });
                cmdresponse.rank("RANK_RESPONSE_SORTED", rankedusers, client, message, args, guilddb);
            } else return cmdresponse.rank("RANK_NO_DATA", "", client, message, args, guilddb);
        } else return cmdresponse.rank("RANK_LEVELING_DISABLED", "", client, message, args, guilddb);
    } else return cmdresponse.rank("RANK_LEVELING_DISABLED", "", client, message, args, guilddb);
};