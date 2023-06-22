
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
    function sure(j) {
        if(person.extralist[0] == "none") {
            return 0
          }
          if(!person.extralist[j]) {
            return 0
          } else {
          if(person.extralist[j].percent != 100) {
            return 0
          } else if(person.extralist[j].percent == 100) {
            return 1
          }
          }
    }
    function LK4() {
        if(!person.minus) {
          return 0
        } else {
          return person.minus
        }
      }
      let point = (kk() + kk2() + sure(0) + sure(1) + sure(2) + sure(3) + sure(4) + sure(5) + sure(6) + sure(7) + sure(8) + sure(9) + sure(10) + sure(11) + sure(12) + sure(13) + sure(14) + sure(15) + sure(16) + sure(17) + sure(18) + sure(19) + sure(20) + sure(21) + sure(22) + sure(23) + sure(24) + sure(25) + sure(26) + sure(27) + sure(28) + sure(29) + sure(30) + sure(31) + sure(32) + sure(33) + sure(34) + sure(35) + sure(36) + sure(37) + sure(38) + sure(39) + sure(40) + sure(41) + sure(42) + sure(43) + sure(44) + sure(45) + sure(46) + sure(47) + sure(48) + sure(49) + sure(50)) - LK4()
      for(const thing in person) {
        if(typeof person[thing] == "object") {
            if(thing == "extralist") { 
                point -= person[thing].filter(e => e.deleted && e.percent == 100).length
            }
            if(thing == "records") {
                point -= person[thing].filter(e => e.deleted).length
            }
            if(thing == "completions") {
                point -= person[thing].filter(e => e.deleted).length*2
            }
        }
    }
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