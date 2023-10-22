import { Embed, EmbedBuilder } from "discord.js";

export default function embedBuilder(data:Embed) {
    const embed = new EmbedBuilder();

    if (data.title) embed.setTitle(data.title);
    if (data.description) embed.setDescription(data.description);
    if (data.color) embed.setColor(data.color);
    if (data.author) embed.setAuthor(data.author);
    if (data.fields) embed.setFields(data.fields);
    if (data.image) embed.setImage(data.image as unknown as string || null);
    if (data.footer) embed.setFooter(data.footer);
    if (data.timestamp) embed.setTimestamp(data.timestamp as unknown as Date || null);
    if (data.thumbnail) embed.setThumbnail(data.thumbnail as unknown as string || null);
    if (data.url) embed.setURL(data.url as unknown as string || null);
    
    return embed;
}