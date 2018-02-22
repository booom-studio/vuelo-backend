const { first, last } = require('lodash');

module.exports = {
  // Queries
  currentTimeEntry: async (root, data, { user, mongo: { TimeEntries } }) => {
    // .sort({ startTime: -1 })
    const lastTimeEntry = last(
      await TimeEntries.find({ userId: user.id }).toArray()
    );

    if (lastTimeEntry && !lastTimeEntry.endTime) {
      return lastTimeEntry;
    }
    return null;
  },

  // Mutations
  async toggle(root, { projectId }, { user, mongo: { TimeEntries } }) {
    const timeEntries = await TimeEntries.find({ projectId }).toArray();

    const lastTimeEntry = last(timeEntries);

    if (lastTimeEntry && !lastTimeEntry.endTime) {
      const endTime = Date.now();

      await TimeEntries.update(lastTimeEntry, { $set: { endTime } });

      // TODO should we start anouther entry?

      return Object.assign({}, lastTimeEntry, {
        endTime
      });
    }

    const timeEntry = { projectId, userId: user.id, startTime: Date.now() };

    const { insertedIds } = await TimeEntries.insert(timeEntry);

    const newTimeEntry = Object.assign({ id: first(insertedIds) }, timeEntry);

    return newTimeEntry;
  },

  // Type
  TimeEntry: {
    id: ({ _id, id }) => _id || id
  }
};
