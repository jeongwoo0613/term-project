"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const orm_config_1 = __importDefault(require("./configs/orm.config"));
const app_1 = __importDefault(require("./app"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
(async () => {
    try {
        await (0, typeorm_1.createConnection)(orm_config_1.default);
        const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 8080;
        app_1.default.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
})();
