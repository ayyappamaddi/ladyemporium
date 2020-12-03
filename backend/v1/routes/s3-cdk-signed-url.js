const { S3, CreateBucketCommand, DeleteObjectCommand, PutObjectCommand, DeleteBucketCommand } = require("@aws-sdk/client-s3");
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { createRequest } = require("@aws-sdk/util-create-request");
const { formatUrl } = require("@aws-sdk/util-format-url");
const fetch = require("node-fetch");

// Set the AWS Region
const REGION = "REGION";

// Set parameters
let signedUrl;
let response;

// Create a random name for the Amazon Simple Storage Service (Amazon S3) bucket
const BUCKET = `test-bucket-${Math.ceil(Math.random() * 10 ** 10)}`;
// Create a random name for object to upload to S3 bucket
const KEY = `test-object-${Math.ceil(Math.random() * 10 ** 10)}`;
const BODY = "BODY";
const EXPIRATION = 60 * 60 * 1000;

// Create Amazon S3 client object
const v3Client = new S3({ accessKeyId: 'AKIAJ5GZZ4MDHTO7GJOA',
  secretAccessKey: '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',
  region: 'eu-west-1' });

const run = async () => {
  try {
    //Create an S3 bucket
    console.log(`Creating bucket ${BUCKET}`);
    await v3Client.send(new CreateBucketCommand(BUCKET));
    console.log(`Waiting for "${BUCKET}" bucket creation...`);
  } catch (err) {
    console.log("Error creating bucket", err);
  }
  try {
    //Create an S3RequestPresigner object
    const signer = new S3RequestPresigner({ ...v3Client.config });
    // Create request
    const request =
        await createRequest(
      v3Client,
      new PutObjectCommand({ KEY, BUCKET })
    );
    // Define the duration until expiration of the presigned URL
    const expiration = new Date(Date.now() + EXPIRATION);

    // Create and format presigned URL
    signedUrl = formatUrl(await signer.presign(request, expiration));
    console.log(`\nPutting "${KEY}" using signedUrl with body "${BODY}" in v3`);
  } catch (err) {
    console.log("Error creating presigned URL", err);
  }
  try {
    // Upload the object to the Amazon S3 bucket using the presigned URL
    // Use node-fetch to make the HTTP request to the presigend URL
    // we use to upload the file

    response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "content-type": "application/octet-stream",
      },
      body: BODY,
    });
  } catch (err) {
    console.log("Error uploading object", err);
  }
  try {
    // Delete the object
    console.log(`\nDeleting object "${KEY}" from bucket`);
    await v3Client.send(new DeleteObjectCommand(BUCKET, KEY));
  } catch (err) {
    console.log("Error deleting object", err);
  }
  try {
    // Delete the bucket
    console.log(`\nDeleting bucket ${BUCKET}`);
    await v3Client.send(new DeleteBucketCommand(BUCKET));
  } catch (err) {
    console.log("Error deleting bucket", err);
  }
};
run();