import * as Discord from "discord.js";
import { IBotCommand } from "../api";

export default class ban implements IBotCommand {

    private readonly _command = "ban"

    help(): string {
        return "(Admin Only) bans the mentioned user"
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> {

        let mentionedUser = msgObject.mentions.users.first();
        let suppliedReason = args.slice(1).join(" ") || "";
        let banLog = `${msgObject.author.username}: ${suppliedReason}`;

        msgObject.delete();

        if (!msgObject.member.hasPermission("ADMINISTRATOR")) {
            msgObject.channel.send(`You Do not have permission to use this command ${msgObject.author.username} `)
                .then(msg => {
                    (msg as Discord.Message).delete(5000);
                });
            return;
        }

        if (!mentionedUser) {
            msgObject.channel.send(`Sorry ${msgObject.author.username}, I couldn't find that user in the server!!`)
                .then(msg => {
                    (msg as Discord.Message).delete(5000);
                });
            return;
        }

        msgObject.delete(0);

        msgObject.guild.member(mentionedUser).ban(banLog)
            .then(console.log)
            .catch(console.error)
    }
}