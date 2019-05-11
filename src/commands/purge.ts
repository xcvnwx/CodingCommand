import * as Discord from "discord.js";
import { IBotCommand } from "../api";

export default class purge implements IBotCommand {

    private readonly _command = "purge"

    help(): string {
        return "(Admin Only) Deletes the ammount of messages you choose from the channel !!"
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> {

        msgObject.delete();

        if (!msgObject.member.hasPermission("ADMINISTRATOR")) {
            msgObject.channel.send(`You Do not have permission to use this command ${msgObject.author.username} `)
                .then(msg => {
                    (msg as Discord.Message).delete(5000);
                });
            return;
        }

        if (!args[0]) {
            msgObject.channel.send(`Please supply the ammount of messages to be deleted. ${msgObject.author.username} `)
                .then(msg => {
                    (msg as Discord.Message).delete(5000);
                });
            return;
        }

        let numberOfMessagesToDelete = Number(args[0]);

        if (numberOfMessagesToDelete == NaN) {
            msgObject.channel.send(`Not a valid number. ${msgObject.author.username} `)
                .then(msg => {
                    (msg as Discord.Message).delete(5000);
                });
            return;
        }

        numberOfMessagesToDelete = Math.round(numberOfMessagesToDelete = 1);

        msgObject.channel.bulkDelete(numberOfMessagesToDelete)
            .catch(console.error);
    }
}