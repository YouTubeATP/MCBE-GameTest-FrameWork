import { runCommand } from "../../utils/others.js";

var commandInfo = {
    cancelMessage: true,
    description: 'Use this command to set home and later teleport to that position-',
    usage: [
        'home list',
        'home set <home name>',
        'home remove <home name>',
        'home warp <home name>'
    ]
};
/**
 * Explanation of the parameters that are being passed in the 'execute' function
 * @param {Object} chatmsg - This is the object that is passed by the event listening for messages being sent in chat
 * @param {Array} args - This collectes all the message that comes after the prefix and the command name in a array, which is split by an 'space'
 * @param {Module} Minecraft - This is the module Minecraft, which holds all the important classes. More information at: https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/minecraft
 */
function execute(chatmsg, args, Minecraft) {
    const data = runCommand(`tag "${chatmsg.sender.name}" list`).result;
    const coordFormat = /(?<=[x-zX-Z]: )(-\d+|\d+)/g;
    const homeName = args.slice(1).join(' ').toLowerCase();
    const homeRegex = new RegExp(`\\$\\(Home{Home-Name: \\b${homeName}\\b, X: (-\\d+|\\d+), Y: (-\\d+|\\d+), Z: (-\\d+|\\d+)(.*)}\\)`, 'g');

    const findHomeNames = /(?<=\(Home{Home-Name: ).+?(?=, X: (-\d+|\d+), Y: (-\d+|\d+), Z: (-\d+|\d+)}\))/g;
    const findXYZ = `${data.statusMessage.match(homeRegex)}`.match(coordFormat);

    let listOptions = ['list', 'all'];let setOptions = ['set', 'add'];let removeOptions = ['remove', 'unadd'];let warpOptions = ['warp', 'tp'];
    if(!args.length || listOptions.includes(args[0])) {
        const allHomes = data.statusMessage.match(findHomeNames);
        return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"${allHomes ? `§bYou have total of §e${allHomes.length} §bhomes.\nHere are the list of homes: §a${allHomes.join('§r, §a')}` : '§cIt seems like you haven\'t set any home, yet-'}"}]}`);
    } else if(setOptions.includes(args[0])) {
        if(!args[1]) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cPlease type a UNIQUE home name to set!"}]}`);
        if(homeName.match(coordFormat)) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cYou may not indentify your home name in a coordinate format!"}]}`);

        if(data.statusMessage.match(homeRegex)) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cYou already have a home set with that name!"}]}`);

        runCommand(`tag "${chatmsg.sender.name}" add "$(Home{Home-Name: ${homeName}, X: ${Math.trunc(chatmsg.sender.location.x)}, Y: ${Math.trunc(chatmsg.sender.location.y)}, Z: ${Math.trunc(chatmsg.sender.location.z)}})"`);
        return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§bYou have set a home with the name §a${homeName} §bat§r: §a${Math.trunc(chatmsg.sender.location.x)}§r, §a${Math.trunc(chatmsg.sender.location.y)}§r, §a${Math.trunc(chatmsg.sender.location.z)}"}]}`);
    } else if(removeOptions.includes(args[0])) {
        if(!args[1]) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cPlease type a home name to remove!"}]}`);
        if(!data.statusMessage.match(homeRegex)) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cYou don't have a home with that name!"}]}`);
        else {
            const tag = data.statusMessage.match(homeRegex);
            runCommand(`tag "${chatmsg.sender.name}" remove "${tag[0]}"`);
            return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§bSuccessfully removed home with the name §a${homeName} §bat §a${findXYZ[0]}§r, §a${findXYZ[1]}§r, §a${findXYZ[2]}"}]}`);
        };
    } else if(warpOptions.includes(args[0])) {
        if(!args[1]) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cPlease type a home name to remove!"}]}`);
        if(!data.statusMessage.match(homeRegex)) return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cYou don't have a home with that name!"}]}`);

        runCommand(`execute "${chatmsg.sender.name}" ~~~ tp @s ${findXYZ[0]} ${findXYZ[1]} ${findXYZ[2]}`);
        return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§bYou have been teleported to §a${findXYZ[0]}§r, §a${findXYZ[1]}§r, §a${findXYZ[2]}"}]}`);
    } else return runCommand(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cThat's not a valid argument!"}]}`);
};

export { commandInfo, execute };
