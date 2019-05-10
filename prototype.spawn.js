module.exports = function() {
  StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
    var numParts = Math.floor(energy / 200);
    
    var bodyComponents = [];
    if (roleName === 'grunt') {
      bodyComponents = [ATTACK,TOUGH,TOUGH,MOVE]
    } else {
      bodyComponents = [WORK,CARRY,MOVE];
    }
    var body = [];
    
    // for (let c of bodyComponents) {
    //   body.push = _.map(bodyComponents, i => Array(numParts).fill(c))
    //   // body.push(c)
    // }

    for (let i = 0; i < bodyComponents.length; i++) {
      for (let j = 0; j < numParts; j++) {
        body.push(bodyComponents[i]);
      }
    }

    return this.createCreep(body, null, { role: roleName, working: false });
  };
};