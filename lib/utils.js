var Utils = {
  checkEnv: function (env) {

    if (env.PACK_USER && env.PACK_PASS && env.PACK_REPO) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Utils;
