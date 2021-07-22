import * as allCommands from '../export.js';
import { config } from './../../index.js';
import { runCommand } from '../../utils/others.js';

var commandInfo = {
    cancelMessage: true,
    description: 'Get list of all the commands available or input an argument to get information about that specific command',
    usage: [
        'help',
        'help [command name]'
    ]
};
/**
 * Explanation of the parameters that are being passed in the 'execute' function
 * @param {Object} chatmsg - This is the object that is passed by the event listening for messages being sent in chat
 * @param {Array} args - This collectes all the message that comes after the prefix and the command name in a array, which is split by an 'space'
 * @param {Module} Minecraft - This is the module Minecraft, which holds all the important classes. More information at: https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/minecraft
 */
function execute(chatmsg, args, Minecraft) {
    const prefix = config.commandPrefix;
    const helpCmdList = ['help', 'eval', 'home', 'we', 'liststations', 'tpstation', 'ping'];
    const features = [
        '§f- §dRanks - Allows for the display of ranks in chat.',
        '§f- §dTeleport to Station - Teleport to any MR station.',
        '§f- §dHomes - Add a home and warp to it anytime.',
        '§f- §dWorldEdit - Shortern building time.',
    ];

    if(!args[0]) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§eMR GameTest Framework Pack§r\n\n§eFeatures: \n${features.join('\n')}\n\n§bCustom Command prefix§f: §a${prefix}\n§bCustom Command List: §l§c${helpCmdList.join(', ')}"}]}`);
    
    let cmdList = allCommands[args[0]];
    if(!cmdList) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cThat's not a valid command!"}]}`);
    
    cmdList = cmdList.commandInfo;
    let infoArr = []
    if(cmdList.description) infoArr.push(`§eDescription: §f${cmdList.description}`);
    if(cmdList.usage.length) infoArr.push(`§eUsage: \n§f${cmdList.usage.join('\n')}`);

    runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§eCommand: §a${prefix}§f${args[0]}\n${infoArr.join('\n')}"}]}`);
};

export { commandInfo, execute };