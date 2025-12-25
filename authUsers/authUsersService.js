const fs = require('fs').promises;
const path = require('path');
const pathDb = path.join(__dirname, '../db.json');
const hashService = require('../services/hashPasswordService');

const getAllUsers = async (req, res) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).authUsers;
        if (db.length === 0) {
            return [];
        } else if (!db) {
            throw new AuthUserExeption("users not found");
        }

        res.status(200).json(db);
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof AuthUserExeption) {
            res.status(502).json({ message: "users not found" });
        }
    }
}

const getUserById = async (id) => {

}

const addUser = async (req, res, user) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    console.log('data : ',data)
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }
    let db = JSON.parse(data).authUsers;
    let newId = db.length === 0 ? 1 : db.length + 1;
    hashService.hashPassword(user.password)
        .then(pwd => {
            db.push({
                id: newId,
                email: user.email,
                password: pwd,
                username: user.username,
                roles: user.roles
            });

            fs.writeFile(pathDb, JSON.stringify(db, null, 2));
            res.status(201).json({ message: 'user created successfully' });
        });
    console.log("data  : ", hashedPassword)


}

const updateUser = (id, user) => {

}

const deleteUser = (id) => {

}

module.exports = { getAllUsers, getUserById, addUser, deleteUser, updateUser };

