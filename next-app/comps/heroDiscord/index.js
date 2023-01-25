import { useEffect, useRef, useState } from "react";
import {
    DiscordAttachment,
    DiscordAttachments,
    DiscordEmbed,
    DiscordEmbedFooter,
    DiscordEmbedDescription,
    DiscordInvite,
    DiscordMention,
    DiscordMessage,
    DiscordMessages,
    DiscordCommand,
    DiscordReply,
    DiscordEmbedField,
    DiscordEmbedFields,
    DiscordTime,
    DiscordInlineCode,
    DiscordButton,
    DiscordActionRow,
    DiscordSystemMessage,
} from "@skyra/discord-components-react";

export default function Discord(props) {
    const [messages, setMessages] = useState([]);

    // choose a random function to add to the array
    const randomFunction = () => {
        // choose a random number between 1 and 4
        const random = Math.floor(Math.random() * 4) + 1;
        if (random == 0) {
            return 1;
        }
        return random;
    };

    // when the page loads, add a random function to the array
    useEffect(() => {
        setMessages([randomFunction()]);
    }, []);


    return (
        <DiscordMessages style={
            {
                width: '100%',
                borderRadius: '8px',
                background: '#36393E',
                paddingTop: '1rem',
                paddingBottom: '1rem',

            }
        }>
        
            <DiscordSystemMessage type="join">
                A wild <i>Seeds</i> appeared.
            </DiscordSystemMessage>

            <Messages message={messages[0]} stats={props.stats} />

            <DiscordMessage highlight author="Seeds" bot verified avatar="/images/logo.png">
                <DiscordMention>Hey You!</DiscordMention>
                <DiscordEmbed color="#d79a61" embedTitle="Want more?" >
                    <DiscordEmbedDescription slot="description">Invite me to your server today!</DiscordEmbedDescription>
                </DiscordEmbed>
                <DiscordAttachments slot="components">
                    <DiscordActionRow>
                        <DiscordButton type={'primary'} url="https://seedsbot.xyz/invite">Click Here</DiscordButton>
                    </DiscordActionRow>
                </DiscordAttachments>
            </DiscordMessage>


        </DiscordMessages>
    )
    
};

function Messages(props) {

    if (props.message == 1) {
        return (
            <DiscordMessage author="Seeds" bot verified avatar="/images/logo.png">
                <DiscordCommand
                    slot="reply"
                    profile="dickey"
                    command="/stats"
                    avatar="/images/dickey.png"
                    author="dickey"
                ></DiscordCommand>
                <DiscordEmbed
                    slot="embeds"
                    color="#d79a61"
                    embedTitle="Seeds Stats"
                    thumbnail="/images/logo.png"
                >
                    <DiscordEmbedFields slot="fields">
                        <DiscordEmbedField>
                        </DiscordEmbedField>
                        <DiscordEmbedField fieldTitle="Servers:" inline inlineIndex={1}>
                            {" "}
                            {props.stats.guilds}
                            {" "}
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle="CPU%:" inline inlineIndex={2}>
                            {" "}
                            {0.1}
                            {" "}
                        </DiscordEmbedField>
                    
                        <DiscordEmbedField fieldTitle="Mem. %:" inline inlineIndex={3}>
                            {" "}
                            {5.02}
                            {" "}
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle="Ping:" inline inlineIndex={1}>
                            {" "}
                            {'20ms'}
                            {" "}
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle="Uptime:" inline inlineIndex={2}>
                            {" "}
                            {'100%'}
                            {" "}
                        </DiscordEmbedField>

                        <DiscordEmbedField fieldTitle="Library:" inline inlineIndex={3}>
                            {" "}
                            {'Discord.JS'}
                            {" "}
                        </DiscordEmbedField>
                    </DiscordEmbedFields>
                </DiscordEmbed>
            </DiscordMessage>
        )
    } else if ( props.message == 2) {
        return(
            <DiscordMessage author="Seeds" bot verified avatar="/images/logo.png">
                <DiscordCommand
                    slot="reply"
                    profile="dickey"
                    command="/warn"
                    avatar="/images/dickey.png"
                    author="dickey"
                ></DiscordCommand>
                <DiscordEmbed
                    slot="embeds"
                    color="#d79a61"
                    embedTitle="Warned User | Case ID: 21252"
                >
                    <DiscordEmbedDescription slot="description">
                        Warned {" "}
                        <DiscordMention type="user" id="123456789012345678">
                            isaiah
                        </DiscordMention>
                        {" "}
                        with reason 
                        {" "}
                        <DiscordInlineCode>Spamming #general, and being rude to other users</DiscordInlineCode>
                    </DiscordEmbedDescription>

                </DiscordEmbed>
            </DiscordMessage>
        )
    } else if ( props.message == 3 ) {
        return(
            <DiscordMessage author="Seeds" bot verified avatar="/images/logo.png">
                <DiscordCommand
                    slot="reply"
                    profile="dickey"
                    command="/slots"
                    avatar="/images/dickey.png"
                    author="dickey"
                ></DiscordCommand>
                <DiscordEmbed
                    slot="embeds"
                    color="#52b129"
                    embedTitle="Slot Machine"
                >
                    <DiscordEmbedDescription slot="description">
                        - 💵💵🏆 -
                    </DiscordEmbedDescription>

                    <DiscordEmbedFields slot="fields">
                        <DiscordEmbedField fieldTitle="You Won!" inline inlineIndex={1}>
                            {" "}
                            {'Winnings: 1000 Seeds'}
                            {" "}
                        </DiscordEmbedField>
                    </DiscordEmbedFields>

                    <DiscordEmbedFooter slot="footer">
                        {" "}
                        Balance: 1294 Seeds
                        {" "}
                    </DiscordEmbedFooter>

                </DiscordEmbed>
            </DiscordMessage>
        )
    } else if ( props.message == 4 ) {
        return(
            <DiscordMessage author="Seeds" bot verified avatar="/images/logo.png">
                <DiscordCommand
                    slot="reply"
                    profile="dickey"
                    command="/lovetest"
                    avatar="/images/dickey.png"
                    author="dickey"
                ></DiscordCommand>
                <DiscordEmbed
                    slot="embeds"
                    color="#c90076"
                    embedTitle="❤ Love Test ❤ - All the best!"
                    image="/images/discord/lovetest.png"
                >
                    <DiscordEmbedDescription slot="description">
                        {'⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛⬛ - 74%'}
                        {"\n\n"}
                        {'dickey#6969 and isaiah#6969'}
                    </DiscordEmbedDescription>
                    

                </DiscordEmbed>
            </DiscordMessage>
        )
    }
}