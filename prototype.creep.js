module.exports = function(){
  Creep.prototype.findLocationForRoad = function() {
    var creep = this;

    var existing = creep.pos.lookFor(LOOK_STRUCTURES) || creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
    if (existing.length === 0) {
      
      var numAdjacent = creep.pos.findInRange(FIND_STRUCTURES,1).length
      numAdjacent += creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES,1).length

      if (numAdjacent <= 6) {
        var constructionSites = Memory.constructionSites;
        if (!constructionSites.roads[creep.pos]) {
          constructionSites.roads[creep.pos] = 0;
        } else if (constructionSites.roads[creep.pos] < 10) {
          constructionSites.roads[creep.pos]++;
        } else if (constructionSites.roads[creep.pos] >= 10){
          var adjacentStructures = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, { 
            filter: { structureType: STRUCTURE_ROAD } 
          }).length + 
            creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1).length;
          if (adjacentStructures < 4) {
            creep.say('Build road:',constructionSites.roads[creep.pos]);
            creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD)
          }
          delete Memory.constructionSites.roads[creep.pos];
        }
      }          
    }
  }
}
