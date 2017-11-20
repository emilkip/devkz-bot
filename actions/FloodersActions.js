const Flooders = require('../models/Flooders');

module.exports = {
  getTopFlooders: () => {
    return Flooders
      .find({})
      .then((flooders) => {
        console.log(flooders);
        return flooders;
      });
  }
};
