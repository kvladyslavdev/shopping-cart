class InternalServerErrorExeption extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
  }
}

module.exports = { InternalServerErrorExeption };
