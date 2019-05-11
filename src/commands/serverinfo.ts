import * as Discord from "discord.js";
import { IBotCommand } from "../api";

export default class serverinfo implements IBotCommand {

    private readonly _command = "serverinfo"

    help(): string {
        return "This command does absolutely nothing! How fun :)"
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> {

        msgObject.delete();

        let embed = new Discord.RichEmbed()
            .setColor([255, 0, 0])
            .setTitle("Server Info")
            .setFooter("https://discord.gg/7aVUbEW")
            .setImage(msgObject.guild.iconURL)
            .setDescription("Welcome to our Server!!")
            .addField("Server Count:", `Our server currently has ${msgObject.guild.memberCount} members!!`)

        msgObject.channel.send(embed)
            .catch(console.error);
    }
}