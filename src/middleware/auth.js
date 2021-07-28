import jwt from "jsonwebtoken";

/**
 * @question What is middleware auth doing?
 * @answer Suppose you want to like a post, so to do that --> click the like button --> auth middleware (next) (permission granted) --> like controller
 */

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET);
      // When signed up
      req.userId = decodedData?.id;
      req.email = decodedData?.email;
    } else {
      decodedData = jwt.decode(token);
      // When Google signed in
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log({ ...error });
    res.status(401).json({ message: "Authentication Failed.", authenticated: false, type: "invalid_auth", severity: "error" });
  }
};

export default auth;
