const { cmdRun } = require('../../../functions/cmdRun.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const mainHex = '#d79a61'

exports.tictactoeCmd = async function tictactoeCmd(user,guild,interaction,member) {
    const cmdName = 'tictactoe'

    let turn = 0
    let board = [' ',' ',' ',' ',' ',' ',' ',' ',' ']
    let guildId = guild.id
    let gameOver = false
    let winner = null
    let gameId = `${guildId}+${user.id}+${member.id}`

    const errorEmbed = new MessageEmbed()
    .setColor('RED')
    .setTitle('Error')

    // check if the member = user
    if (member.id === user.id) {
        errorEmbed.setDescription('You can\'t play against yourself')
        return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true
        })
    }

    // check if the member is a bot
    if (member.bot) {
        errorEmbed.setDescription('You can\'t play against a bot')
        return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true
        })
    }

    let initialComponents = [
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
            .setLabel(board[0])
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
            .setLabel(board[1])
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
            .setLabel(board[2])
            .setStyle('SECONDARY')
        ),
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
            .setLabel(board[3])
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
            .setLabel(board[4])
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
            .setLabel(board[5])
            .setStyle('SECONDARY'),
        ),
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
            .setLabel(board[6])
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
            .setLabel(board[7])
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
            .setLabel(board[8])
            .setStyle('SECONDARY'),
        )
    ]    

    
    interaction.reply({ 
        content: `**${user.username} vs ${member.username}**\n\n<@${user.id}>'s turn\n*You have 60 seconds*` , 
        components: initialComponents 
    })

    const filter = i => i.customId.startsWith(`${guildId}-${gameId}-ttt-`) && i.user.id === user.id || i.user.id === member.id
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 })

    collector.on('collect', async i => {

        let buttonId = i.customId.split('-')
        let buttonRow = buttonId[3]
        let buttonCol = buttonId[4]
        let buttonIndex = (buttonRow - 1) * 3 + (buttonCol - 1)

        if (turn % 2 === 0) {
            // it is user 1's turn
            if (i.user.id === user.id) {
                // User 1 clicked
                if (board[buttonIndex] === ' ') {

                    board[buttonIndex] = 'X'

                    let newComponents = []

                    // Check for win
                    if (board[0] === 'X' && board[1] === 'X' && board[2] === 'X') {
                        gameOver = true
                        winner = user

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('PRIMARY')
                                .setDisabled(true)
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]
                    } else if (board[3] === 'X' && board[4] === 'X' && board[5] === 'X') {
                        gameOver = true
                        winner = user

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true)
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]
                    } else if (board[6] === 'X' && board[7] === 'X' && board[8] === 'X') {
                        gameOver = true
                        winner = user

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true)
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            )
                        ]
                    } else if (board[0] === 'X' && board[3] === 'X' && board[6] === 'X') {
                        gameOver = true
                        winner = user

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true)
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]
                    } else if (board[1] === 'X' && board[4] === 'X' && board[7] === 'X') {
                        gameOver = true
                        winner = user

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true)
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]
                    } else if (board[2] === 'X' && board[5] === 'X' && board[8] === 'X') {
                        gameOver = true
                        winner = user

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('PRIMARY')
                                .setDisabled(true)
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            )
                        ]
                    } else if (board[0] === 'X' && board[4] === 'X' && board[8] === 'X') {
                        gameOver = true
                        winner = user

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true)
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            )
                        ]
                    } else if (board[2] === 'X' && board[4] === 'X' && board[6] === 'X') {
                        gameOver = true
                        winner = user

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('PRIMARY')
                                .setDisabled(true)
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),

                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()

                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]
                    }

                    if (!gameOver) {
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY'),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY'),
                            )
                        ]
                    } 

                    if (!gameOver) {
                        await i.update({ components: newComponents, content: `**${user.username} vs ${member.username}**\n\n<@${member.id}>'s turn\n*You have 60 seconds*` })
                    } else {
                        await i.update({ components: newComponents, content: `**${user.username} vs ${member.username}**\n\n<@${winner.id}> won!` })
                    }

                    turn++
                } else {
                    await i.reply({ content: 'That is not an empty space', ephemeral: true })
                }

            } else {
                // User 2 clicked
                await i.reply({ content: 'It is not your turn!', ephemeral: true })
            }
        } else {
            // it is user 2's turn
            if (i.user.id === user.id) {
                // User 1 clicked

                await i.reply({ content: 'It is not your turn!', ephemeral: true })

            } else {
                // User 2 clicked
                if (board[buttonIndex] === ' ') {
                
                    board[buttonIndex] = 'O'

                    let newComponents = []

                    // Check for win
                    if (board[0] === 'O' && board[1] === 'O' && board[2] === 'O') {
                        gameOver = true
                        winner = member

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]

                    } else if (board[3] === 'O' && board[4] === 'O' && board[5] === 'O') {
                        gameOver = true
                        winner = member

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]
                    } else if (board[6] === 'O' && board[7] === 'O' && board[8] === 'O') {
                        gameOver = true
                        winner = member

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            )
                        ]

                    } else if (board[0] === 'O' && board[3] === 'O' && board[6] === 'O') {
                        gameOver = true
                        winner = member

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]

                    } else if (board[1] === 'O' && board[4] === 'O' && board[7] === 'O') {
                        gameOver = true
                        winner = member

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]

                    } else if (board[2] === 'O' && board[5] === 'O' && board[8] === 'O') {
                        gameOver = true
                        winner = member

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            )
                        ]

                    } else if (board[0] === 'O' && board[4] === 'O' && board[8] === 'O') {
                        gameOver = true
                        winner = member

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            )
                        ]

                    } else if (board[2] === 'O' && board[4] === 'O' && board[6] === 'O') {
                        gameOver = true
                        winner = member

                        // set the winning buttons to primary
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY')
                                .setDisabled(true),
                            )
                        ]
                    }

                    if (!gameOver) {
                        newComponents = [
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                                .setLabel(board[0])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                                .setLabel(board[1])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                                .setLabel(board[2])
                                .setStyle('SECONDARY')
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                                .setLabel(board[3])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                                .setLabel(board[4])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                                .setLabel(board[5])
                                .setStyle('SECONDARY'),
                            ),
                            new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                                .setLabel(board[6])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                                .setLabel(board[7])
                                .setStyle('SECONDARY'),
                                new MessageButton()
                                .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                                .setLabel(board[8])
                                .setStyle('SECONDARY'),
                            )
                        ]
                    }

                    if (!gameOver) {
                        await i.update({ components: newComponents, content: `**${user.username} vs ${member.username}**\n\n<@${user.id}>'s turn\n*You have 60 seconds*` })
                    } else {
                        await i.update({ components: newComponents, content: `**${user.username} vs ${member.username}**\n\n<@${winner.id}> won!` })
                    }

                    turn++
                } else {
                    await i.reply({ content: 'That is not an empty space', ephemeral: true })
                }

            }

        }

        if (turn == 9 && !gameOver) {
            gameOver = true

            newComponents = [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`${guildId}-${gameId}-ttt-1-1`)
                    .setLabel(board[0])
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                    new MessageButton()
                    .setCustomId(`${guildId}-${gameId}-ttt-1-2`)
                    .setLabel(board[1])
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                    new MessageButton()
                    .setCustomId(`${guildId}-${gameId}-ttt-1-3`)
                    .setLabel(board[2])
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                ),
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`${guildId}-${gameId}-ttt-2-1`)
                    .setLabel(board[3])

                    .setStyle('SECONDARY')
                    .setDisabled(true),
                    new MessageButton()

                    .setCustomId(`${guildId}-${gameId}-ttt-2-2`)
                    .setLabel(board[4])
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                    new MessageButton()
                    .setCustomId(`${guildId}-${gameId}-ttt-2-3`)
                    .setLabel(board[5])
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                ),
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(`${guildId}-${gameId}-ttt-3-1`)
                    .setLabel(board[6])
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                    new MessageButton()
                    .setCustomId(`${guildId}-${gameId}-ttt-3-2`)
                    .setLabel(board[7])
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                    new MessageButton()
                    .setCustomId(`${guildId}-${gameId}-ttt-3-3`)
                    .setLabel(board[8])
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                )
            ]

            await i.editReply({ content: `**${user.username} vs ${member.username}**\n\nIt's a tie!`, components: newComponents })
        }

        if (gameOver) {
            collector.stop()
        }

    })

    collector.on('end', collected => {
        // edit the original message to say that the game has ended
        if (!gameOver) {
            interaction.editReply({
                content: `**${user.username} vs ${member.username}**\n\nRan out of time!`,
                components: []
            })
        }
    });

    cmdRun(user,cmdName,guild,interaction)
}   

// this function looks fucking awful but it works, so i'm not gonna touch it