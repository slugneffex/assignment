// models/user.js

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      permalink: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'User',
      timestamps: true,
      paranoid: true // This will enable the 'deletedAt' column for soft deletes
    });
  
    return User;
  };
  