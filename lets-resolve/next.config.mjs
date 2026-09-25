/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lets-resolve.s3.us-east-1.amazonaws.com"],
  },
  // aws-amplify/auth/server (used by Server Actions/Components for the
  // caller's Cognito token) drags in AWS SDK v3's @smithy/@aws-crypto
  // packages. Bundling those into the Node.js server compile trips a
  // webpack export-resolution bug ("Cannot get final name for export
  // 'fromUtf8'") in their dual ESM/CJS build; since this is genuinely
  // server-only code, excluding it from bundling and letting Node resolve
  // it directly from node_modules at runtime sidesteps the bug entirely.
  experimental: {
    serverComponentsExternalPackages: ["aws-amplify", "@aws-amplify/adapter-nextjs"],
  },
};

export default nextConfig;
