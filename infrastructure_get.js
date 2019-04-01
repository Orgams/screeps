let info_pos = require('info_pos');

let perif = function(target, dist, room) {
    let pos = info_pos.get_pos(target);

    res = [];
    for (let offset = -dist; offset <= dist; offset++) {
        res.push(new RoomPosition(pos.x + offset, pos.y + dist, room.name));
        res.push(new RoomPosition(pos.x + offset, pos.y - dist, room.name));
    }
    let distbis = dist - 1;
    for (let offset = -distbis; offset <= distbis; offset++) {
        res.push(new RoomPosition(pos.x + dist, pos.y + offset, room.name));
        res.push(new RoomPosition(pos.x - dist, pos.y + offset, room.name));
    }
    return res;
}

let diago = function(target, dist, room) {
    let pos = info_pos.get_pos(target);

    res = [];
    res.push(new RoomPosition(pos.x + dist, pos.y + dist, room.name));
    res.push(new RoomPosition(pos.x - dist, pos.y + dist, room.name));
    res.push(new RoomPosition(pos.x + dist, pos.y - dist, room.name));
    res.push(new RoomPosition(pos.x - dist, pos.y - dist, room.name));
    return res;
}

let ortho = function(target, dist, room) {
    console.log("target : ", target, "dist : ", dist, "room : ", room);
    let pos = info_pos.get_pos(target);


    res = [];
    
    res.push(new RoomPosition(pos.x + dist, pos.y, room.name));
    console.log("test2");
    res.push(new RoomPosition(pos.x - dist, pos.y, room.name));
    res.push(new RoomPosition(pos.x, pos.y + dist, room.name));
    res.push(new RoomPosition(pos.x, pos.y - dist, room.name));
    return res;
}

let pos_paire = function(poss) {
    return _.filter(poss, (pos) => (pos.x+pos.y)%2 === 0);
}

let pos_on_path = function(source, target, dist, roomName) {

    let path = source.pos.findPathTo(target, {
        ignoreCreeps: true,
        swampCost: 1
    });

    path.slice(1);
    path.pop();

    dist--;

    let pos_path;

    while (pos_path === undefined && dist >= 0) {
        pos_path = path[dist]
        dist--;
    }

    let pos = new RoomPosition(pos_path.x, pos_path.y, roomName);

    return pos;
}

module.exports = {
    perif: perif,
    diago: diago,
    ortho: ortho,
    pos_paire: pos_paire,
    pos_on_path: pos_on_path
}