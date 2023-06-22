module.exports = {
    data: {
      "name": "coinflip",
      "type": 1,
      "description": "The coinflip command"
  },
  async execute(interaction, rest, Routes) {
    //if(interaction.channel.id != "871960335773483128" && interaction.channel.type != "DM") return interaction.reply("Please use this command in <#871960335773483128> or dms!")
    const random_hex_color_code = () => {
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return "0x" + n.slice(0, 6)
      };
    var big = Math.floor(Math.random() * 100000) / 1000;
    function trole() {
        if(big < 50) {
            return "Heads"
        } else if(big > 50){
            return "Tails"
        } else if(big == 50) {
            return "Middle"
        }
    }
    function troled() {
        if(big < 50) {
            return "https://images-na.ssl-images-amazon.com/images/I/51xs7F%2BtP5L._AC_.jpg"
        } else if(big > 50){
            return "https://images-na.ssl-images-amazon.com/images/I/51NyMaKLydL._AC_.jpg"
        } else if(big == 50) {
            return "https://pbs.twimg.com/media/EcWWl6RWsAEFxxF.jpg"
        }
    }
    var randomcolor = random_hex_color_code()
const newEmbed67 = {
    title: trole(),
    color: parseInt(randomcolor),
    author: {
        name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
        icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024`
    },
    footer: {
        text: `Hexcolor: ${randomcolor.replace("0x", "#")}
Variable number: ${big}`
    },
    image: {
        url: troled()
    }
}
//     const newEmbed67 = new EmbedBuilder()
//     .setTitle(trole())
//     .setColor([big1, big2, big3])
//     .setAuthor({name: interaction.interaction.member.usertag, iconURL: interaction.interaction.member.useravatarURL({dynamic: true})})
//     .setFooter({text: `Hexcolor: ${rgbToHex(big1, big2, big3)} 
// Variable number: ${big}`})
//     .setImage(troled())
await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
    body: {
      type: 4,
      data: {
        embeds: [newEmbed67]
      }
    }
  })
    if(big == 50) {
        if(!interaction.guild_id) { 
            await rest.post(Routes.webhook(interaction.application_id, interaction.token), {
                body: {
                    content: "Ask an admin to add your role!"
                }
              })
        } else {
            await rest.put(Routes.guildMemberRole("530041360443506698", interaction.member.user.id, "871913804601110618"))
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
            body: {
              type: 4,
              data: {
                content: "<@560266267081310208> <@703364595321929730>"
              }
            }
          })
    }
    }
}
    }