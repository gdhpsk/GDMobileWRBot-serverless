const country_code = require("../JSON/country_codes.json")

const lowercaseKeys = obj =>
    Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key];
        return acc;
    }, {});

let {leaderboardSchema, levelsSchema} = require("../mongodb")


module.exports = {
    data: {
        "name": "leaderboard",
        "type": 1,
        "description": "This is the leaderboard command",
        options: [
            {
                type: 5,
                name: "bywrs",
                description: "Should players be ranked by their WRs or by their points?",
                required: false
            },
            {
                type: 3,
                name: "profile",
                description: "What profile do you want me to display? not case-sensitive",
                required: false
            }
        ]
    },
    cooldown: require("../cooldowns.json").leaderboard,
    async execute(interaction, rest, Routes, events) {
        await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
            body: {
                type: 5
            }
        })
        let alldatalead = await leaderboardSchema.find()
        let alldatalevel = await levelsSchema.find()
        alldatalevel.sort((a, b) => a.position - b.position)
        let leaderboard = alldatalead.reduce(function (acc, cur, i) {
            acc[alldatalead[i].name] = cur;
            return acc;
        }, {})
        function check_if_marked(type) {
            if (type.deleted) {
                return true
            } else {
                return false
            }
        }
        let rank = require("../leaderboard_command_placements.js")(leaderboard, interaction.data?.options?.find(e => e.name == "bywrs")?.value)
        let list = Object.values(alldatalevel.reduce(function (acc, cur, i) {
            acc[alldatalevel[i].name] = cur;
            return acc;
        }, {}))

        let gay = ""
        let array = []
        let array2 = []
        let array3 = []
        let array4 = []
        var array10 = []
        let leaderboardrank = 0
        let points = 0
        let recordcount = 0
        var generated_or_nah = false

        async function tehe() {
            for (let i = 0; i < rank.length; i++) {
                if (rank[i].name == gay) {
                    leaderboardrank = i + 1
                    break;
                } else {
                    continue;
                }
            }
            let txt1 = `**LEADERBOARD RANK:** ${leaderboardrank}`
            let player = leaderboard[gay]
            if (player.nationality) {
                let nation = player.nationality.replace(/_/g, " ")
                txt1 += `\n\n**NATIONALITY:** ${nation} :flag_${lowercaseKeys(country_code)[player.nationality.toLowerCase()]}:`
            }
            txt1 += `\n\n**RECORDS**\n\n`
            if (player.records[0] == "none") {
                txt1 += "none\n"
            } else {
                for (let i = 0; i < player.records.length; i++) {
                    let number = 0
                    let records = player.records[i]
                    for (let j = 0; j < list.length; j++) {
                        if (records.name == list[j].name) {
                            number = j + 1
                            break;
                        } else {
                            if (j != list.length - 1) {
                                continue;
                            } else {
                                number = 0
                                break;
                            }
                        }
                    }
                    let txt = ["", ""]
                    if (records.verification) {
                        txt[0] = "[V] "
                    }
                    if (check_if_marked(records)) {
                        txt[1] = " (deleted)"
                    }
                    let object = {
                        name: records.name,
                        percent: `${records.percent}%`,
                        hertz: `${records.hertz}hz`,
                        pos: number,
                        marked: txt[1],
                        verifier: txt[0]
                    }
                    array.push(object)
                }
                array.sort((a, b) => a.pos - b.pos)

                for (let i = 0; i < player.records.length; i++) {
                    let records = array[i]
                    txt1 += `${i + 1}.${records.marked} ${records.verifier}${records.name} ${records.percent} (#${records.pos}, ${records.hertz})\n`
                    points += 1
                    recordcount += 1
                }
            }
            txt1 += `\n**COMPLETIONS**\n\n`
            if (player.completions[0] == "none") {
                txt1 += "none\n"
            } else {
                for (let i = 0; i < player.completions.length; i++) {
                    let number = 0
                    let records = player.completions[i]
                    for (let j = 0; j < list.length; j++) {
                        if (records.name == list[j].name) {
                            number = j + 1
                            break;
                        } else {
                            if (j != list.length - 1) {
                                continue;
                            } else {
                                number = 0
                                break;
                            }
                        }
                    }
                    let txt = ["", ""]
                    if (records.verification) {
                        txt[0] = "[V] "
                    }
                    if (check_if_marked(records)) {
                        txt[1] = " (deleted)"
                    }
                    let object = {
                        name: records.name,
                        hertz: `${records.hertz}hz`,
                        pos: number,
                        marked: txt[1],
                        verifier: txt[0]
                    }
                    array2.push(object)
                }
                array2.sort((a, b) => a.pos - b.pos)

                for (let i = 0; i < player.completions.length; i++) {
                    let completions = array2[i]
                    txt1 += `${i + 1}.${completions.marked} ${completions.verifier}${completions.name} 100% (#${completions.pos}, ${completions.hertz})\n`
                    points += 2
                    recordcount += 1
                }
            }
            txt1 += "\n**EXTRA LIST RECORDS/COMPLETIONS**\n\n"
            if (player.extralist[0] == "none") {
                txt1 += "none\n"
            } else {
                for (let i = 0; i < player.extralist.length; i++) {
                    let number = 0
                    let records = player.extralist[i]
                    for (let j = 0; j < list.length; j++) {
                        if (records.name == list[j].name) {
                            number = j + 1
                            break;
                        } else {
                            if (j != list.length - 1) {
                                continue;
                            } else {
                                number = 0
                                break;
                            }
                        }
                    }
                    let txt = ["", ""]
                    if (records.verification) {
                        txt[0] = "[V] "
                    }
                    if (check_if_marked(records)) {
                        txt[1] = " (deleted)"
                    }
                    let object = {
                        name: records.name,
                        percent: `${records.percent}%`,
                        hertz: `${records.hertz}hz`,
                        pos: number,
                        marked: txt[1],
                        verifier: txt[0]
                    }
                    array3.push(object)
                }
                array3.sort((a, b) => a.pos - b.pos)

                for (let i = 0; i < player.extralist.length; i++) {
                    let extralist = array3[i]
                    txt1 += `${i + 1}.${extralist.marked} ${extralist.verifier}${extralist.name} ${extralist.percent} (${extralist.hertz})\n`
                    recordcount += 1
                    if (player.extralist[i].percent == 100) {
                        points += 1
                    }
                }
            }
            txt1 += `\n**SCREENSHOT RECORDS/COMPLETIONS**\n\n`
            if (player.screenshot[0] == "none") {
                txt1 += "none\n"
            } else {
                for (let i = 0; i < player.screenshot.length; i++) {
                    let number = 0
                    let records = player.screenshot[i]
                    for (let j = 0; j < list.length; j++) {
                        if (records.name == list[j].name) {
                            number = j + 1
                            break;
                        } else {
                            if (j != list.length - 1) {
                                continue;
                            } else {
                                number = 0
                                break;
                            }
                        }
                    }
                    let txt = ["", ""]
                    if (records.verification) {
                        txt[0] = "[V] "
                    }
                    if (check_if_marked(records)) {
                        txt[1] = " (deleted)"
                    }
                    let object = {
                        name: records.name,
                        percent: `${records.percent}%`,
                        hertz: `${records.hertz}hz`,
                        pos: number,
                        marked: txt[1],
                        verifier: txt[0]
                    }
                    array4.push(object)
                }
                array4.sort((a, b) => a.pos - b.pos)

                for (let i = 0; i < player.screenshot.length; i++) {
                    let screenshot = array4[i]
                    let txt = [`#${screenshot.pos}, `]
                    if (screenshot.pos > 150) {
                        txt[0] = ""
                    }
                    txt1 += `${i + 1}.${screenshot.marked} ${screenshot.verifier}${screenshot.name} ${screenshot.percent} (${txt[0]}${screenshot.hertz})\n`
                    recordcount += 1
                }
            }
            txt1 += `\n**SOCIALS**\n\n`
            if (!player.socials) {
                txt1 += "none"
            } else {
                for (let i = 0; i < player.socials.length; i++) {
                    let socials = player.socials[i]
                    let txt = [``, `Youtube Channel: ${socials.youtube}\n`,
                        `Twitch Channel: ${socials.twitch}\n`, `Twitter Link: ${socials.twitter}\n`]
                    if (!socials.discord) {
                        txt[0] = ``
                    } else {
                        txt[0] = `Discord tag: ${socials.discord[0]}\n`
                        if (socials.discord[1]) {
                            txt[0] = `Discord tag: ${socials.discord[0]}\nDiscord Server: ${socials.discord[1]}\n`
                        }
                    }
                    if (!socials.youtube) {
                        txt[1] = ``
                    }
                    if (!socials.twitch) {
                        txt[2] = ``
                    }
                    if (!socials.twitter) {
                        txt[3] = ``
                    }
                    let socialslist = {
                        youtube: `${txt[1]}`,
                        twitch: `${txt[2]}`,
                        twitter: `${txt[3]}`,
                        discordss: `${txt[0]}`
                    }

                    txt1 += `${socialslist.discordss}${socialslist.youtube}${socialslist.twitter}${socialslist.twitch}`
                }
            }
            if (player.minus) {
                points -= player.minus
            }
            for (const thing in player) {
                if (typeof player[thing] == "object") {
                    if (thing == "extralist") {
                        points -= player[thing].filter(e => e.deleted && e.percent == 100).length
                    }
                    if (thing == "records") {
                        points -= player[thing].filter(e => e.deleted).length
                    }
                    if (thing == "completions") {
                        points -= player[thing].filter(e => e.deleted).length * 2
                    }
                }
            }
            let jkss = 's'
            if (recordcount == 1) {
                jkss = ""
            }
            let embed = {
                title: `${gay}'s profile (${points} pts/${recordcount} WR${jkss})`,
                description: `${txt1}`,
                author: { name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024` }
            }
            //     .setTitle(`${gay}'s profile (${points} pts/${recordcount} WR${jkss})`)
            //     .setDescription(`${txt1}`)
            //     .setAuthor({name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.gif?size=1024`})
            if (generated_or_nah) {
                embed.footer = { text: "This profile was generated!" }
            }
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                        embeds: [
                            embed
                        ]
                }
            })
        }
        let moreargs = interaction.data?.options?.find(e => e.name == "profile")?.value
        if (moreargs) {
            moreargs = interaction.data?.options.find(e => e.name == "profile")?.value?.toLowerCase()
            if (moreargs == "generate") {
                let random = Math.floor(Math.random() * (Object.keys(leaderboard).length - 1))
                gay = Object.keys(leaderboard)[random]
                generated_or_nah = true
                tehe()
            } else if (moreargs == "me") {
                var array98 = []
                for (let i = 0; i < Object.keys(leaderboard).length; i++) {
                    if (Object.values(leaderboard)[i].socials) {
                        if (Object.values(leaderboard)[i].socials[0].discord) {
                            if (Object.values(leaderboard)[i].socials[0].discord[0] == `${interaction.member.user.username}#${interaction.member.user.discriminator}`) {
                                gay = Object.keys(leaderboard)[i]
                                tehe()
                                break;
                            } else {
                                if (i != Object.keys(leaderboard).length - 1) {
                                    continue;
                                }
                            }
                        }
                    }
                }
            } else {
                if (lowercaseKeys(leaderboard)[moreargs]) {
                    gay =alldatalead[alldatalead.findIndex(e => e.name.toLowerCase() == moreargs)].name
                    tehe()
                } else {

                    var fk = moreargs
                    if (moreargs.length > 30) {
                        fk = `${moreargs.slice(0, 30)}...`
                    }
                    var em = {
                        title: `${fk}'s profile (1 pts/1 WR)`,
                        description: `Unfortunately, our server could not find the profile you were looking for <:sadsphere:839693880370528256>. Please try again.`,
                        author: { name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.member.user.avatar ? `${interaction.member.user.id}/${interaction.member.user.avatar}${interaction.member.user.avatar.startsWith("a_") ? ".gif" : ".png"}` : `${parseInt(interaction.member.user.discriminator) % 5}.png`}?size=1024`}
                    }
                    await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                        body: {
                                embeds: [
                                    em
                                ]
                        }
                    })
                }
            }
        } else if (!moreargs) {
            var fr = ""
            let page = 10
            for (let i = 0; i < Math.floor((Object.keys(leaderboard).length / page)); i++) {
                var addition = 0
                if (!Number.isInteger(Object.keys(leaderboard).length / page)) {
                    addition = 1
                }
                let txt = ""
                let number = page * i

                for (let j = number; j < (number + page); j++) {
                    txt += `${j + 1}. ${rank[j].name} (${rank[j].points} points/${rank[j].records} WRs${rank[j].nation})\n\n`
                }
                array10.push({
                    title: "Mobile World Records List Leaderboard",
                    description: txt,
                    footer: { text: `Page ${i + 1} / ${Math.floor((Object.keys(leaderboard).length / page)) + addition}` }
                })
                // array10[i].setDescription(txt).setTitle("Mobile World Records List Leaderboard").setFooter({text: `Page ${i+1} / ${Math.floor((Object.keys(leaderboard).length / page))+addition}`})
            }
            if ((array10.length * page) != Object.keys(leaderboard).length) {
                for (let j = (array10.length * page); j < Object.keys(leaderboard).length; j++) {
                    fr += `${j + 1}. ${rank[j].name} (${rank[j].points} points/${rank[j].records} WRs${rank[j].nation})\n\n`
                }
                array10.push({
                    title: "Mobile World Records List Leaderboard",
                    description: fr,
                    footer: { text: `Page ${Math.floor((Object.keys(leaderboard).length / page)) + 1} / ${Math.floor((Object.keys(leaderboard).length / page)) + 1}` }
                })
                //array10.push(new EmbedBuilder().setDescription(fr).setTitle("Mobile World Records List Leaderboard").setFooter({text: `Page ${Math.floor((Object.keys(leaderboard).length / page))+1} / ${Math.floor((Object.keys(leaderboard).length / page))+1}`}))
            }
            const emoji = ["Back", "Next", "Skip Forward", "Skip Back", "🔗", "🛑"]
            var bu = {
                type: 1,
                components: []
            }
            var bu2 = {
                type: 1,
                components: []
            }
            // new ButtonBuilder()
            // .setCustomId(i.toString())
            // .setStyle(ButtonStyle.Primary)
            // .setLabel(emoji[i])
            for (let i = 0; i < 4; i++) {
                bu.components.push({
                    type: 2,
                    custom_id: i.toString(),
                    style: 1,
                    label: emoji[i]
                })
            }
            for (let i = 4; i < emoji.length; i++) {
                bu2.components.push({
                    type: 2,
                    custom_id: i.toString(),
                    style: 1,
                    label: emoji[i]
                })
            }
            bu.components[0].disabled = true
            function why(num) {
                if (num == 0) {
                    bu.components[0].disabled = true
                    bu.components[1].disabled = false
                } else {
                    if (num == array10.length - 1) {
                        bu.components[1].disabled = true
                        bu.components[0].disabled = false
                    } else {
                        bu.components[1].disabled = false
                        bu.components[0].disabled = false
                    }
                }
            }
            await rest.patch(Routes.webhookMessage(interaction.application_id, interaction.token), {
                body: {
                        embeds: [
                            array10[0]
                        ],
                        components: [bu, bu2]
                }
            })

            //await interaction.reply({embeds: [array10[0]], components: [bu, bu2], fetchReply: true})
            var whyudo = 0

            events.on("INTERACTION_CREATE", async (buttonclick) => {
                if (buttonclick.data?.component_type != 2 || buttonclick.message?.interaction?.id != interaction.id) return;
                switch (buttonclick.data.custom_id) {
                    case "0":
                        whyudo = whyudo > 0 ? --whyudo : array10.length - 1;
                        why(whyudo)
                        await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                            body: {
                                type: 7,
                                data: {
                                    embeds: [
                                        array10[whyudo]
                                    ],
                                    components: [bu, bu2]
                                }
                            }
                        })
                        break;
                    case "1":
                        whyudo = whyudo + 1 < array10.length ? ++whyudo : 0;
                        why(whyudo)
                        await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                            body: {
                                type: 7,
                                data: {
                                    embeds: [
                                        array10[whyudo]
                                    ],
                                    components: [bu, bu2]
                                }
                            }
                        })
                        break;
                    case "2":
                        whyudo = array10.length - 1
                        why(whyudo)
                        await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                            body: {
                                type: 7,
                                data: {
                                    embeds: [
                                        array10[whyudo]
                                    ],
                                    components: [bu, bu2]
                                }
                            }
                        })
                        break;
                    case "3":
                        whyudo = 0
                        why(whyudo)
                        await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                            body: {
                                type: 7,
                                data: {
                                    embeds: [
                                        array10[whyudo]
                                    ],
                                    components: [bu, bu2]
                                }
                            }
                        })
                        break;
                    case "4":
                        await rest.post(Routes.interactionCallback(buttonclick.id, buttonclick.token), {
                            body: {
                                type: 7,
                                data: {
                                embeds: [
                                        {
                                            description: "Link to the website leaderboard is [here!](https://www.gdmobilewrlist.cf/leaderboard.html)"
                                        }
                                    ], 
                                    components: []
                            }
                        }
                        })
                        break;
                    case "5":
                        await rest.delete(Routes.webhookMessage(interaction.application_id, interaction.token))
                        break
                }
            })
        }
    }
}