module.exports = {
    data: {
        name: "dice",
        description: "This is the dice command.",
        type: 1
    },
    async execute(interaction, rest, Routes) {
        var big = Math.floor(Math.random() * 6) + 1;
        const newEmbed69 = {
            title: "You rolled a " + big + "!",
            color: 0x0099ff,
            image: {
                url: "https://cdn2.iconfinder.com/data/icons/dice-roll/100/dice_" + big + "-512.png"
            }
        }
       
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
            body: {
              type: 4,
              data: {
                embeds: [newEmbed69]
              }
            }
          })
    }
}