const AWS = require("aws-sdk");

// data and the name of the file to be stored in aws
exports.uploadToS3 = (data, filename) => {
  const bucketName = "trackyourexpense007";
  const iAmUser = process.env.I_AM_USER;
  const iAmUserSecretKey = process.env.I_AM_USER_KEY;
  //create an object which talk with aws s3 which has all the authentication key;
  const awsObj = new AWS.S3({
    accessKeyId: iAmUser,
    secretAccessKey: iAmUserSecretKey,
  });

  //create parameters object to cnnect with which bucket file name to save
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: data,
    //ACL access control level
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    awsObj.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
};
