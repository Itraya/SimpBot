const { Client, Events, GatewayIntentBits, Partials, ChannelType } = require('discord.js');
const { token, adminId } = require('./config.json');

const client = new Client({ partials: [ Partials.Channel ], intents: [
                                        GatewayIntentBits.Guilds,
                                        GatewayIntentBits.GuildMembers,
                                        GatewayIntentBits.GuildMessages,
                                        GatewayIntentBits.DirectMessages,
                                        GatewayIntentBits.MessageContent
                                    ] });

client.once(Events.ClientReady, client => {
    console.log('Ready! Logged in as', client.user.tag);
});

function sendAttachmentsMessage(id, message, attachments) {
    let files = attachments.map(attachment => attachment.url);
    client.users.fetch(id).then(user => {
        user.send({ content: message, files: files });
    });
}

function sendMessage(id, message) {
    client.users.fetch(id).then(user => {
        user.send(message);
    });
}

client.on(Events.MessageCreate, message => {

    if (message.author.bot) return;
    if (message.channel.type !== ChannelType.DM) return;

    if (message.author.id !== adminId) {
        if (message.attachments.size > 0)
            sendAttachmentsMessage(adminId, message.content, message.attachments);
        else
            sendMessage(adminId, message.content);
    }
    
});

client.login(token);