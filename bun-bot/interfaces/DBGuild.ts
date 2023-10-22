// create a new interface
interface DBGuild {
    id: string,
    name: string,
    description?: string,
    member_count: number,
    is_premium: boolean,
    large: boolean,
    vanity_url?: string,
    joined_at: Date,
    owner_id: string,
    shard_id: number,
    banner_url?: string,
    icon?: string,
    max_members: number,
    partnered: boolean,
    afk_channel_id?: string,
    afk_timeout: number,
    mfa_level: number,
    nsfw_level: number,
    preferred_locale: string,
    rules_channel_id?: string,
    system_channel_id?: string,
}

// export the interface
export default DBGuild;