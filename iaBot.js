const translate = require("translate-google");
const request = require('node-fetch');

const { URL, URLSearchParams } = require('url');
const { chat, traduction, inputLang, outputLang } = require('./config.json');
const mainURL = new URL(chat.url);
const urlOptions = {
    bid: chat.brainID,
    key: chat.key,
    uid: null,
    msg: null
};
const handleStatus = (client, status) => {
    client.user.setStatus(status.state);
    client.user.setActivity(status.name, {
        type: status.type
    });
};

const handleTalk = async (msg) => {
    msg.content = msg.content.replace(/^<@!?[0-9]{1,20}> ?/i, '');
    if (msg.content.length < 2 || (!isNaN(chat.channel) && chat.channel != msg.channel.id)) return;
    msg.channel.sendTyping();

    if(traduction) //traduction activé ?
    {
        translate(msg.content, {to: inputLang}).then(async res => {
            urlOptions.uid = msg.author.id;
            urlOptions.msg = res;
            mainURL.search = new URLSearchParams(urlOptions).toString();
            try {
                let reply = await request(mainURL);
                if (reply) {
                    reply = await reply.json();
    
                    translate(reply.cnt, {to: outputLang}).then(response => {
                        msg.reply({
                            content: response,
                            allowedMentions: {
                                repliedUser: false
                            }
                        })
                    })
                }
            } catch (e) {
                console.log(e.stack);
            }
    
        }).catch(err => {
            console.error(err)
        })
    }
    else
    {
        urlOptions.uid = msg.author.id;
        urlOptions.msg = msg.content;
        mainURL.search = new URLSearchParams(urlOptions).toString();

        try {
            let reply = await request(mainURL);
            
            if (reply) {
                reply = await reply.json();

                msg.reply({
                    content: reply.cnt,
                    allowedMentions: {
                        repliedUser: false
                    }
                })
            }
        } catch (e) {
            console.log(e.stack);
        }
    }
};

module.exports = {
    handleStatus,
    handleTalk
};
