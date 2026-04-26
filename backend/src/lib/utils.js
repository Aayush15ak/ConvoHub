import jwt from 'jsonwebtoken';


export const generateToken = (UserId,res) => {
    const { JWT_SECRET } = process.env;
    if(!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({ id: UserId }, JWT_SECRET,{expiresIn: '7d'});
    res.cookie('jwt', token, {
        httpOnly: true, // client will get token only through http request, not accessible via js
        maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7 days
        sameSite: 'none',
        secure : true // set secure flag in production

    })
    return token;
}