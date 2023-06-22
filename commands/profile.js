module.exports = {
    data: {
      "name": "profile",
      "type": 1,
      "description": "View a users GD profile",
      options: [
        {
            type: 3,
            name: "person",
            description: "What profile do you want to view?"
        }
      ]
  },
  execute(interaction, rest, Routes) {
    var pers = interaction?.data?.options?.find(e => e.name == "person")?.value
   async function smt(person) {
        let that = await fetch(`https://gdbrowser.com/api/profile/${person}`)
        let response = await that.text()
        if(response == -1) {
            await interaction.reply("Please send a Valid Player Name / Account ID!")
        } else {
            let player = JSON.parse(response)
                var object = {
                    username: `\`${player.username}\``,
                    ":trophy: GlobalRank": `\`${player.rank}\``,
                    "<:starsss:733834457701679144> stars": `\`${player.stars}\``,
                    ":diamonds: diamonds": `\`${player.diamonds}\``,
                    ":coin: coins": `\`${player.coins}\``,
                    "<:coins:733835003745796116> userCoins": `\`${player.userCoins}\``,
                    "<:hard_demon:733823435532271786> demons": `\`${player.demons}\``,
                    cp: `\`${player.cp}\``,
                    ":people_holding_hands: friendRequests": `\`${player.friendRequests}\``,
                    ":page_facing_up: Allow Messages From": `\`${player.messages}\``,
                    ":page_facing_up: Show Comment History To": `\`${player.commentHistory}\``,
                    "<:moderator:733987971191013396> Moderator Status": `\`${player.moderator}\``,
                    youtube: `[Youtube Link](https://www.youtube.com/channel/${player.youtube})`,
                    twitch: `[Twitch Link](https://twitch.tv/${player.twitch})`,
                    twitter: `[Twitter Link](https://twitter.com/${player.twitter})`,
                    "icon": `[IconURL](https://gdbrowser.com/icon/${player.username}?form=cube)`,
                    ship: `[IconURL](https://gdbrowser.com/icon/${player.username}?form=ship)`,
                    ball: `[IconURL](https://gdbrowser.com/icon/${player.username}?form=ball)`,
                    ufo: `[IconURL](https://gdbrowser.com/icon/${player.username}?form=ufo)`,
                    wave: `[IconURL](https://gdbrowser.com/icon/${player.username}?form=wave)`,
                    robot: `[IconURL](https://gdbrowser.com/icon/${player.username}?form=robot)`,
                    spider: `[IconURL](https://gdbrowser.com/icon/${player.username}?form=spider)`,
                    deathEffect: `[DeathEffectURL](https://gdbrowser.com/assets/deatheffects/${player.deathEffect}.png)`,
                    ":flashlight: glowEnabled": `\`${player.glow}\``
                }
                if(player.friendRequests == "off") {
                    object[":page_facing_up: Allow Messages From"] = "\`No one\`"
                }
                if(player.commentHistory == "off") {
                    object[":page_facing_up: Allow Messages From"] = "\`No one\`"
                }
                if(player.glow == true) {
                    object[":flashlight: glowEnabled"] = "\`This player has glow enabled\`"
                } else {
                    object[":flashlight: glowEnabled"] = "\`This player does not have glow enabled\`"
                }
                if(player.youtube == null) {
                    object["youtube"] = "\`No Youtube Link\`"
                }
                if(player.twitch == null) {
                    object["twitch"] = "\`No Twitch Link\`"
                }
                if(player.twitter == null) {
                    object["twitter"] = "\`No Twitter Link\`"
                }
                if(player.moderator  == 0) {
                    object["<:moderator:733987971191013396> Moderator Status"] = "\`Not a Moderator\`"
                }
                 if(player.moderator  == 1) {
                    object["<:moderator:733987971191013396> Moderator Status"] = "\`Regular Moderator\`"
                }
                 if(player.moderator == 2) {
                    object["<:moderator:733987971191013396> Moderator Status"] = "\`Elder Moderator\`"
                }
                if(player.rank == 0) {
                    object[":trophy: GlobalRank"] = "\`No rank\`"
                }

                if(player.friendRequests == true) {
                    object[":people_holding_hands: friendRequests"] = "\`enabled\`"
                } else {
                    object[":people_holding_hands: friendRequests"] = "\`not enabled\`"
                }

                var txt = ""
                for(const key in object) {
                    txt += `**${key}**\n${object[key]}\n`
                }
                var embed = {
                    author: {
                        name: player.username, 
                        icon_url: `https://gdbrowser.com/icon/${player.username}?form=cube)`
                    }, 
                    description: txt,
                    thumbnail: {
                        url: `https://gdbrowser.com/icon/${player.username}?form=cube`
                    },
                    footer: {
                        text: `playerID: ${player.playerID} | accountID: ${player.accountID}`
                    }
                }
                await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                    body: {
                      type: 4,
                      data: {
                        embeds: [embed]
                      }
                    }
                  })
            }
    }

    if(!pers) {
        smt("Robtop")
    } else if(pers) {
        smt(pers)
    }
}
    }