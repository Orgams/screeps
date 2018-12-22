let infrastructure = {
    perif: function(target, dist, room){
        res = [];
        for (let offset = -dist; offset <= dist; offset++) {
            res.push(new RoomPosition(target.pos.x + offset, target.pos.y + dist, room.name));
            res.push(new RoomPosition(target.pos.x + offset, target.pos.y - dist, room.name));
        }
        let distbis = dist-1;
        for (let offset = -distbis; offset <= distbis; offset++) {
            res.push(new RoomPosition(target.pos.x + dist, target.pos.y + offset, room.name));
            res.push(new RoomPosition(target.pos.x - dist, target.pos.y + offset, room.name));
        }
        return res;
    }
}

module.exports = infrastructure;
