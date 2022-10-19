import { Category } from "@discordx/utilities"
import { CommandInteraction, SelectMenuInteraction, Role as DRole } from "discord.js"
import { Client, SelectMenuComponent } from "discordx"
import { injectable } from "tsyringe"

import { Discord, Slash } from "@decorators"
import { Disabled, Guard } from "@guards"
import { Role } from "@services"

@Discord()
@Category('Owner')
@Guard(
	Disabled
)
@injectable()
export default class RoleCommand {

	constructor(
		private role: Role
	) {}


	@SelectMenuComponent({ id: 'role-add' })
	async addRoles(interaction: SelectMenuInteraction) {

		this.editRoles('add', interaction)
	}


	@SelectMenuComponent({ id: 'role-remove' })
	async removeRoles(interaction: SelectMenuInteraction) {

		this.editRoles('remove', interaction)
	}


	private async editRoles(type: 'add' | 'remove', interaction: SelectMenuInteraction) {

		const roles = interaction.values
			.map(roleId => interaction.guild?.roles.cache.get(roleId))
			.filter(role => role) as DRole[]
		const member = await interaction.guild?.members.fetch(interaction.user.id)

		await member?.roles[type](roles)

		await interaction.reply({
			content: `Rôles ${type === 'add' ? 'ajoutés' : 'supprimés'}`,
			ephemeral: true
		})

		this.role.updateSelectRoleMessage()
		
	}


	@Slash({
		name: 'role',
	})
	@Guard()
	async updateRoles(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		
		this.role.updateSelectRoleMessage()
	}


}