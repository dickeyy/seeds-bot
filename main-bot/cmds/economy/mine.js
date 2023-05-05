const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder } = require('discord.js');
const { db } = require('../../index.js')

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


exports.mineCmd = async function mineCmd(user, guild, interaction) {

    const cmdName = 'mine'

    if (cooldown.has(user.id + '--' + cmdName)) {
        const embed = new EmbedBuilder()

        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every two minutes')
        .setColor('Red')
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    const coll = db.collection('economy')
    const doc = await coll.findOne({ userId: user.id, guildId: guild.id })

    // Check if user is in econ database
    if (doc == null) {
        const embed = new EmbedBuilder()
        .setTitle('ERROR: You don\'t have any coins, use `\`/daily`\` to get some')
        .setDescription('Please run the command again')
        .setColor('Red')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        
        return
    }

    const pickaxe = doc.i_2 || doc.i_3 || doc.i_4 || doc.i_5 || doc.i_6

    // check if user has a pickaxe
    if (pickaxe == null) {
        const embed = new EmbedBuilder()
        .setTitle('ERROR: You don\'t have a pickaxe')
        .setDescription('Use `\`/shop`\` to get one')
        .setColor('Red')

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    // check if pickaxe is broken
    if (pickaxe.durability <= 0) {
        const embed = new EmbedBuilder()
        .setTitle('Your pickaxe is broken')
        .setDescription('Buy a new one using `\`/shop`\`')
        .setColor('Red')

        await coll.updateOne({ userId: user.id, guildId: guild.id }, { $set: { i_2: null, i_3: null, i_4: null, i_5: null, i_6: null } })

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return
    }

    //if good then mine
    const rng = Math.round(Math.random() * 300)

    const blocksDoc = await coll.findOne({ shop: true })
    const blocks = blocksDoc.mine

    const embed = new EmbedBuilder()

    if (rng == 1) { // One Percent for lava
        const block = blocks.m13

        const newBalance = doc.coins - block.price
        const newDurability = pickaxe.durability - block.damage

        const lavaEmbed = new EmbedBuilder()
        .setTitle('You fell into lava')
        .setDescription('You lost **' + block.price + ' Coins**')
        .setFooter({ text: 'Balance: ' + newBalance })
        .setColor('Red')

        await coll.updateOne({ userId: user.id, guildId: guild.id }, { $set: { i_2: { name: pickaxe.name, durability: newDurability }, coins: newBalance } })

        interaction.reply({
            embeds: [lavaEmbed]
        })
    } 

    // Set percents for everything 
    else if (rng <= 2 && rng > 1) { var block = blocks.m10 } // 1% for Rare Crystal
    else if (rng <= 7 && rng > 2) { var block = blocks.m9 } // 5% for Diamond
    else if (rng <= 14 && rng > 7) { var block = blocks.m8 } // 7% for Emerald
    else if (rng <= 22 && rng > 14) { var block = blocks.m5 } // 8% for Gold
    else if (rng <= 31 && rng > 22) { var block = blocks.m7 } // 9% for Silver
    else if (rng <= 41 && rng > 31) { var block = blocks.m6 } // 10% for Copper
    else if (rng <= 52 && rng > 41) { var block = blocks.m11 } // 11% for Obsidian
    else if (rng <= 67 && rng > 52) { var block = blocks.m12 } // 15% for Iron
    else if (rng <= 100 && rng > 67) { var block = blocks.m3 } // 33% for Stone
    else if (rng <= 200 && rng > 100) { var block = blocks.m1 } // 50% for Dirt
    else if (rng <= 300 && rng > 200) { var block = blocks.m2 } // 50% for Gravel

    if (block.name == 'Rare Crystal') { embed.setColor('Gold') }
    else { embed.setColor(mainHex) }

    const newBalance = Number(doc.coins) + Number(block.price)
    const newDurability = pickaxe.durability - block.damage

    embed.setTitle(`You mined ${block.name}`)
    embed.setDescription(`You earned **${block.price} Coins**`)
    embed.setFooter({ text: 'Balance: ' + newBalance })

    await coll.updateOne({ userId: user.id, guildId: guild.id }, { $set: { i_2: { name: pickaxe.name, durability: newDurability }, coins: newBalance } })

    interaction.reply({
        embeds: [embed]
    })

    cooldown.add(user.id + '--' + cmdName);
    setTimeout(() => {
        cooldown.delete(user.id + '--' + cmdName);
    }, twoMinCooldown);

    cmdRun(user,cmdName,guild,interaction)

}