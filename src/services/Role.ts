import { singleton } from "tsyringe"

import { rolesConfig } from "@config"
import { fetchMessageWithinChannelById } from "@utils/functions"
import { ActionRowBuilder, SelectMenuBuilder, SelectMenuComponentOptionData, TextChannel } from "discord.js"
import { Client } from "discordx"

@singleton()
export class Role {

    private rolesChannelId = '716641518714355722'
    private messageId = '1032011908783538197'

    constructor(
        private client: Client,
    ) {}

    async updateSelectRoleMessage() {

        const guild = await this.client.guilds.fetch(process.env['TEST_GUILD_ID'])

        const channel = await guild.channels.fetch(this.rolesChannelId)
		if (!channel) return false

		const rolesOption: Array<SelectMenuComponentOptionData> = rolesConfig.roles.map(role => ({
			label: role.name,
			value: role.roleId,
			description: role?.description,
			emoji: role?.icon,
		}))

		const addRolesRow = new ActionRowBuilder<SelectMenuBuilder>()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('role-add')
					.setPlaceholder('Ajouter des rôles')
					.setMinValues(1)
					.setMaxValues(rolesOption.length)
					.addOptions(
						rolesOption
					)
			)

		const removeRolesRow = new ActionRowBuilder<SelectMenuBuilder>()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('role-remove')
					.setPlaceholder('Supprimer des rôles')
					.setMinValues(1)
					.setMaxValues(rolesOption.length)
					.addOptions(
						rolesOption
					)
			)


        const message = await fetchMessageWithinChannelById(
			channel as TextChannel,
			this.messageId
		)

        if (message) {

			console.log(message)

			console.info('Message found, editing it')

			await message.edit({
				content: rolesConfig.content,
				components: [
					addRolesRow,
					removeRolesRow
				]
			})

		} else {
			
			const msg = await (channel as TextChannel).send({
				content: rolesConfig.content,
				components: [
					addRolesRow,
					removeRolesRow
				]
			})

			console.warn('Message not found, create new with id: ', msg.id)

		}

        return true
    }

}