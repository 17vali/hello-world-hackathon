const mongoose = require('mongoose');

const UserConfigSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    userTag: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    favHeroes: {
        type: [mongoose.SchemaTypes.String],
        required: false,
    },
    favComics: {
        type: [mongoose.SchemaTypes.String],
        required: false,
    },
});

module.exports = mongoose.model('UserConfig', UserConfigSchema);