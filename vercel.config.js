module.exports = {
  generateBuildId: async () => {
    return 'my-build-id-' + Date.now();
  },
};