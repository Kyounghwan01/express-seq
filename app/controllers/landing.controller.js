const fs = require("fs").promises;

const moment = require("moment");
const db = require("../models");
const Company = db.companies;
const Landing = db.landings;
const LandingImage = db.landingImages;
const LandingButton = db.landingButtons;
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

exports.getCompanies = async (req, res) => {
  try {
    const company = await Company.findAll();
    res.send(company);
  } catch (e) {
    res.status(500).json({ message: e.toString() });
  }
};

exports.checkvalidation = async (req, res, next) => {
  if (!req.body.target.length) {
    return res
      .status(400)
      .send({ message: "적어도 하나의 랜딩페이지가 존재해야합니다" });
  }
  next();
};

exports.createOrSearchCompany = async (req, res, next) => {
  /** company table 검색 후 없으면 추가 */
  try {
    const companyId = await Company.findOrCreate({
      where: { name: req.body.company },
      defaults: { name: req.body.company },
    });
    req.companyId = companyId[0].id;
    next();
  } catch (e) {
    console.log(3333, e);
    res.status(500).json({ isSuccess: false, message: e.toString() });
  }
};

exports.createLanding = async (req, res, next) => {
  /** landing table 추가 */
  try {
    const {
      startAt,
      expiredAt,
      type,
      createdBy,
      afccd,
      afcDtFlgcd,
      afcDtcd,
      title,
    } = req.body;

    let params = {
      companyId: req.companyId,
      start_at: startAt,
      expired_at: expiredAt,
      type,
      created_by: createdBy,
      title,
      afccd,
      afcDtFlgcd,
      afcDtcd,
    };

    const landing = await Landing.create(params);

    req.landing = landing;
    next();
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.toString() });
  }
};

exports.createLandingImage = async (req, res, next) => {
  /** landing_image 생성 */
  try {
    const landingImageArray = [];
    for (const el of req.body.target) {
      const landingImageParams = {
        landingUuid: req.landing.uuid,
        type: el.type,
        data: el.landingImage,
        bottomButton: el.bottomButton,
      };

      const landingImage = await LandingImage.create(landingImageParams);
      landingImageArray.push(landingImage);
    }

    req.landingImageArray = landingImageArray;
    next();
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.toString() });
  }
};

exports.createLandingButton = async (req, res) => {
  try {
    /** landing_button 생성 */
    for (const index in req.body.target) {
      for (const els of req.body.target[index].buttonElement) {
        let landingButtonProps = {
          landingImageId: req.landingImageArray[index].id,
          position_x: els.x,
          position_y: els.y,
          width: els.width,
          height: els.height,
          type: els.action.type,
          text: els.action.text,
        };

        await LandingButton.create(landingButtonProps);
      }
    }

    res.send({ isSuccess: true, landingId: req.landing.uuid });
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.toString(), test: 1 });
  }
};

// get all landing
exports.getLandings = async (req, res) => {
  const { currentPage } = req.query;
  let offset = 0;
  let limit = 10;

  if (!currentPage) {
    return res.status(400).send({ message: "currentPage가 없습니다." });
  }
  if (currentPage > 1) {
    offset = 10 * (currentPage - 1);
  }
  const includeParams = [
    {
      model: db.companies,
      as: "companies",
      attributes: ["name"],
    },
    {
      model: db.landingImages,
      as: "landingImages",
      // include: [
      //   { model: db.landingButtons, as: "landingButtons", required: false },
      // ],
      attributes: { exclude: ["data"] },
    },
  ];

  const landingParams = {
    include: includeParams,
    distinct: true,
    limit,
    offset,
    order: [["updatedAt", "DESC"]],
  };

  if (req.query.company) {
    includeParams[0].where = { name: req.query.company };
  }

  if (req.query.afccd) {
    landingParams.where = { afccd: req.query.afccd };
  }

  if (req.query.landingType) {
    landingParams.where = {
      ...landingParams.where,
      type: req.query.landingType,
    };
  }

  if (req.query.statusType) {
    if (req.query.statusType === "inProgress") {
      landingParams.where = {
        ...landingParams.where,
        start_at: { [Op.lt]: moment().toDate() },
        expired_at: { [Op.gt]: moment().subtract(1, "days").toDate() },
      };
    } else if (req.query.statusType === "expired") {
      landingParams.where = {
        ...landingParams.where,
        expired_at: { [Op.lt]: moment().subtract(1, "days").toDate() },
      };
    } else if (req.query.statusType === "planned") {
      landingParams.where = {
        ...landingParams.where,
        start_at: { [Op.gt]: moment().toDate() },
      };
    }
  }

  try {
    const landingList = await Landing.findAndCountAll(landingParams);
    res.send({
      ...landingList,
      currentPage,
      totalPage: Math.floor(landingList.count / limit) + 1,
    });
  } catch (e) {
    res.status(500).send(e.toString());
  }
};

exports.getLandingById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ message: "id가 없습니다" });

  try {
    const landing = await Landing.findByPk(id, {
      include: [
        {
          model: db.companies,
          as: "companies",
          attributes: ["name"],
        },
        {
          model: db.landingImages,
          as: "landingImages",
          include: [
            { model: db.landingButtons, as: "landingButtons", required: false },
          ],
        },
      ],
    });
    if (!landing)
      res.send({ message: "랜딩 페이지가 없습니다", noLanding: true });
    res.send(landing);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
};

exports.deleteLandingById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Landing.destroy({
      where: {
        uuid: id,
      },
    });
    if (result) {
      res.send({ message: "success", isSuccess: true });
    } else {
      res
        .status(200)
        .send({ message: "제거할 랜딩페이지가 없습니다.", isSuccess: false });
    }
  } catch (e) {
    res.status(500).send(e.toString());
  }
};
