const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');

dotenv.config();

// Open AI Connection
const aiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(aiConfig)

const mainHex = '#d79a61'

// Set up cooldown stuff
const cooldown = new Set();
const oneMinCooldown = 60000;
const twoMinCooldown = oneMinCooldown * 2;
const fiveMinCooldown = oneMinCooldown * 5; 
const tenMinCooldown = fiveMinCooldown * 2 ; 
const thirtyMinCooldown = tenMinCooldown * 3;
const oneHourCooldown = thirtyMinCooldown * 2;
const twelveHourCooldown = oneHourCooldown * 12;
const OneDayCooldown = twelveHourCooldown * 2;
const OneWeekCooldown = OneDayCooldown * 7;

const cdList = ['Chill Out', 'CHILLLLL', 'Stop.', 'Take a Breather', 'ok', 'Spamming commands is cringe', 'Slow it down', 'Wee-Woo-Wee-Woo Pull Over', 'No smile', '-_-', 'Why tho...', 'Yikes U Should Like Not', 'Slow it Cowboy', 'Take a Break Bro', 'Go Touch Some Grass']


exports.tshCmd = async function tshCmd(user,guild,interaction,topic) { 
    const cmdName = 'tsh'

    if (cooldown.has(`${user.id}--${cmdName}`)) {
        const embed = new EmbedBuilder()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every 10 minutes')
        .setColor('Red')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    } else {

        try {

            const res = await openai.createCompletion("text-davinci-002", {
                prompt: `Topic: ${topic}\nTwo-Sentence Horror Story:`,
                temperature: 0.8,
                max_tokens: 60,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
            })
        
            if (res.data.choices[0].text != '') {
                const embed = new EmbedBuilder()
                .setTitle('Two Sentence Horror | Topic: ' + topic)
                .setDescription(res.data.choices[0].text)
                .setColor(mainHex)
        
                interaction.reply({
                    embeds: [embed]
                })
            }

            //now, set cooldown
            cooldown.add(`${user.id}--${cmdName}`);
            setTimeout(() => {
                cooldown.delete(`${user.id}--${cmdName}`);
            }, tenMinCooldown);

        } catch (error) {

            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
    
            const embed = new EmbedBuilder()
                .setTitle('ERROR')
                .setDescription('An error occured with this command. Please try again later. If the error persists, reach out to [SUPPORT](https://seedsbot.xyz/support)')
                .setColor("Red")
        
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }


    }

    cmdRun(user,cmdName,guild,interaction)
}