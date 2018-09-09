const Sequelize = require('sequelize');
const path      = require('path');
const fs        = require('fs');
const config    = require('../config');
const util      = require('../helpers/util');
let basename    = path.basename(__filename);
console.log(config)
const sequelize = new Sequelize(config.db_name, config.db_user, config.db_password, {
    host: config.db_host,
    dialect: config.db_dialect,
    port: config.db_port,
    operatorsAliases: false,
    logging: true,
    define: {
        underscored: true
    }
});

const models = {};

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        let model = sequelize['import'](path.join(__dirname, file));
        models[model.name] = model; // cap this way you access the models with Cap but the database table names are lower case
    });


Object.keys(models).forEach((model_name) => {
  let model = models[model_name];
  if (model.associate) {
    model.associate(models);
  }
});
sequelize.sync()

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
