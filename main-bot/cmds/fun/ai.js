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

exports.aiCmd = async function aiCmd(user,guild,interaction,prompt) {
    const cmdName = 'friend'

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
            const completion = await openai.createCompletion({
                model: "text-ada-001",
                prompt: "You: " + prompt + " \n Friend: ",
                temperature: 0.5,
                max_tokens: 60,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
                stop: ["You:"],
            });

            if (completion.data.choices[0].text != '') {
                const embed = new EmbedBuilder()
                .setTitle('AI Friend')
                .setDescription('You: ' + prompt )
                .setFields([
                    {
                        name: 'AI:', value: completion.data.choices[0].text
                    }
                ])
                .setColor(mainHex)
        
                interaction.reply({
                    embeds: [embed]
                })
            }

            //now, set cooldown
            cooldownAdd(user,cmdName,guild,'oneMin')

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