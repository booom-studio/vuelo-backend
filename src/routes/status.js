const config = require('config');

const Color = require('color');

const { last } = require('lodash');
const { ObjectId } = require('mongodb');

const colors = config.get('colors');

module.exports = mongo => async ctx => {
  const { Users, Projects, TimeEntries } = mongo;
  const { params: { cubeId } } = ctx;

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

    const color = Color(colors[project.color].base);

    ctx.body = JSON.stringify({ ...color.object(), success: true }, null, 2);
    return;
  }

  ctx.body = JSON.stringify(
    { ...Color('black').object(), success: true },
    null,
    2
  );
};
