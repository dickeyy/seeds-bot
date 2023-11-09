// create a new interface
interface Note {
    id: string, 
    user_id: string, 
    moderator_id: string,
    guild_id: string,
    content: string,
    created_at?: Date,
}

// export the interface
export default Note;