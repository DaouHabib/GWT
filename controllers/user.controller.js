const router = require('express-promise-router')();
const usersService = require('../services/user.service');



router.route('/')
    .get(usersService.getAll)
    .post(usersService.newUser)
    .delete(usersService.deleteAll)

router.route('/:userId')
    .get(usersService.getUser)
    .put(usersService.updateUser)
    .delete(usersService.deleteUser)
    
module.exports = router;