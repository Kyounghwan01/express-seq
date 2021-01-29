const fs = require("fs").promises;
const landing = require("../controllers/landing.controller.js");

const moment = require("moment");
const db = require("../models");
const Landing = db.landings;
const LandingImage = db.landingImages;
const LandingButton = db.landingButtons;
const Op = db.Sequelize.Op;

exports.updateLanding = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isLanding = await Landing.findByPk(id);
    if (!isLanding) {
      return res.status(400).send({ message: "없는 랜딩 id입니다" });
    }

    const {
      startAt,
      expiredAt,
      type,
      createdBy,
      afccd,
      afcDtFlgcd,
      afcDtcd,
      title,
      updatedBy,
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
      updated_by: updatedBy,
    };

    await Landing.update(params, { where: { uuid: id } });

    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ isSuccess: false, message: e.errors });
  }
};

exports.updateLandingImage = async (req, res, next) => {
  const id = req.params.id;

  try {
    const imageAll = await LandingImage.findAll({
      where: { landing_uuid: id },
    });

    for (const el of imageAll) {
      const updateTarget = req.body.target.find((tar) => tar.id === el.id);
      if (updateTarget) {
        // 기존 이미지 수정
        await LandingImage.update(
          {
            type: updateTarget.type,
            data: updateTarget.landingImage,
            bottomButton: updateTarget.bottomButton,
          },
          { where: { id: el.id } }
        );
      } else {
        // 기존 이미지 제거
        await LandingImage.destroy({ where: { id: el.id } });
      }
    }

    for (const el of req.body.target) {
      if (!el.id) {
        // 새로운 이미지 추가
        const landingImageParams = {
          landingUuid: id,
          type: el.type,
          data: el.landingImage,
          bottomButton: el.bottomButton,
        };

        const landingImage = await LandingImage.create(landingImageParams);
        req.newLandingImgId = landingImage.id;
      }
    }

    next();
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.errors });
  }
};

exports.updateLandingButton = async (req, res) => {
  const params = {
    position_x: button.x,
    position_y: button.y,
    width: button.width,
    height: button.height,
    type: button.action.type,
    text: button.action.text,
  };
  try {
    for (const img of req.body.target) {
      if (img.id) {
        // req 버튼 리스트에 기존 id가 없다면 기존 id로 가진 버튼 삭제
        const buttonAll = await LandingButton.findAll({
          where: { landingImageId: img.id },
        });

        for (const el of buttonAll) {
          const updateTarget = img.buttonElement.find(
            (tar) => tar.id === el.id
          );
          if (!updateTarget) {
            await LandingButton.destroy({ where: { id: el.id } });
          }
        }

        // req의 버튼에 id가 없다면 새로운 버튼 생성
        for (const button of img.buttonElement) {
          if (!button.id) {
            await LandingButton.create({ ...params, landingImageId: img.id });
          } else {
            // id가 있다면 update
            const landingBtn = await LandingButton.findOne({
              where: { id: button.id },
            });
            if (!landingBtn) {
              return res.status(400).send({ message: "잘못된 버튼 id입니다" });
            }

            await landingBtn.update(params);
          }
        }
      } else {
        // landimg img가 새로운 값이면 무조건 버튼 생성
        for (button of img.buttonElement) {
          await LandingButton.create({
            ...params,
            landingImageId: req.newLandingImgId,
          });
        }
      }
    }

    const landing = await Landing.findByPk(req.params.id, {
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
    res.send({ isSuccess: true, data: landing });
  } catch (e) {
    res.status(500).json({ isSuccess: false, message: e.message });
  }
};
