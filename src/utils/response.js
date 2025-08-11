export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      error.cause = error.cause || 500; 
      next(error);
    }
  };
};


export const globelErrorHandling = (error, req, res, next) => {
  return res.status(error.cause || 500).json({
    message: error.message || "Internal Server Error",
    stack: error.stack
  });
};


export const successResponse = ({res,message="Done", status= 200, data = {}} = {}) => {
    return res.status(status).json({message ,data})
}