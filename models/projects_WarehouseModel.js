const mongoose = require("mongoose");
const warehouseDB = mongoose.Schema(
  {
    ProjectName: {
      type: String,
      default: "object",
    },
    category: { type: mongoose.Types.ObjectId },
    comments: {
      type: String,
    },

    likes: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status:{
      type:String,
      enum:['pending','accepted','canceled'],
      default:'pending'
    },
    pdf: { type: String },
  },
  { timestamps: true }
);

const setPdfURL = (doc) => {
  if (doc.pdf) {
    const pdfUrl = `http://localhost:${process.env.PORT}/project/${doc.pdf}`;
    doc.pdf = pdfUrl;
  }
};

// findOne, findAll and update
warehouseDB.post("init", (doc) => {
  setPdfURL(doc);
});

// create
warehouseDB.post("save", (doc) => {
  setPdfURL(doc);
});

const warehousemodel = mongoose.model("projectwarehouse", warehouseDB);

module.exports = warehousemodel;
