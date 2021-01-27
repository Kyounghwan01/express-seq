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
    res.status(500).json({ message: e.errors });
  }
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
    res.status(500).json({ isSuccess: false, message: e.errors });
  }
};

exports.createLanding = async (req, res, next) => {
  /** landing table 추가 */
  try {
    const {
      company,
      startAt,
      expiredAt,
      type,
      createdBy,
      afccd,
      afcDtFlgcd,
      afcDtcd,
    } = req.body;

    let params = {
      companyId: req.companyId,
      start_at: startAt,
      expired_at: expiredAt,
      type: type,
      created_by: createdBy,
    };
    if (afccd) {
      params = { ...params, afccd };
    }
    if (afcDtFlgcd) {
      params = { ...params, afcDtFlgcd };
    }
    if (afcDtcd) {
      params = { ...params, afcDtcd };
    }
    const landing = await Landing.create(params);

    req.landing = landing;
    next();
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.errors });
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
        bottomButton: el.buttonButton,
      };

      const landingImage = await LandingImage.create(landingImageParams);
      landingImageArray.push(landingImage);
    }

    req.landingImageArray = landingImageArray;
    next();
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.errors });
  }
};

exports.createLandingButton = async (req, res) => {
  try {
    /** landing_button 생성 */
    for (const index in req.body.target) {
      for (const els of req.body.target[index].buttonElement) {
        let landingButtonProps = {
          landingImageId: req.landingImageArray[index].id,
          position_x: els.positionX,
          position_y: els.positionY,
          width: els.width,
          height: els.height,
          type: els.type,
        };
        if (els.content) {
          landingButtonProps = { ...landingButtonProps, content: els.content };
        }
        if (els.description) {
          landingButtonProps = {
            ...landingButtonProps,
            description: els.description,
          };
        }

        const landingButton = await LandingButton.create(landingButtonProps);
      }
    }

    res.send({ isSuccess: true, landingId: req.landing.uuid });
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.errors });
  }
};

// get all landing
// todo: filter -> afccd, 구분 (event/landing), 상태 (진행중,종료)
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
      include: [
        { model: db.landingButtons, as: "landingButtons", required: false },
      ],
    },
  ];

  const landingParams = {
    include: includeParams,
    distinct: true,
    limit,
    offset,
  };

  if (req.query.company) {
    includeParams[0].where = { name: req.query.company };
  }

  if (req.query.afccd) {
    landingParams.where = { afccd: req.query.afccd };
  }

  try {
    const landingList = await Landing.findAndCountAll(landingParams);
    res.send({
      ...landingList,
      currentPage,
      totalPage: Math.floor(landingList.count / limit) + 1,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

// where filter
/**
 * 
 * PostModel.findAll({
    include: [ {
        model: TagModel, 
        where: { $and: [ { title: 'cheap' }, { title: 'cars' } ] } 
    } ]
});
 */

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
    res.send(landing);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
