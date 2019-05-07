module.exports = {
  run: function(creep) {
    var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (!hostile) {
      creep.say('❌ die');
      creep.suicide();
    } else if (creep.memory.working === false) {
      creep.memory.working = true;
      creep.say('⚔️ attack');
    }

    if (hostile && creep.attack(hostile) === ERR_NOT_IN_RANGE) {
      creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ce1a1a'}});
    }
  }
};