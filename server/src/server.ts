import "dotenv/config";
import "reflect-metadata";
import app from "./app";
import aws from "aws-sdk";
import { createConnection } from "typeorm";
import { ormconfig } from "./configs";

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

(async () => {
  try {
    await createConnection(ormconfig);

    const PORT =
      process.env.NODE_ENV === "production" ? process.env.PORT : 8080;

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
