// {uuid: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4}

app.get("/users/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  const user = User.findOne({ where: { uuid } });
  return res.send(user);
});

app.post("/posts", async (req, res) => {
  const { userUuid, body } = req.body;
  const user = await User.findOne({ where: { uuid: userUuid } });
  const post = await Post.create({ body, userId: user });
  return res.send();
});

app.get("/posts", async (req, res) => {
  // post값에 user까지 포함
  const posts = await Post.findAll({ include: [User] });
});

// {
// 	name: {
// 		type: string,
// 		allowNull: false,
// 		validate: {
// 				notNull: {msg: 'user must have a name'},
// 				notEmpty: {msg: 'user must not be empty'},
// 		}
// 	}
// }

app.delete("users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const user = await User.findOne({ where: { uuid } });

  await user.destory();
  return res.json({ message: "user destory" });
});

app.put("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const { name, email, role } = req.body;

  const user = await User.findOne({ where: { uuid } });

  user.name = name;
  user.email = email;
  await user.save();
});

router.put("/board/:id", function (req, res, next) {
  let postID = req.params.id;
  let body = req.body;

  models.post
    .update(
      {
        title: body.editTitle,
        writer: body.editWriter
      },
      {
        where: { id: postID }
      }
    )
    .then(result => {
      console.log("데이터 수정 완료");
      res.redirect("/board");
    })
    .catch(err => {
      console.log("데이터 수정 실패");
    });
});

router.delete("/board/:id", function (req, res, next) {
  let postID = req.params.id;

  models.post
    .destroy({
      where: { id: postID }
    })
    .then(result => {
      res.redirect("/board");
    })
    .catch(err => {
      console.log("데이터 삭제 실패");
    });
});

// returning true 쓰면 then에 반환된 결과물 보임
router.put("/book/:bookId", function (req, res, next) {
  Book.update(
    { title: req.body.title },
    { returning: true, where: { id: req.params.bookId } }
  )
    .then(function ([rowsUpdate, [updatedBook]]) {
      res.json(updatedBook);
    })
    .catch(next);
});

/*
  findOrCreate()
  처음 데이터를 조회하고 원하는 데이터가 존재하지 않으면 데이터를 생성합니다.

 조회를 시도하고 원하는 결과가 없을 경우 로우를 생성합니다.
 find or create 사용시에는 결과값으로 2개의 인자가 반환되기 때문에
 spread 메소드를 사용합니다.
*/
select.findOrCreate = (data, callback) => {
  return user
    .findOrCreate({
      where: { user_id: data },
      defaults: { password: "5555" }
    })
    .spread((user, create) => {
      user && callback(user);
      create && callback(create);
    })
    .catch(err => {
      callback(err);
    });
};

/*
findAndCountAll()
검색한 데이터를 전체 검색하고 검색된 데이터의 개수를 반환합니다.

  conbines findAll and count 조회와 카운트의 혼합형 입니다.
  count - integer, total number record matching the where clause and other filters due to associations,
          within the limit and offset range
          정수로 반환되며 레코드의 총 숫자를 반환합니다. 
  rows - an array of objects, the records matching the where clause and other filters due to associations,
         within the limit and offest range
         배열객체로 반환 됩니다.
  
  Offset과 limit를 통해 두가지 모두 제한을 줄 수 있습니다.
*/
select.findAndCountAll = callback => {
  return user
    .findAndCountAll({
      where: {
        password: {
          [Op.like]: "foo%"
        }
      }
    })
    .then(result => {
      console.log(result.count);
      console.log(result.rows);
      callback(result);
    });
};

// 검색 옵션 -> https://real-dongsoo7.tistory.com/62

// 다른 table join 옵션

user.findAndCountAll({
  // include는 config에서 정해준 관계에 따라 join을 가능하도록 해주는 명령어
  include: [
    /*
     where 절에 들어있는 컬럼은 기본적으로 required 상태가 된다. 
     model 부분은 조인하고자 하는 model이 대상이 되며 
     where 절에 있는 컬럼은 조인의 대상이 된다.
     */
    { model: book, required: true },
    { model: book, where: { user_id: true } },
    // Belong-To-Many인 모델에서 where절을 사용하기 위해서는
    (through: {
      attribute: ["cloumn1", "column2", "column3"],
      where: { compeleted: true }
    })
  ],
  limit: 10,
  offset: 1
});
