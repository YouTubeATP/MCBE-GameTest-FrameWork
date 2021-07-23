var commandInfo = { //This variable holds the command information for help command to display. Such as the description and usage
    description: 'Get data of an MR station.',
    usage: [
        'stationdata <station code>',
        'stationdata <station code> eng',
        'stationdata <station code> chi'
    ]
};
import { stationData } from '../../assets/stationData.js';
/**
 * Explanation of the parameters that are being passed in the 'execute' function
 * @param {Object} chatmsg This is the object that is passed by the event listening for messages being sent in chat
 * @param {Array} args This collectes all the message that comes after the prefix and the command name in a array, which is split by an 'space'
 * @param {Module} Minecraft This is the module Minecraft, which holds all the important classes. More information at: https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/minecraft
 */
function execute(chatmsg, args, Minecraft) {
    chatmsg.canceled = true;
    if (args[0] in stationData) {
        var key = args[0];
        var lang = args[1] ? args[1] : "eng";
        var name = (lang === "eng") ? stationData[key].ename : stationData[key].cname;
        var lines = stationData[key].line.split(" ");
        if (lang === "eng") {
            var stationType = (lines.length >= 3) ? "Checkpoint" : "Station";
            var lineNames = {"MSL": "Milestone Line", "NEL": "New Era Line", "EWL": "East-West Line", "CAL": "Cave Line", "CIL": "City Line", "EBL": "EST Branch Line", "IIL": "Interisland Line"};
            var linee = "";
            lines.forEach(line => {
                linee += lineNames[line] + ", ";
            });
            var res = `§6${name} ${stationType}\n\n§2Passing Lines§r - §c${linee.slice(0, -2)}\n§2No. of exits§r - §c${stationData[key].exit}\n§2X, Z Coordinates§r - §c(${stationData[key].x}, ${stationData[key].z})`;
        } else if (lang === "chi") {
            var stationType = (lines.length >= 3) ? "檢查站" : "站";
            var lineNames = {"MSL": "里程綫", "NEL": "新代綫", "EWL": "東西綫", "CAL": "洞穴綫", "CIL": "城市綫", "EBL": "站站講支綫", "IIL": "跨島綫"};
            var linee = "";
            lines.forEach(line => {
                linee += lineNames[line] + "、";
            });
            var res = `§6${name}${stationType}\n\n§2途經路綫§r - §c${linee.slice(0, -1)}\n§2出口數量§r - §c${stationData[key].exit}\n§2X, Z 座標§r - §c(${stationData[key].x}, ${stationData[key].z})`;
        }
        Minecraft.Commands.run(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"${res}"}]}`);
    } else {
        Minecraft.Commands.run(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cCould not find station §2${args[0]}§c!"}]}`);
    }
}

export { commandInfo, execute }; //Export all these so it can be later exported as a identifier from the file 'export.js'