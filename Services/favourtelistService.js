const usermodel = require("../models/UserModel");

exports.addprojectTofavouritelist = async (req, res, next) => {
  const user = await usermodel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { favourtelist: req.body.projectId },
    },
    { new: true }
  );

  res
    .status(200)
    .json({
      status: "success",
      message: "product added successfully to your favourite",
      data: user.wishlist,
    });
};


exports.removeProjectFromfavouritelist = async (req, res, next) => {
    const user = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { favourtelist: req.body.projectId },
      },
      { new: true }
    );
  
    res
      .status(200)
      .json({
        status: "success",
        message: "product removed successfully from your wishlist",
        data: user.wishlist,
      });
  };

  exports.getLoggedUserfavouritelist = async (req, res, next) => {
    const user = await usermodel.findById(req.user._id).populate('favourtelist');
        console.log(user.favourtelist);
    res.status(200).json({
      status: 'success',
      results: user.favourtelist.length,
      data: user.favourtelist,
    });
  };