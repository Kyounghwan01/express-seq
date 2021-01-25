const db = require("../models");
const Tutorial = db.tutorials;
const Comment = db.comments;
const Op = db.Sequelize.Op;

// 새로운 튜토리얼 생성 및 저장
exports.createTutorial = (req, res) => {
  return Tutorial.create({
    title: req.body.title,
    description: req.body.description,
  })
    .then((data) => {
      console.log(">> Created tutorial: " + JSON.stringify(data, null, 4));
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while creating tutorial: ", err);
    });
};

// 새 댓글 작성 및 저장
exports.createComment = (req, res) => {
  return Comment.create({
    name: req.body.name,
    text: req.body.text,
    tutorialId: req.body.tutorialId,
  })
    .then((comment) => {
      console.log(">> Created comment: " + JSON.stringify(comment, null, 4));
      res.send(comment);
    })
    .catch((err) => {
      console.log(">> Error while creating comment: ", err);
    });
};

// 주어진 튜토리얼에 대한 코멘트 받기
exports.findTutorialById = (req, res) => {
  return Tutorial.findByPk(req.params.id, { include: ["comments"] })
    .then((tutorial) => {
      res.send(tutorial);
      return tutorial;
    })
    .catch((err) => {
      console.log(">> Error while finding tutorial: ", err);
    });
};

// 주어진 댓글 댓 ID에 대한글 가져 오기
exports.findCommentById = (req, res) => {
  // include: ["tutorial"] 를 넣으면 res에 해당하는 tutorial도 같이 들어옴
  return Comment.findByPk(req.params.id, { include: ["tutorial"] })
    .then((comment) => {
      res.send(comment);
      return comment;
    })
    .catch((err) => {
      console.log(">> Error while finding comment: ", err);
    });
};

// 댓글 포함 튜토리얼 가져오기
exports.findAll = (req, res) => {
  return Tutorial.findAll({
    include: ["comments"],
  }).then((tutorials) => {
    console.log("-----------------------");
    res.send(tutorials);
    return tutorials;
  });
};

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAlls = (req, res) => {
  const title = req.query.title;
  // title에 title 값이 포함되는 것만 가져옴
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Tutorial.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tutorial.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
