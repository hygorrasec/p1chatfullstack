const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado ao MongoDB!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB.", error);
    }
};

module.exports = { sequelize, connectMongo };
