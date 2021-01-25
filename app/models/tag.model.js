module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "tag",
    {
      name: {
        type: DataTypes.STRING,
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

  return Tag;
};
