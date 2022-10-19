import { TextChannel } from "discord.js"

export const fetchMessageWithinChannelById = async (channel: TextChannel, messageId: string) => {

    try {
        const message = await channel.messages.fetch(messageId)
        //@ts-ignore
        if (message.length || message.size) return null
        
        return message
    } 
    catch (e) {
        return null
    }

}