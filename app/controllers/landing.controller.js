// 컴페니가 없다면 컴페니 생성하고 나온 id를 기반으로 다시 생성
const db = require("../models");
const Company = db.companies;
const Op = db.Sequelize.Op;

exports.createCompany = (req, res) => {
  return Company.create({
    name: req.body.name,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getCompanies = (req, res) => {
  return Company.findAll()
    .then((company) => {
      res.send(company);
      return company;
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.createLanding = (req, res) => {};
