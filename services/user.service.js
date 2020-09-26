const { User } = require('../models/user');
const { hashedPwd } = require('../helpers/utility');
const bcrypt = require('bcryptjs');
module.exports = {

    getAll: async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json(users);
    },
    newUser: async (req, res, next) => {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('user already registred');

        user = new User(req.body);
        user.creation_dt = Date.now();
        user.password = await hashedPwd(req.body.password);
        user.imageUrl = req.body.imageUrl;
        await user.save();

        res.status(201).json((user));
    },
   
    getUser: async (req, res, next) => {

        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
},

    // PATCH || PUT
    updateUser: async (req, res, next) => {
        const newUSer = req.body
        if (newUSer.password) {
            const userCheck = await User.findById(req.params.userId);
            const validpwd = await bcrypt.compare(newUSer.password, userCheck.password);
            if (!validpwd) {
                newUSer.password = await hashedPwd(newUSer.password);
            }
            const user = await User.findByIdAndUpdate(req.params.userId, newUSer);
        }
        else {
            const user = await User.findByIdAndUpdate(req.params.userId, newUSer);
        }
        res.status(200).json('success');
    },

    deleteUser: async (req, res, next) => {
        const user = await User.findOneAndDelete(req.params.userId).exec(function (err, item) {
            if (err) {
                return res.json({ success: false, msg: 'Cannot remove item' });
            }
            if (!item) {
                return res.status(404).json({ success: false, msg: 'User not found' });
            }
            res.json({ success: true, msg: 'User deleted.' });
        });
    },
    deleteAll: async (req, res, next) => {
        const users = await User.deleteMany();
        res.status(200).json('success');
    },

}
