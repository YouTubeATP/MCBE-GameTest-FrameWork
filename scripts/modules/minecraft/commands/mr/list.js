var commandInfo = { //This variable holds the command information for help command to display. Such as the description and usage
    description: 'Lists all MR stations.',
    usage: ['liststations']
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
    let msg = "";
    for (const key in stationData) {
        let lines = stationData[key].line.split(" ");
        let res = (lines.length >= 3) ? `§2${key}§r - §c${stationData[key].cname}檢查站 ${stationData[key].ename} Checkpoint\n` : `§2${key}§r - §c${stationData[key].cname}站 ${stationData[key].ename} Station\n`;
        msg += res;
    }
    Minecraft.Commands.run(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"${msg}"}]}`);
};

export { commandInfo, execute }; //Export all these so it can be later exported as a identifier from the file 'export.js'