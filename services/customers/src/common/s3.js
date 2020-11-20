const AWS = require('aws-sdk');

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:4569',
    };
}

const s3Client = new AWS.S3(options);

const S3 = {
    async get(fileName, bucket) {
        const params = {
            Bucket: bucket,
            Key: fileName,
        };

        let data = await s3Client.getObject(params).promise();
        if (!data) throw Error(`Failed to get file ${fileName}, from ${bucket}`);
        if (/\.json$/.test(fileName)) data = JSON.parse(data.Body.toString());

        return data;
    },
    async write(data, fileName, bucket) {
        const params = {
            Bucket: bucket,
            Body: data,
            Key: fileName,
        };
        const newData = await s3Client.putObject(params).promise();
        if (!newData) throw Error('there was an error writing the file');
        return newData;
    },

    getUploadURL(key, bucket, contentType){
        const s3Params = {
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
            ACL: 'public-read'
        }
        return s3Client.getSignedUrl('putObject', s3Params);
    },

    getPreSignedItemURL(key, bucket){
        const signedUrlExpireSeconds = 60 * 60 //1 hour
        const params = {
            Bucket: bucket,
            Key: key,
            Expires: signedUrlExpireSeconds
        }
        console.log(params);
        return s3Client.getSignedUrl('getObject', params)
    }
};

module.exports = S3;