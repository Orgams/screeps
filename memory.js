var memory = {
    set: function(key, value) {
        console.log(key, value)
        Memory[key]=value;
    },
    get: function(key, value) {

    }
}

module.exports = memory;