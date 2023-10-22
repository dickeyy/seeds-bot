// create a new interface
interface Case {
    id: string,
    user_id: string,
    moderator_id: string,
    guild_id: string,
    reason: string,
    type: number,
    created_at?: Date,
}

// export the interface
export default Case;