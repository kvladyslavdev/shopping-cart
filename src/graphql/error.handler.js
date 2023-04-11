const { GraphQLError } = require('graphql');
const { ApolloServerErrorCode } = require('@apollo/server/errors');
const { BadRequestExeption } = require('../exeptions/bad-request.exeption');
const { NotFoundExeption } = require('../exeptions/not-found.exeption');
const {
  InternalServerErrorExeption,
} = require('../exeptions/internal-server-error.exeption');

function errorHandler(error) {
  let errorCode;

  if (error instanceof BadRequestExeption) {
    errorCode = ApolloServerErrorCode.BAD_REQUEST;
  }
  if (error instanceof NotFoundExeption) {
    errorCode = 'ITEM_NOT_FOUND';
  }
  if (error instanceof InternalServerErrorExeption) {
    errorCode = ApolloServerErrorCode.INTERNAL_SERVER_ERROR;
  }

  throw new GraphQLError(error.message, {
    extensions: {
      code: errorCode || ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    },
  });
}

module.exports = { errorHandler };
