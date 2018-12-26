let infrastructure_create = require('infrastructure_create');

let infrastructure = {
    build: function(source) {
        let rooms = Object.values(Game.rooms)

        for (let target of rooms) {
            if (source.name !== target.name) {
                let path = source.controller.pos.findPathTo(target.controller.pos, {
                    ignoreCreeps: true,
                    swampCost: 1
                });
                for (let i = path.length - 2; i >= 0; i--) {
                    let point = path[i];
                    let pos = new RoomPosition(point.x, point.y, source.name);
                    let ret = infrastructure_create.create(pos, STRUCTURE_ROAD);
                    if (ret == OK) {
                        return true;
                    }
                }
            }
        }
    }
}

module.exports = infrastructure;