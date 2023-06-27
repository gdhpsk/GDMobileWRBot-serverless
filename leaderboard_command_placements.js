
module.exports = (lead, bywrs) => {
    let leaderboard = lead
const country_code = require("./JSON/country_codes.json")
const lowercaseKeys = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {}); 
let h = []
for(const key in leaderboard) {
    let person = leaderboard[key]
    function kk() {
        if(person.records[0] == "none") {
            return 0
        } else {
            return person.records.length
        }
    }
    function kk22() {
        if(person.completions[0] == "none") {
            return 0
        } else {
            return person.completions.length
        }
    }
    function kk23() {
        if(person.extralist[0] == "none") {
            return 0
        } else {
            return person.extralist.length
        }
    }
    function kk24() {
        if(person.screenshot[0] == "none") {
            return 0
        } else {
            return person.screenshot.length
        }
    }
    function kk2() {
        if(person.completions[0] == "none") {
            return 0
        } else {
            return person.completions.length * 2
        }
    }
    function sure() {
        if(person.extralist[0] == "none") {
            return 0
          } else {
            return person.extralist.filter(e => e?.percent == 100).length
          }
    }
    function LK4() {
        if(!person.minus) {
          return 0
        } else {
          return person.minus
        }
      }
      let point = kk() + kk2() + sure() - LK4()
let hg = ""
let totalrecords = kk() + kk22() + kk23() + kk24()
if(person.nationality) {
    let nationality = person.nationality.replace(/_/g, " ")

    hg = `, ${nationality} :flag_${lowercaseKeys(country_code)[person.nationality.toLowerCase()]}:`
}
    let object = {
        points: point,
        name: key,
        nation: `${hg}`,
        records: totalrecords
    }
    h.push(object)
}
if(bywrs) {
    h.sort((a, b) => b.records - a.records)
} else {
    h.sort((a, b) => b.points - a.points)
}
return h
}