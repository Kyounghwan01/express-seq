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

/**
try {
    const company = await Company.findAll({
      where: { name: req.query.name },
      // defaults: { name: req.body.companyName },
    });
    res.send(company);
  } catch (e) {
    res.send(e);
  }

 */

exports.createLanding = async (req, res) => {
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

    const companyId = await Company.findOrCreate({
      where: { name: company },
      defaults: { name: company },
    });

    let params = {
      companyId: companyId[0].id,
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

    /** landing_image 생성 */
    const landingImageArray = [];
    for (const el of req.body.target) {
      const landingImageParams = {
        landingUuid: landing.uuid,
        type: el.type,
        data: el.landingImage,
        bottomButton: el.buttonButton,
      };

      const landingImage = await LandingImage.create(landingImageParams);
      landingImageArray.push(landingImage);
    }

    /** landing_button 생성 */
    for (const index in req.body.target) {
      for (const els of req.body.target[index].buttonElement) {
        let landingButtonProps = {
          landingImageId: landingImageArray[index].id,
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

    res.send({ isSuccess: true, landingId: landing.uuid });
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.errors });
  }
};

// get landing
exports.getLandings = async (req, res) => {
  try {
    const company = await Landing.findAll({
      include: [
        { model: Company, as: "companies", attributes: ["name"] },
        {
          model: LandingImage,
          as: "landingImages",
          include: [
            { model: LandingButton, as: "landingButtons", required: false },
          ],
        },
      ],
      attributes: { exclude: ["companyId"] },
    });
    res.send(company);
  } catch (e) {
    res.status(430).send(e);
  }
};

// list pagenation
/**
 *
 let pageNum = req.query.page; // 요청 페이지 넘버
let offset = 0;

if(pageNum > 1){
  offset = 10 * (pageNum - 1);
}

models.post.findAll({
  // pagination
  offset: offset,
  limit: 10
})
 */

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
