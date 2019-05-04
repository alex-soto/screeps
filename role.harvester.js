module.exports = {
  run: function(creep) {
    if (creep.memory.working === true && creep.carry.energy === 0) {
      creep.memory.working = false;
    } else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
    }
    
    if (creep.memory.working === true) {
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && 
                      s.energy < s.energyCapacity
      });

      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
      
    } else {
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        
        var existing = creep.pos.lookFor(LOOK_STRUCTURES) || creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
        if (existing.length === 0) {
          if (!Memory.constructionSites) {
            Memory.constructionSites = {}
          } else if (!Memory.constructionSites.roads) {
            Memory.constructionSites.roads = {};
          }

          var constructionSites = Memory.constructionSites;
          if (!constructionSites.roads[creep.pos]) {
            constructionSites.roads[creep.pos] = 0;
            
          } 
          if (constructionSites.roads[creep.pos] < 10) {
            constructionSites.roads[creep.pos]++;
          } else {
            creep.say('Build road:',constructionSites.roads[creep.pos]);
            creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD)
            delete Memory.constructionSites.roads[creep.pos];
          }

        }

        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
};