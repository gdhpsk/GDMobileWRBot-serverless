module.exports = {
    data: {
      "name": "meme",
      "type": 1,
      "description": "The meme command",
  },
  async execute(interaction, rest, Routes) {
    if(interaction.channel_id == "844105678243102740" || !interaction.guild_id) {
        const embed = {}
        fetch('https://www.reddit.com/r/memes/random/.json').then(async response => {
            let content = await response.json()
            let permalink = content[0].data.children[0].data.permalink;
            let memeUrl = `https://reddit.com${permalink}`;
            let memeImage = content[0].data.children[0].data.url;
            let memeTitle = content[0].data.children[0].data.title;
            let memeUpvotes = content[0].data.children[0].data.ups;
            let memeNumComments = content[0].data.children[0].data.num_comments;
            embed.title = `${memeTitle}`
            embed.url = `${memeUrl}`
            embed.image = {url: memeImage}
            embed.footer = {text: `👍 ${memeUpvotes} | 💬 ${memeNumComments}`}
            await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                body: {
                  type: 4,
                  data: {
                    embeds: [embed]
                  }
                }
              })
        })
    } else {
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
            body: {
              type: 4,
              data: {
                content: "Go in <#844105678243102740> or direct messages to use this command!"
              }
            }
          })
    }
}
    }