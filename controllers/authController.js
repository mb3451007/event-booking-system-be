const loginSchema = require('../model/authModel.js')
const {generateToken} = require('../auth/jwt.js');
const bcrypt = require('bcrypt');
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await loginSchema.findOne({ username: username });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = generateToken(user);
                return res.status(200).json({ message: 'Login successfully', user: user, token: token });
            } else {
                return res.status(401).json({ message: 'Password not matched' });
            }
        } else {
            return res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const resetPassword = async(req,res) =>{
    console.log("here")
    const userId = req.params.userId;
    const {newPassword , confirmPassword} = req.body;
    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Both fields are required' });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await loginSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' })
    }
 catch (error) {
    console.log('message: Server error:', error)
    res.status(500).json({ message: 'Server error', error });
}

}
module.exports = { login ,resetPassword };
