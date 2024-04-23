import jwt from "jsonwebtoken";
const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "You are not logged in!" });
  }
  const userDetails = await jwt.verify(token, "secretkey");
  req.user = userDetails;

  next();
};
export{
    isLoggedIn
}
