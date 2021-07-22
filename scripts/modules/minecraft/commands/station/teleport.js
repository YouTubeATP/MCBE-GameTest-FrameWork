var commandInfo = { //This variable holds the command information for help command to display. Such as the description and usage
    description: 'Teleport to a MR station.',
    usage: ['tpstation <station code>']
};
import { stationData } from '../assets/stationData.js';
/**
 * Explanation of the parameters that are being passed in the 'execute' function
 * @param {Object} chatmsg This is the object that is passed by the event listening for messages being sent in chat
 * @param {Array} args This collectes all the message that comes after the prefix and the command name in a array, which is split by an 'space'
 * @param {Module} Minecraft This is the module Minecraft, which holds all the important classes. More information at: https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/minecraft
 */
function execute(chatmsg, args, Minecraft) {
    chatmsg.canceled = true;
    if (args[0] in stationData) {
        var station = stationData[args[0]];
        Minecraft.Commands.run(`execute "${chatmsg.sender.name}" ~~~ tp @s ${station.x} 200 ${station.z}`);
        Minecraft.Commands.run(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cYou have been teleported to §2${args[0]}§c!"}]}`);
    } else {
        Minecraft.Commands.run(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cCould not find station §2${args[0]}§c!"}]}`);
    }
}

export { commandInfo, execute }; //Export all these so it can be later exported as a identifier from the file 'export.js'