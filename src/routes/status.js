const config = require('config');

const Color = require('color');

const { last } = require('lodash');
const { ObjectId } = require('mongodb');

module.exports = mongo => async ctx => {
  const { Users, Projects, TimeEntries, Config } = mongo;
  const { params: { cubeId } } = ctx;

  const { colors } = await Config.findOne({
    key: config.get('colorsConfigKey')
  });

  const user = await Users.findOne({ cubeId });

  if (!user) {
    throw new Error('User not found');
  }

  await Users.updateOne(user, { $set: { lastCubeUpdate: Date.now() } });

  const lastTimeEntry = last(
    await TimeEntries.find({ userId: ObjectId(user._id) }).toArray()
  );

  if (lastTimeEntry && !lastTimeEntry.endTime) {
    const project = await Projects.findOne({
      _id: ObjectId(lastTimeEntry.projectId)
    });

    const color = Color(colors[project.color].dark);

    ctx.body = JSON.stringify({ ...color.object(), success: true }, null, 2);
    return;
  }

  ctx.body = JSON.stringify(
    { ...Color('black').object(), success: true },
    null,
    2
  );
};
