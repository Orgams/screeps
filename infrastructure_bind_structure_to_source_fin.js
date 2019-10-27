let infrastructure_bind_structure_to_source = require('infrastructure_bind_structure_to_source');
let infrastructure = {
    build: function(room, sources){
        return infrastructure_bind_structure_to_source.build(room, sources);
    }
}

module.exports = infrastructure;
