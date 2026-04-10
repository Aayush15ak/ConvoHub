import jwt from 'jsonwebtoken';


export const generateToken = (UserId,res) => {
    const token = jwt.sign({ id: UserId }, process.env.JWT_SECRET,{expiresIn: '7d'});
    res.cookie('jwt', token, {
        httpOnly: true, // client will get token only through http request, not accessible via js
        maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7 days
        sameSite : 'strict', // prevent CSRF
        secure : process.env.NODE_ENV === 'production' ? true : false// set secure flag in production

    })
    return token;
}