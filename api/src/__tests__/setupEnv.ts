process.env.NODE_ENV = "test";
process.env.AWS_ACCESS_KEY_ID ||= "test-access-key";
process.env.AWS_SECRET_ACCESS_KEY ||= "test-secret-key";
process.env.AWS_S3_BUCKET_NAME ||= "test-bucket";
process.env.COGNITO_USER_POOL_ID ||= "us-east-1_testpool";
process.env.COGNITO_CLIENT_ID ||= "test-client-id";
