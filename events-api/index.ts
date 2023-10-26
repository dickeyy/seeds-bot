import { Elysia } from "elysia";
import config from "./config";
import log from "./lib/logger";
import { logger } from '@grotto/logysia';

const app = new Elysia();

// import the events
import * as ServerEvents from "./events/serverEvents";
import * as MemberEvents from "./events/memberEvents";
import * as MessageEvents from "./events/messageEvents";

// middleware
app.use(logger())

// routes
app.get('/', () => { return 'hi :)' })

// server events
app.post('/server/create', (context) => ServerEvents.serverCreateEvent(context.body))
app.post('/server/delete', (context) => ServerEvents.serverDeleteEvent(context.body))
app.post('/server/update', (context) => ServerEvents.serverUpdateEvent(context.body))
app.post ('/channel/create', (context) => ServerEvents.channelCreateEvent(context.body))
app.post('/channel/delete', (context) => ServerEvents.channelDeleteEvent(context.body))
app.post('/channel/pins/update', (context) => ServerEvents.channelPinsUpdateEvent(context.body))
app.post('/channel/update', (context) => ServerEvents.channelUpdateEvent(context.body))
app.post('/emoji/create', (context) => ServerEvents.emojiCreateEvent(context.body))
app.post('/emoji/delete', (context) => ServerEvents.emojiDeleteEvent(context.body))
app.post('/emoji/update', (context) => ServerEvents.emojiUpdateEvent(context.body))
app.post('/event/create', (context) => ServerEvents.eventCreateEvent(context.body))
app.post('/event/delete', (context) => ServerEvents.eventDeleteEvent(context.body))
// app.post('/event/update', (context) => ServerEvents.eventUpdateEvent(context.body)) // delayed
app.post('/invite/create', (context) => ServerEvents.inviteCreateEvent(context.body))
app.post('/invite/delete', (context) => ServerEvents.inviteDeleteEvent(context.body))
app.post('/role/create', (context) => ServerEvents.roleCreateEvent(context.body))
app.post('/role/delete', (context) => ServerEvents.roleDeleteEvent(context.body))
app.post('/role/update', (context) => ServerEvents.roleUpdateEvent(context.body))
app.post('/sticker/create', (context) => ServerEvents.stickerCreateEvent(context.body))
app.post('/sticker/delete', (context) => ServerEvents.stickerDeleteEvent(context.body))
app.post('/sticker/update', (context) => ServerEvents.stickerUpdateEvent(context.body))
app.post('/thread/create', (context) => ServerEvents.threadCreateEvent(context.body))
app.post('/thread/delete', (context) => ServerEvents.threadDeleteEvent(context.body))
app.post('/thread/update', (context) => ServerEvents.threadUpdateEvent(context.body))

// member events
app.post('/member/ban', (context) => MemberEvents.memberBanEvent(context.body))
app.post('/member/unban', (context) => MemberEvents.memberUnbanEvent(context.body))
app.post('/member/join', (context) => MemberEvents.memberJoinEvent(context.body))
app.post('/member/leave', (context) => MemberEvents.memberLeaveEvent(context.body))
app.post('/member/update', (context) => MemberEvents.memberUpdateEvent(context.body))

// message events
app.post('/message/delete', (context) => MessageEvents.messageDeleteEvent(context.body))
app.post('/message/update', (context) => MessageEvents.messageUpdateEvent(context.body))
app.post('/message/bulk/delete', (context) => MessageEvents.messageBulkDeleteEvent(context.body))

// start the server
app.listen(config.port, () => {
    log.info(`Server is listening on port ${config.port}`)
})