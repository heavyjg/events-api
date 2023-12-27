export default {
  plugins: ["serverless-offline", "serverless-dynamodb"],
  custom: {
    "serverless-dynamodb": {
      port: 8000,
      docker: false,
    },
  },
};
