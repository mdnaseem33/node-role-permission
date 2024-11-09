const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            if (!res.headersSent) {
                console.error(error.stack);
                const acceptHeader = req.get('Accept');
                if (req.originalUrl.startsWith('/api') || (acceptHeader && acceptHeader.includes('application/json'))) {
                    return res.response("something went wrong", 500);
                }else{
                    return res.render("servererror");
                }
            } else {
                console.error('Response already sent. Unable to send error:', error);
            }
        });
    };
};

module.exports = asyncHandler;