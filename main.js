require('prototype.spawn')();
require('prototype.creep')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

function findPosForConstructionSite(room, spawn, structureType, areaToBuild) {

  // _.sum(Game.spawns.Spawn1.room.find(FIND_SOURCES), s => s.energy)
  _.sum(
    _.map(Game.spawns.Spawn1.room.find(FIND_MY_CREEPS, c => c.memory.role === 'harvester'), c => c.getActiveBodyparts(WORK))
  ) * 2;
  
  _.map(Game.spawns.Spawn1.room.find(FIND_MY_CREEPS, c => c.memory.role === 'harvester'), c => c.getActiveBodyparts(WORK))

  var area = areaToBuild || {
    top: spawn.pos.y - 5,
    left: spawn.pos.x - 5,
    bottom: spawn.pos.y + 5,
    right: spawn.pos.x + 5
  };
  // number of structures available to build
  var structuresAvailable = CONTROLLER_STRUCTURES[structureType][room.controller.level];
  // number of structures already built
  var structuresBuilt = room.find(FIND_MY_STRUCTURES, { filter: { structureType: structureType } }).length;
  structuresBuilt += room.find(FIND_MY_CONSTRUCTION_SITES, { filter: { structureType: structureType } }).length;

  var newSiteCode = -1;
  if (structuresBuilt < structuresAvailable) {
    var look = room.lookAtArea(area.top, area.left, area.bottom, area.right, true);
    for (let i in look) {
      var pos = look[i];
      if (Math.abs(pos.x - spawn.pos.x) > 1 && Math.abs(pos.y - spawn.pos.y) > 1) {
        if (pos.structure && pos.structure.structureType === STRUCTURE_ROAD) {
          pos.structure.destroy();
        } else if (pos.constructionSite && pos.constructionSite.structureType === STRUCTURE_ROAD) {
          pos.constructionSite.remove();
        }
        newSiteCode = room.createConstructionSite(pos.x, pos.y, structureType);
        if (newSiteCode >= 0) {
          break;
        }
      }
    }
  }
  return newSiteCode
}

module.exports.loop = function () {
  // clear memory
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // initialize proerties in memory if not defined
  if (!Memory.constructionSites) {
    Memory.constructionSites = {}
  } else if (!Memory.constructionSites.roads) {
    Memory.constructionSites.roads = {};
  }

  if (!Memory.debug) {
    Memory.debug = {};
  }

  for (let name in Game.creeps) {
    var creep = Game.creeps[name];
    creep.findLocationForRoad();

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
  var minimumNumberOfUpgraders = 2;
  var minimumNumberOfBuilders = 1;
  var minimumNumberOfRepairers = 2;
  var minimumNumberOfWallRepairers = 2;

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
    role = 'wallRepairer';
  } else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
    role = 'builder';
  } else {
    role = 'builder';
  }

  Memory.debug.roleToBuild = role;

  for (let s in Game.spawns) {
    var spawn = Game.spawns[s];
    var room = spawn.room;

    var towers = room.find(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_TOWER
    });

    for (let tower of towers) {
      var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

      if (target) {
        tower.attack(target);
      }
    }

    if (spawn.room.find(FIND_HOSTILE_CREEPS).length > 0) {
      role = 'grunt';
    } else {
      findPosForConstructionSite(room, spawn, STRUCTURE_EXTENSION);
    }

    var energyAvailable = room.energyCapacityAvailable;
    var name = spawn.createCustomCreep(energyAvailable, role);

    if (name === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
      energyAvailable = room.energyAvailable;
      name = spawn.createCustomCreep(energyAvailable, role);
    }
  }

}