// 컴페니가 없다면 컴페니 생성하고 나온 id를 기반으로 다시 생성
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
  // return Company.findAll()
  //   .then(company => {
  //     res.send(company);
  //     return company;
  //   })
  //   .catch(err => {
  //     res.send(err);
  //   });
  // const com = await Company.findAll();
  // res.send(com);
  try {
    const company = await Company.findAll({
      where: { name: req.query.name },
      // defaults: { name: req.body.companyName },
    });
    res.send(company);
  } catch (e) {
    res.send(e);
  }
};

exports.asdc = async (req, res) => {
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

exports.createLanding = async (req, res) => {
  res.send(1);
};

// select.findOrCreate = (data, callback) => {
//   return user
//     .findOrCreate({
//       where: { user_id: data },
//       defaults: { password: "5555" },
//     })
//     .spread((user, create) => {
//       user && callback(user);
//       create && callback(create);
//     })
//     .catch((err) => {
//       callback(err);
//     });
// };

// post landing

// get landing

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

exports.createLanding = (req, res) => {};
