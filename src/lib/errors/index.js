class GenericError extends Error {
  statusCode;

  constructor (message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ServiceError extends GenericError {
  static statusCode = 400;
}

class NotFoundError extends GenericError {
  static statusCode = 404;

  constructor (message) {
    super(message, NotFoundError.statusCode);
  }
}

class ValidationError extends GenericError {
  errors;

  static statusCode = 422;

  constructor (errors = []) {
    const message = `${errors[0]}`;
    super(message, ValidationError.statusCode);
    this.errors = errors;
  }
}

class AuthenticationError extends GenericError {
  static statusCode = 401;

  constructor (message) {
    super(message, AuthenticationError.statusCode);
  }
}

class AuthorizationError extends GenericError {
  static statusCode = 403;

  constructor (message = 'you are not authorized to perform this action') {
    super(message, AuthorizationError.statusCode);
  }
};

module.exports = {
  GenericError,
  ServiceError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError
};
