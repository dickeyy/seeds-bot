import { Elysia } from "elysia";
import config from "./config";
import log from "./lib/logger";
import { logger } from '@grotto/logysia';

const app = new Elysia();

// import the events
import * as ServerEvents from "./events/serverEvents";
import * as MemberEvents from "./events/memberEvents";
import * as MessageEvents from "./events/messageEvents";
import verifyToken from "./lib/verifyToken";

// middleware
app.use(logger())

// app.use(verifyToken())

// routes
app.get('/', () => { return 'hi :)' })

// server events
app.post('/server/update',(context) => ServerEvents.serverUpdateEvent(context), { beforeHandle: verifyToken })
app.post ('/channel/create', (context) => ServerEvents.channelCreateEvent(context), { beforeHandle: verifyToken })
app.post('/channel/delete', (context) => ServerEvents.channelDeleteEvent(context), { beforeHandle: verifyToken })
app.post('/channel/pins/update', (context) => ServerEvents.channelPinsUpdateEvent(context), { beforeHandle: verifyToken })
app.post('/channel/update', (context) => ServerEvents.channelUpdateEvent(context), { beforeHandle: verifyToken })
app.post('/emoji/create', (context) => ServerEvents.emojiCreateEvent(context), { beforeHandle: verifyToken })
app.post('/emoji/delete', (context) => ServerEvents.emojiDeleteEvent(context), { beforeHandle: verifyToken })
app.post('/emoji/update', (context) => ServerEvents.emojiUpdateEvent(context), { beforeHandle: verifyToken })
app.post('/event/create', (context) => ServerEvents.eventCreateEvent(context), { beforeHandle: verifyToken })
app.post('/event/delete', (context) => ServerEvents.eventDeleteEvent(context), { beforeHandle: verifyToken })
// app.post('/event/update', (context) => ServerEvents.eventUpdateEvent(context)) // delayed
app.post('/invite/create', (context) => ServerEvents.inviteCreateEvent(context), { beforeHandle: verifyToken })
app.post('/invite/delete', (context) => ServerEvents.inviteDeleteEvent(context), { beforeHandle: verifyToken })
app.post('/role/create', (context) => ServerEvents.roleCreateEvent(context), { beforeHandle: verifyToken })
app.post('/role/delete', (context) => ServerEvents.roleDeleteEvent(context), { beforeHandle: verifyToken })
app.post('/role/update', (context) => ServerEvents.roleUpdateEvent(context), { beforeHandle: verifyToken })
// app.post('/sticker/create', (context) => ServerEvents.stickerCreateEvent(context))
// app.post('/sticker/delete', (context) => ServerEvents.stickerDeleteEvent(context))
// app.post('/sticker/update', (context) => ServerEvents.stickerUpdateEvent(context))
// app.post('/thread/create', (context) => ServerEvents.threadCreateEvent(context))
// app.post('/thread/delete', (context) => ServerEvents.threadDeleteEvent(context))
// app.post('/thread/update', (context) => ServerEvents.threadUpdateEvent(context))

// member events
app.post('/member/ban', (context) => MemberEvents.memberBanEvent(context), { beforeHandle: verifyToken })
app.post('/member/unban', (context) => MemberEvents.memberUnbanEvent(context), { beforeHandle: verifyToken })
app.post('/member/join', (context) => MemberEvents.memberJoinEvent(context), { beforeHandle: verifyToken })
app.post('/member/leave', (context) => MemberEvents.memberLeaveEvent(context), { beforeHandle: verifyToken })
app.post('/member/update', (context) => MemberEvents.memberUpdateEvent(context), { beforeHandle: verifyToken })

// message events
app.post('/message/delete', (context) => MessageEvents.messageDeleteEvent(context), { beforeHandle: verifyToken })
app.post('/message/update', (context) => MessageEvents.messageUpdateEvent(context), { beforeHandle: verifyToken })
app.post('/message/bulk/delete', (context) => MessageEvents.messageBulkDeleteEvent(context), { beforeHandle: verifyToken })

// start the server
app.listen(config.port, () => {
    log.info(`Server is listening on port ${config.port}`)
})