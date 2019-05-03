module.exports = function() {
  StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
    var numParts = Math.floor(energy / 200);
    var body = [];
    for (let i = 0; i < numParts; i++) {
      body.push(WORK);
    }
    for (let i = 0; i < numParts; i++) {
      body.push(CARRY);
    }
    for (let i = 0; i < numParts; i++) {
      body.push(MOVE);
    }

    return this.createCreep(body, null, { role: roleName, working: false });
  };
};