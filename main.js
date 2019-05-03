require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

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
    } else if (creep.memory.role === 'builder') {
      roleBuilder.run(creep);
    } else if (creep.memory.role === 'repairer') {
      roleRepairer.run(creep);
    }
  }

  var minimumNumberOfHarvesters = 10;
  var minimumNumberOfUpgraders = 1;
  var minimumNumberOfBuilders = 1;
  var minimumNumberOfRepairers = 2;
  var minimumNumberOfWallRepairers = 1;

  var numberOfHarvesters = _.sum(Game.creeps, c => c.memory.role === 'harvester');
  var numberOfUpgraders = _.sum(Game.creeps, c => c.memory.role === 'upgrader');
  var numberOfBuilders = _.sum(Game.creeps, c => c.memory.role === 'builder');
  var numberOfRepairers = _.sum(Game.creeps, c => c.memory.role === 'repairer');
  var numberOfWallRepairers = _.sum(Game.creeps, c => c.memory.role === 'wallRepairer');

  var role = null;
  
  if (numberOfHarvesters < minimumNumberOfHarvesters) {
    role = 'harvester';
  } else if (numberOfUpgraders < minimumNumberOfUpgraders) {
    role = 'upgrader';
  } else if (numberOfRepairers < minimumNumberOfRepairers) {
    role = 'repairer';
  } else if (numberOfBuilders < minimumNumberOfBuilders) {
    role = 'builder';
  } else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
    role = 'wallRepairer';
  } else {
    role = 'builder';
  }

  var bodyArray = null;
  // var bodyArray = role === 'harvester' ? [WORK, WORK, CARRY, MOVE] : [WORK, CARRY, MOVE, MOVE];
  switch (role) {
    case 'harvester':
      bodyArray = [WORK, WORK, CARRY, MOVE];
      break;
    case 'upgrader':
      bodyArray = [WORK, CARRY, MOVE, MOVE];
      break;
    case 'repairer':
      bodyArray = [WORK, WORK, CARRY, MOVE];
    case 'builder':
      bodyArray = [WORK, WORK, CARRY, MOVE];
      break;
    default:
      bodyArray = [WORK, WORK, CARRY, MOVE];
      break;
  }

  for (let spawn in Game.spawns) {
    var room = Game.spawns[spawn].room;

    var towers = room.find(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_TOWER
    });

    for (let tower of towers) {
      var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

      if (target) {
        tower.attack(target);
      }
    }

    var energyAvailable = room.energyCapacityAvailable;
    var name = Game.spawns[spawn].createCustomCreep(energyAvailable, role);

    if (name === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
      energyAvailable = room.energyAvailable;
      name = Game.spawns[spawn].createCustomCreep(energyAvailable, role);
    }
  }

  if (typeof name === 'string') {
    console.log('Spawned new creep:', name);
    console.log('Harvesters',numberOfHarvesters);
    console.log('Upgraders',numberOfUpgraders);
    console.log('Builders',numberOfBuilders);
    console.log('Repairers',numberOfRepairers);
  }

}