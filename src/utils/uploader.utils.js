const { S3 } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "AKIASVVR44FB37J6VD77",
    secretAccessKey:
      process.env.AWS_SECRET_KEY || "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",
  },
  // secretAccessKey:
  //   process.env.AWS_SECRET_KEY || "TktT/TMQ08PlbcKH13TPHY3kLeEEr42LvB9ncGwx",
  // accessKeyId: process.env.AWS_ACCESS_KEY || "AKIASVVR44FB37J6VD77",
  region: "ap-south-1", // region of your buck
});
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "sole-sphere-products-storage",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

export default upload;
