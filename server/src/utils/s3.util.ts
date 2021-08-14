import multer from "multer";
import multerS3 from "multer-s3";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3();
const userImageBucket = "term-project-user-image";
const coinImageBucket = "term-project-coin-image";

const uploadUserImage = multer({
  storage: multerS3({
    s3,
    bucket: userImageBucket,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, `${req.user.id} - ${file.originalname}`);
    },
    acl: "public-read",
  }),
});

const uploadCoinImage = multer({
  storage: multerS3({
    s3,
    bucket: coinImageBucket,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, file.originalname);
    },
    acl: "public-read",
  }),
});

const deleteUserImage = async (key: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    s3.deleteObject(
      {
        Bucket: userImageBucket,
        Key: key,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const deleteCoinImage = async (key: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    s3.deleteObject(
      {
        Bucket: coinImageBucket,
        Key: key,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

export { uploadUserImage, uploadCoinImage, deleteUserImage, deleteCoinImage };
