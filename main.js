var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
  // clear memory
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  for (let name in Game.creeps) {
    var creep = Game.creeps[name];

    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    } else if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    }
  }

  var minimumNumberOfHarvesters = 10;
  var numberOfHarvesters = _.sum(Game.creeps, c => c.memory.role === 'harvester');
  var numberOfUpgraders = _.sum(Game.creeps, c => c.memory.role === 'upgrader');

  var role = numberOfHarvesters < minimumNumberOfHarvesters ? 'harvester' : 'upgrader'; 

  var name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], null, {
    role: role,
    working: false,
  });

  if (typeof name === 'string') {
    console.log('Spawned new creep:', name);
    console.log('Harvesters',numberOfHarvesters);
    console.log('Upgraders',numberOfUpgraders);
  }

}