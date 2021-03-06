var roleBuilder = require('role.builder');

module.exports = {
  run: function(creep) {
    if (creep.memory.working === true && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    } else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('🔨⛩ repair wall');
    }

    if (creep.memory.working === true) {
      var walls = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART
      });
  
      var target = null;
      for (let percentage = 0.0001; percentage < 1; percentage += 0.0001) {

        for (let wall of walls) {
          if (wall.hits / wall.hitsMax < percentage) {
            target = wall;
            break;
          }
        }

        if (target) {
          break;
        }
      }

      if (target) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      } else {
        roleBuilder.run(creep);
      }
      

    } else {
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
};