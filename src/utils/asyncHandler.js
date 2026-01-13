const asyncHandler = (requestHandlers) => (req, res, next) => {
    return (req,res,next)=>{
        Promise.resolve(requestHandlers(req, res, next)).catch((err)=>next(err));
    }
}

export {asyncHandler};