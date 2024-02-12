const mongoose = require("mongoose");

const warehouseDB = mongoose.Schema(
  {   
    ProjectName: {
      type: String,
      default: "object",
    },
    category: { 
      type: mongoose.Types.ObjectId, ref: 'category'
    },
    description: {
      type: String,
      // required: true
    },

    comments: [{
      user: {  
        type : mongoose.Schema.Types.ObjectId, ref: 'User' 
      },
      content: {
        type: String,
        // required: true
      }
    }],

    likes: [{
      user: { 
        type : mongoose.Schema.Types.ObjectId, ref: 'User' 
      },
    }],
    numberOfLikes: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: String,
      default: Date.now(),
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
