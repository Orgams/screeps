let perif = function(target, dist, room) {
    res = [];
    for (let offset = -dist; offset <= dist; offset++) {
        res.push(new RoomPosition(target.pos.x + offset, target.pos.y + dist, room.name));
        res.push(new RoomPosition(target.pos.x + offset, target.pos.y - dist, room.name));
    }
    let distbis = dist - 1;
    for (let offset = -distbis; offset <= distbis; offset++) {
        res.push(new RoomPosition(target.pos.x + dist, target.pos.y + offset, room.name));
        res.push(new RoomPosition(target.pos.x - dist, target.pos.y + offset, room.name));
    }
    return res;
}

let diago = function(target, dist, room) {
    res = [];
    res.push(new RoomPosition(target.pos.x + dist, target.pos.y + dist, room.name));
    res.push(new RoomPosition(target.pos.x - dist, target.pos.y + dist, room.name));
    res.push(new RoomPosition(target.pos.x + dist, target.pos.y - dist, room.name));
    res.push(new RoomPosition(target.pos.x - dist, target.pos.y - dist, room.name));
    return res;
}

let ortho = function(target, dist, room) {
    res = [];
    res.push(new RoomPosition(target.pos.x + dist, target.pos.y, room.name));
    res.push(new RoomPosition(target.pos.x - dist, target.pos.y, room.name));
    res.push(new RoomPosition(target.pos.x, target.pos.y + dist, room.name));
    res.push(new RoomPosition(target.pos.x, target.pos.y - dist, room.name));
    return res;
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
    pos_on_path: pos_on_path
}