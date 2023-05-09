const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, time } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');
const { cooldownAdd, cooldownCheck, cdList, cooldownCheckTime } = require('../../functions/cooldown.js')

dotenv.config();

// Open AI Connection
const aiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(aiConfig)

const mainHex = '#d79a61'

exports.tshCmd = async function tshCmd(user,guild,interaction,topic) { 
    const cmdName = 'tsh'

    if (await cooldownCheck(user, cmdName, guild)) {
        await cooldownCheckTime(user, cmdName, guild).then((res) => {
            let dt = new Date();
            dt.setSeconds(dt.getSeconds() + res);

            const embed = new EmbedBuilder()
            .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
            .setDescription('You can use this command again ' + time(dt, 'R'))
            .setColor('Red')
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
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
            cooldownAdd(user,cmdName,guild,'twoMin')

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