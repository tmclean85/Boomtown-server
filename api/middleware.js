import admin from '../database/firebase';



function firebaseAuthMiddleware(req, res, next) {
    if(process.env.NODE_ENV === 'development' && req.headers.origin === "http://localhost:5000"){
      return next();
    }
    const authorization = req.header('Authorization');
    if (authorization) {
        // let token = authorization.split(' ');
        admin.auth().verifyIdToken(authorization)
        .then((decodedToken) => {
            res.locals.user = decodedToken;
            next();
        })
        .catch(err => {
            res.sendStatus(401);
            next();
        });
    } else {
        console.log('Authorization header is not found');
        res.sendStatus(401);
        next();
    }
}

export default firebaseAuthMiddleware;