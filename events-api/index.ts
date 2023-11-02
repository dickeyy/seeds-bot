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
app.post('/server/update', (context) => ServerEvents.serverUpdateEvent(context))
app.post ('/channel/create', (context) => ServerEvents.channelCreateEvent(context))
app.post('/channel/delete', (context) => ServerEvents.channelDeleteEvent(context))
app.post('/channel/pins/update', (context) => ServerEvents.channelPinsUpdateEvent(context))
app.post('/channel/update', (context) => ServerEvents.channelUpdateEvent(context))
app.post('/emoji/create', (context) => ServerEvents.emojiCreateEvent(context))
app.post('/emoji/delete', (context) => ServerEvents.emojiDeleteEvent(context))
app.post('/emoji/update', (context) => ServerEvents.emojiUpdateEvent(context))
app.post('/event/create', (context) => ServerEvents.eventCreateEvent(context))
app.post('/event/delete', (context) => ServerEvents.eventDeleteEvent(context))
// app.post('/event/update', (context) => ServerEvents.eventUpdateEvent(context)) // delayed
app.post('/invite/create', (context) => ServerEvents.inviteCreateEvent(context))
app.post('/invite/delete', (context) => ServerEvents.inviteDeleteEvent(context))
app.post('/role/create', (context) => ServerEvents.roleCreateEvent(context))
app.post('/role/delete', (context) => ServerEvents.roleDeleteEvent(context))
app.post('/role/update', (context) => ServerEvents.roleUpdateEvent(context))
// app.post('/sticker/create', (context) => ServerEvents.stickerCreateEvent(context))
// app.post('/sticker/delete', (context) => ServerEvents.stickerDeleteEvent(context))
// app.post('/sticker/update', (context) => ServerEvents.stickerUpdateEvent(context))
// app.post('/thread/create', (context) => ServerEvents.threadCreateEvent(context))
// app.post('/thread/delete', (context) => ServerEvents.threadDeleteEvent(context))
// app.post('/thread/update', (context) => ServerEvents.threadUpdateEvent(context))

// member events
app.post('/member/ban', (context) => MemberEvents.memberBanEvent(context))
app.post('/member/unban', (context) => MemberEvents.memberUnbanEvent(context))
app.post('/member/join', (context) => MemberEvents.memberJoinEvent(context))
app.post('/member/leave', (context) => MemberEvents.memberLeaveEvent(context))
app.post('/member/update', (context) => MemberEvents.memberUpdateEvent(context))

// message events
app.post('/message/delete', (context) => MessageEvents.messageDeleteEvent(context))
app.post('/message/update', (context) => MessageEvents.messageUpdateEvent(context))
app.post('/message/bulk/delete', (context) => MessageEvents.messageBulkDeleteEvent(context))

// start the server
app.listen(config.port, () => {
    log.info(`Server is listening on port ${config.port}`)
})