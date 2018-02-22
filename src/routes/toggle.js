const { last, first } = require('lodash');

const { ObjectId } = require('mongodb');

module.exports = mongo => async ctx => {
  const { Users, TimeEntries } = mongo;
  const { params: { cubeId } } = ctx;

  const user = await Users.findOne({ cubeId });

  if (!user) {
    throw new Error('User not found');
  }

  const timeEntries = await TimeEntries.find({
    userId: ObjectId(user._id)
  }).toArray();

  const lastTimeEntry = last(timeEntries);

  console.log({ lastTimeEntry });

  if (lastTimeEntry && !lastTimeEntry.endTime) {
    const endTime = Date.now();

    await TimeEntries.update(lastTimeEntry, { $set: { endTime } });

    // TODO should we start anouther entry?

    ctx.body = JSON.stringify(
      Object.assign(
        {},
        lastTimeEntry,
        {
          endTime
        },
        null,
        2
      )
    );

    return;
  }

  if (lastTimeEntry) {
    const timeEntry = {
      projectId: lastTimeEntry.projectId,
      userId: lastTimeEntry.userId,
      startTime: Date.now()
    };

    const { insertedIds } = await TimeEntries.insert(timeEntry);

    const newTimeEntry = Object.assign({ id: first(insertedIds) }, timeEntry);

    ctx.body = JSON.stringify(newTimeEntry, null, 2);
    return;
  }

  return;
};
