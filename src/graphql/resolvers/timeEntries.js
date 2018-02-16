module.exports = {
  // Queries
  currentTimeEntry: async (root, { userId }, { mongo: { TimeEntries } }) => {
    console.log('hai?', userId);
    const x = {
      id: userId,
      projectId: 'projectId',
      startTime: 1234
    };

    console.log(x);

    return await x;
  },

  // Type
  TimeEntry: {
    id: ({ _id, id }) => _id || id
  }
};
