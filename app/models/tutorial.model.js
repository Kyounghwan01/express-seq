module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define(
    "tutorial",
    {
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      published: {
        type: Sequelize.BOOLEAN,
      },
    },
    {
      sequelize, //해당 부분에 db.sequelize 객체가 들어간다.
      timestamps: true, //true로 하면 createdAt과 updatedAt을 생성한다.
      underscored: false, //기본적으로 테이블명과 컬럼명을 CamelCase로 바꾸는데 snake case로 변경해준다
      paranoid: true, // true로 설정하면 deletedAt 컬럼이 생긴다. 삭제시 완전히 지워지지 않고 deletedAt에 지운시각이 기록된다.,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  return Tutorial;
};

// 테이블 정의 define() 함수

// module.exports = (sequelize, DataTypes) => {
//   const Concert = sequelize.define(
//     "Concert",
//     {
//       concert_Id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       starttime: DataTypes.STRING,
//       endtime: DataTypes.STRING,
//       stage: DataTypes.STRING,
//       artist: DataTypes.STRING,
//       con_day: DataTypes.INTEGER,
//       //festival_Id: DataTypes.INTEGER // 외래 키 처리
//     },
//     {
//       hooks: {},
//     }
//   );

//   Concert.associate = function (models) {
//     Concert.belongsToMany(models.Users, {
//       through: "UserConcert",
//       foreignKey: "concert_Id",
//     });
//     Concert.belongsTo(models.Festival, {
//       foreignKey: "festival_Id",
//     });
//   };
//   return Concert;
// };

// Festival.associate = function (models) {
//   Festival.hasMany(models.Concert, {
//     foreignKey: "festival_Id",
//   });
// };
// Concert.associate = function (models) {
//   Concert.belongsTo(models.Festival, {
//     foreignKey: "festival_Id",
//   });
// };

// app.get("/concerts_user/:id/:fest_id", (req, res) => {
//   users
//     .findOne({
//       where: {
//         user_Id: req.params.id,
//       },
//       include: {
//         attributes: [
//           "concert_Id",
//           "starttime",
//           "endtime",
//           "stage",
//           "artist",
//           "con_day",
//           "festival_Id",
//         ],
//         model: concert,
//         where: {
//           festival_Id: req.params.fest_id,
//         },
//         through: { attributes: [] },
//       },
//     })
//     .then((result) => {
//       res.status(200).json(result.Concerts);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });
