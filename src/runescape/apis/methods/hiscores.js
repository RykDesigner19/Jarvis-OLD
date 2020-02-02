const request = require("../../util/Request.js");

const reviewNumber = (n) => (n == -1 || n.toString() == 'NaN') ? 0 : n

module.exports = class Hiscores {
  constructor(config) {
    this.name = 'hiscores'
    this.config = config[this.name]
  }

  async clan(name) {
    const result = await request.csv(`${this.config.urls.clan + encodeURIComponent(name)}`)
      .then((data) => {
        if (data) return this.readClan(data)
        return data
      })
    return result
  }

  async player(player, type = 'normal') {
    const result = await request.csv(`${this.config.urls[type] + encodeURIComponent(player)}`)
      .then((data) => {
        if (data) {
          return {
            skills: this.readSkills(data),
            activities: this.readActivities(data),
            maxed: this.isMaxed(data),
          }
        }
        return data
      })
    return result
  }

  isMaxed(data) {
    let skills = this.readSkills(data);
    for (let skill in skills) {
      if (skill.level < 99) {
        return false;
      }
    }
    return true
  }

  readSkills(data) {
    let skills = {};
    for (let i = 0; i < this.config.skills.length; i++) {
      let skillName = this.config.skills[i].toLowerCase();
      skills[skillName] = {
        rank: reviewNumber(Number(data[i][0])),
        level: reviewNumber(Number(data[i][1])),
        exp: reviewNumber(Number(data[i][2]))
      }
    }
    return skills
  }

  readActivities(data) {
    let activities = [];
    for (let i = 0; i < this.config.activities.length; i++) {
      let name = this.config.activities[i]
      activities.push({
        rank: reviewNumber(Number(data[i + this.config.skills.length][0])),
        score: reviewNumber(Number(data[i + this.config.skills.length][1])),
        name
      })
    }
    return activities
  }

  readClan(data) {
    let members = [];
    let space = new RegExp(String.fromCharCode(65533), 'g');
    for (var i = 0; i < data.length; i++) {
      let member = data[i];
      members.push({
        player: member[0].replace(space, ' '),
        rank: member[1],
        exp: reviewNumber(Number(member[2])),
        kills: reviewNumber(Number(member[3]))
      })
    }
    return {
      membersSize: (members.length - 1),
      members: members.slice(1)
    }
  }
}