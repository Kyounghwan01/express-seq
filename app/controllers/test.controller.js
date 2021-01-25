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
