"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoinImage = exports.deleteUserImage = exports.uploadCoinImage = exports.uploadUserImage = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const s3 = new s3_1.default();
const userImageBucket = "term-project-user-image";
const coinImageBucket = "term-project-coin-image";
const uploadUserImage = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
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
exports.uploadUserImage = uploadUserImage;
const uploadCoinImage = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
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
exports.uploadCoinImage = uploadCoinImage;
const deleteUserImage = async (key) => {
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: userImageBucket,
            Key: key,
        }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.deleteUserImage = deleteUserImage;
const deleteCoinImage = async (key) => {
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: coinImageBucket,
            Key: key,
        }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.deleteCoinImage = deleteCoinImage;
