function fetchUser(id, exludeFields = { password: false, resetToken: false, resetTokenExp: false }) {
    return User.findById(id)
        .select(exludeFields)
        .exec();
}