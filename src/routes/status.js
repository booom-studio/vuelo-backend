const { last } = require('lodash');

const Color = require('color');

const { ObjectId } = require('mongodb');

module.exports = mongo => async ctx => {
  const { Users, Projects, TimeEntries } = mongo;
  const { params: { cubeId } } = ctx;

  const user = await Users.findOne({ cubeId });

  if (!user) {
    throw new Error('User not found');
  }

  const lastTimeEntry = last(
    await TimeEntries.find({ userId: ObjectId(user._id) }).toArray()
  );

  if (lastTimeEntry && !lastTimeEntry.endTime) {
    const project = await Projects.findOne({
      _id: ObjectId(lastTimeEntry.projectId)
    });

    const color = Color(project.color);

    ctx.body = JSON.stringify({ ...color.object(), success: true }, null, 2);
    return;
  }

  ctx.body = JSON.stringify(
    { ...Color('black').object(), success: true },
    null,
    2
  );
};
