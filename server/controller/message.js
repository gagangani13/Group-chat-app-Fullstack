const database = require("../database/database");
const { Message } = require("../model/message");
const { User } = require("../model/user");

const sendMessage = async (req, res, next) => {
  const t = await database.transaction();
  try {
    const userName = await User.findOne(
      { where: { id: req.userId } },
      { transaction: t }
    );
    const createMessage = await Message.create(
      {
        messages: req.body.message,
        name: userName.name,
        UserId: req.userId,
        groupId: req.body.groupId,
        time:req.body.time
      },
      { transaction: t }
    );
    try {
      await t.commit();
      res.send({ ok: true, message: createMessage });
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  } catch (error) {
    await t.rollback();
    res.send({ ok: false, error: "Not sent" });
  }
};

const getMessages = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;
    const countMsgs = await Message.count({ where: { groupId } });
    const latestOffset = countMsgs > 10 ? countMsgs - 10 : 0;
    let reqOffset = Number(req.query.offset);

    if (reqOffset < 0 || countMsgs <= 10) {
      reqOffset = 0;
    } else if (reqOffset > countMsgs || !reqOffset) {
      reqOffset = latestOffset;
    }
    const nextOffset =
      reqOffset + 10 >= countMsgs ? latestOffset : reqOffset + 10;
    const oldOffset = reqOffset - 10 <= 0 ? 0 : reqOffset - 10;
    try {
      const getMsgs = await Message.findAll({
        where: { groupId },
        attributes: ["name", "messages","time"],
        offset: reqOffset,
        limit: 10,
      });
      res.send({
        ok: true,
        messages: getMsgs,
        latestOffset: latestOffset,
        nextOffset: nextOffset,
        oldOffset: oldOffset,
        currOffset: reqOffset,
        countMsgs,
      });
    } catch (error) {
      throw new Error();
      // res.send({countMsgs})
    }
  } catch (error) {
    res.send({ ok: false, error: "Error in backend" });
  }
};

module.exports = { sendMessage, getMessages };
