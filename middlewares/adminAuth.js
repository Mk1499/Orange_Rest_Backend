const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      throw "Un Authenticated Request";
    }
    const decodedToken = jwt.verify(token, process.env.tokenSecret).userData;

    console.log("AUTH : ", decodedToken);
    const userType = decodedToken.type;
    if (!userType || userType !== "admin") {
      throw "Un Authorized Request";
    } else {
      next();
    }
  } catch (error) {
    console.log("err : ", error);

    res.status(401).send({
      error
    });
  }
};
