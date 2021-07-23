import { runCommand } from "../../utils/others.js";

function smartfill(x1, y1, z1, x2, y2, z2, block, option, player, Minecraft) {
    let new_x1 = Math.min(x1, x2);
    let new_y1 = Math.min(y1, y2);
    let new_z1 = Math.min(z1, z2);
    let new_x2 = Math.max(x1, x2);
    let new_y2 = Math.max(y1, y2);
    let new_z2 = Math.max(z1, z2);

    x1 = new_x1;
    y1 = new_y1;
    z1 = new_z1;
    x2 = new_x2;
    y2 = new_y2;
    z2 = new_z2;

    let x_diff = Math.abs(x2-x1) + 1;
    let y_diff = Math.abs(y2-y1) + 1;
    let z_diff = Math.abs(z2-z1) + 1;

    let offset = Math.max(Math.abs(32-x1), Math.abs(32-y1), Math.abs(32-z1), Math.abs(32-x2), Math.abs(32-y2), Math.abs(32-z2));

    if (Math.abs(x_diff*y_diff*z_diff) > 32768) {
        for (let x = x1+offset; x < x2-32+offset; x+=32) {
            if (x+32-offset != x2) {
                for (let y = y1+offset; y < y2-32+offset; y+=32) {
                    if (y+32-offset != y2) {
                        for (let z = z1+offset; z < z2-32+offset; z+=32) {
                            if (z+32-offset != z2) {
                                Minecraft.Commands.run(`execute "${player.name}" ~~~ fill ${x-offset} ${y-offset} ${z-offset} ${x+32-offset} ${y+32-offset} ${z+32-offset} ${block} ${option}`);
                            }
                        }
                    }
                }
            }
        }

        let x_remainder = x_diff % 32;
        let y_remainder = y_diff % 32;
        let z_remainder = z_diff % 32;

        Minecraft.Commands.run(`execute "${player.name}" ~~~ fill ${x_diff-x_remainder} ${y1} ${z1} ${x2} ${y2} ${z2} ${block} ${option}`);
        Minecraft.Commands.run(`execute "${player.name}" ~~~ fill ${x1} ${y_diff-y_remainder} ${z1} ${x2} ${y2} ${z2} ${block} ${option}`);
        Minecraft.Commands.run(`execute "${player.name}" ~~~ fill ${x1} ${y1} ${z_diff-z_remainder} ${x2} ${y2} ${z2} ${block} ${option}`);
    } else {
        Minecraft.Commands.run(`execute "${player.name}" ~~~ fill ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ${block} ${option}`);
    }
}

var commandInfo = { //This variable holds the command information for help command to display. Such as the description and usage
    description: 'Access WorldEdit. This feature is §eEXTREMELY UNSTABLE§r!!!',
    usage: ['we pos1', 'we pos2', 'we fill <block>']
};
/**
 * Explanation of the parameters that are being passed in the 'execute' function
 * @param {Object} chatmsg This is the object that is passed by the event listening for messages being sent in chat
 * @param {Array} args This collectes all the message that comes after the prefix and the command name in a array, which is split by an 'space'
 * @param {Module} Minecraft This is the module Minecraft, which holds all the important classes. More information at: https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/minecraft
 */
function execute(chatmsg, args, Minecraft) {
    const data = runCommand(`tag "${chatmsg.sender.name}" list`).result;
    const coordFormat = /(?<=[x-zX-Z]: )(-\d+|\d+)/g;
    const pos1Regex = new RegExp(`\\$\\(Pos1{Player-Name: \\b${chatmsg.sender.name}\\b, X: (-\\d+|\\d+), Y: (-\\d+|\\d+), Z: (-\\d+|\\d+)(.*)}\\)`, 'g');
    const pos2Regex = new RegExp(`\\$\\(Pos2{Player-Name: \\b${chatmsg.sender.name}\\b, X: (-\\d+|\\d+), Y: (-\\d+|\\d+), Z: (-\\d+|\\d+)(.*)}\\)`, 'g');

    const findPos1XYZ = `${data.statusMessage.match(pos1Regex)}`.match(coordFormat);
    const findPos2XYZ = `${data.statusMessage.match(pos2Regex)}`.match(coordFormat);

    if (args[0] == "pos1") {
        if (!(args[1] && args[2] && args[3])) {
            runCommand(`tag "${chatmsg.sender.name}" add "$(Pos1{Player-Name: ${chatmsg.sender.name}, X: ${Math.trunc(chatmsg.sender.location.x)}, Y: ${Math.trunc(chatmsg.sender.location.y)}, Z: ${Math.trunc(chatmsg.sender.location.z)}})"`);
        } else {
            runCommand(`tag "${chatmsg.sender.name}" add "$(Pos1{Player-Name: ${chatmsg.sender.name}, X: ${args[1]}, Y: ${args[2]}, Z: ${args[3]}})"`);
        }
        chatmsg.canceled = true;
        Minecraft.Commands.run(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cPos1 set to (§2${Math.trunc(chatmsg.sender.location.x)}§c, §2${Math.trunc(chatmsg.sender.location.y)}§c, §2${Math.trunc(chatmsg.sender.location.z)}§c)"}]}`);
    } else if (args[0] == "pos2") {
        if (!(args[1] && args[2] && args[3])) {
            runCommand(`tag "${chatmsg.sender.name}" add "$(Pos2{Player-Name: ${chatmsg.sender.name}, X: ${Math.trunc(chatmsg.sender.location.x)}, Y: ${Math.trunc(chatmsg.sender.location.y)}, Z: ${Math.trunc(chatmsg.sender.location.z)}})"`);
        } else {
            runCommand(`tag "${chatmsg.sender.name}" add "$(Pos2{Player-Name: ${chatmsg.sender.name}, X: ${args[1]}, Y: ${args[2]}, Z: ${args[3]}})"`);
        }
        chatmsg.canceled = true;
        Minecraft.Commands.run(`tellraw "${chatmsg.sender.name}" {"rawtext":[{"text":"§cPos2 set to (§2${Math.trunc(chatmsg.sender.location.x)}§c, §2${Math.trunc(chatmsg.sender.location.y)}§c, §2${Math.trunc(chatmsg.sender.location.z)}§c)"}]}`);
    } else if (args[0] == "fill") {
        let pos1 = findPos1XYZ;
        let pos2 = findPos2XYZ;
        runCommand(`tag "${chatmsg.sender.name}" remove "$(Pos1{Player-Name: ${chatmsg.sender.name}, X: ${pos1[0]}, Y: ${pos1[1]}, Z: ${pos1[2]}})"`);
        runCommand(`tag "${chatmsg.sender.name}" remove "$(Pos2{Player-Name: ${chatmsg.sender.name}, X: ${pos2[0]}, Y: ${pos2[1]}, Z: ${pos2[2]}})"`);
        smartfill(Number(pos1[0]), Number(pos1[1]), Number(pos1[2]), Number(pos2[0]), Number(pos2[1]), Number(pos2[2]), args[1], args[2], chatmsg.sender, Minecraft);
    }
};

export { commandInfo, execute }; //Export all these so it can be later exported as a identifier from the file 'export.js'