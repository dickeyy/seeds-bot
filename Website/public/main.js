import { app } from "./app.js";

// File name stuff
const filePath = window.location.pathname;
const fileExtension = filePath.split("/").pop();
const pageName = fileExtension.split('.')[0]

if (pageName == 'invite') {
    window.location.replace('https://discord.com/api/oauth2/authorize?client_id=968198214450831370&permissions=1617004133494&scope=bot%20applications.commands')
}

if (pageName == 'support') {
    window.location.replace('https://discord.gg/AU3t2yVBBe')
}

if (pageName == 'server') {
    window.location.replace('https://discord.gg/AU3t2yVBBe')
}