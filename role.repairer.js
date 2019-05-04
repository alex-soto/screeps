var roleBuilder = require('role.builder');

module.exports = {
  run: function(creep) {
    if (creep.memory.working === true && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    } else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('🔨 repair');
    }
    
    if (creep.memory.working === true) {
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
      });
  
      if (structure) {
        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
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