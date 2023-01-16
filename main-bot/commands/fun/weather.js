const { cmdRun } = require('../../functions/cmdRun.js')
const { MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const mainHex = '#d79a61'

exports.weatherCmd = async function weatherCmd(user,guild,interaction,location) {
    const cmdName = 'weather'

    const data = await axios({
        method: 'get',
        url: 'https://weatherapi-com.p.rapidapi.com/current.json',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        },
        params: {
            q: location
        },
        responseType: 'json'
    })

    const res = data['data']
    const locationName = res['location']['name']
    const locationRegion = res['location']['region']
    const locationCountry = res['location']['country']
    const tempC = res['current']['temp_c']
    const tempF = res['current']['temp_f']
    const conditionText = res['current']['condition']['text']
    const conditionIcon = res['current']['condition']['icon']
    const windMph = res['current']['wind_mph']
    const windKph = res['current']['wind_kph']
    const windDir = res['current']['wind_dir']
    const humidity = res['current']['humidity']
    const cloud = res['current']['cloud']
    const feelslikeC = res['current']['feelslike_c']
    const feelslikeF = res['current']['feelslike_f']
    const visibilityKm = res['current']['vis_km']
    const visibilityMiles = res['current']['vis_miles']
    const uv = res['current']['uv']
    const gustMph = res['current']['gust_mph']
    const gustKph = res['current']['gust_kph']
    
    const embed = new MessageEmbed()
    .setTitle(`Weather for ${locationName}, ${locationRegion}, ${locationCountry}`)
    .setFields(
        {
            name: 'Temp',
            value: `${tempC}°C / ${tempF}°F`,
            inline: true
        }, 
        {
            name: 'Condition',
            value: conditionText,
            inline: true
        }, 
        {
            name: 'Wind',
            value: `${windMph}kph / ${windKph}mph ${windDir}`,
            inline: true
        }, 
        {
            name: 'Feels Like',
            value: `${feelslikeC}°C / ${feelslikeF}°F`,
            inline: true
        }, 
        {
            name: 'Humidity',
            value: `${humidity}%`,
            inline: true
        }, 
        {
            name: 'Cloud Cov.',
            value: `${cloud}%`,
            inline: true
        }, 
        {
            name: 'Visibility',
            value: `${visibilityKm}km / ${visibilityMiles}miles`,
            inline: true
        },
        {
            name: 'UV',
            value: `${uv}`,
            inline: true
        },
        {
            name: 'Gust',
            value: `${gustKph}kph / ${gustMph}mph`,
            inline: true
        }
    )
    .setThumbnail(`https:${conditionIcon}`)
    .setFooter({text: user.tag, iconURL: user.avatarURL()})
    .setTimestamp()
    .setColor('BLUE')

    interaction.reply({embeds: [embed]})

    cmdRun(user,cmdName,guild,interaction)
}