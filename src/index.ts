import * as Discord from "discord.js";
import * as ConfigFile from "./config";
import { IBotCommand } from "./api";

const client: Discord.Client = new Discord.Client();

let commands: IBotCommand[] = [];

loadCommands(`${__dirname}/commands`)

client.on("ready", ()=> {

    client.user.setActivity("Coding Command", {type: "PLAYING"})

    console.log("Successfully, Launched !!")
    
})

client.on("guildMemberAdd", member => {

    let welcomeChannel = member.guild.channels.find(channel => channel.name === "🔔welcome🔔") as Discord.TextChannel;
    welcomeChannel.send(`Welcome ${member.displayName}! Please read our Server Rules !!`)

    let memberRole = member.guild.roles.find(role => role.id == "567745940619001876");
    member.addRole(memberRole);

    member.send("Thank you for joining Coding Command we hope you enjoy your time here!!");
})

client.on("guildMemberRemove", member => {

    let welcomeChannel = member.guild.channels.find(channel => channel.name === "🔔welcome🔔") as Discord.TextChannel;
    welcomeChannel.send(`We are sorry to see you go :((`)    
})

client.on("message", msg=> {

    //Ignore the message if it was sent by the bot
    if (msg.author.bot) { return; }

    //Ignore messages sent in DM
    if(msg.channel.type == "dm"){return;}
 
    //Ignore messgaes that don't start with the prefix
    if(!msg.content.startsWith(ConfigFile.config.prefix)) { return; }

    //Handle the command
    handleCommand(msg);
})

async function handleCommand(msg: Discord.Message) {

    //Split the string into the command and all of the args
    let command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "");
    let args = msg.content.split(" ").slice(1);

    //Loop through all of our loaded commands
    for(const commandClass of commands){

        //Attempt to execute code but ready incase of possible error
        try{

            //Check if our command class is the correct one
            if(!commandClass.isThisCommand(command)){

                //Go to the next interation of hte loop if this isn't the correct command class
                continue;
            }

            //Pause execution whilst we run the command's code
            await commandClass.runCommand(args, msg, client);
        }
        catch(exception){
            
            //If there is an erroe, log the exception
            console.log(exception);
        }
    }
}

function loadCommands(commandsPath: string) {

    //Exit if there are no commands        
    if(!ConfigFile.config.commands || (ConfigFile.config.commands as string[]).length === 0){ return; }

    //Loop through all of the commands in our config file
    for(const commandName of ConfigFile.config.commands as string[]){

        const commandsClass = require(`${commandsPath}/${commandName}`).default;

        const command = new commandsClass() as IBotCommand;

        commands.push(command);
    }
}

client.login(ConfigFile.config.token);