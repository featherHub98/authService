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

const getUserById = async (req,res,id) => {
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
        let user = db.find(u => u.id === id);
        console.log("user found",user);
        res.status(200).json(user);
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof AuthUserExeption) {
            res.status(502).json({ message: "users not found" });
        }
    }
}

const addUser = async (req, res, user) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        console.log('data : ',data)
        if (!data) {
            return res.status(500).json({ message: 'no such file or directory' });
        }
        let db = JSON.parse(data);
        
        let users = db.authUsers;
        
        let newId = users.length === 0 ? 1 : users.length + 1;
        let hashedPwd = await hashService.hashPassword(user.password);
        console.log("user added",user);
        db.authUsers.push({
            id: newId,
            email: user.email,
            password: hashedPwd,
            username: user.username,
            roles: user.roles
        });

        await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
        res.status(201).json({ message: 'user created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
}

const updateUser =async (id, user,res) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        console.log('data : ',data)
        if (!data) {
            return res.status(500).json({ message: 'no such file or directory' });
        }
        let db = JSON.parse(data);
        if (!db.authUsers.find(u => u.id === id)) {
            return res.status(404).json({ message: 'User not found' });
        }
        let hashedPwd = await hashService.hashPassword(user.password);
        db.authUsers = db.authUsers.map(u => {
            if (u.id === id) {
                return {
                    id: id,
                    email: user.email,
                    password: hashedPwd,
                    username: user.username,
                    roles: user.roles
                };
            }
            return u;
        });
        console.log("user updated",db);
        await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
        res.status(201).json({ message: 'user created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
}

const deleteUser = async(req,res,id) => {
    try {
        let data = await fs.readFile(pathDb,'utf8')
        if (!data){
            return res.status(500).json({message:"db not found"})
        }
        let db = JSON.parse(data);
        let users = db.authUsers;
        if (!users.find(u => u.id === id)){
            return res.status(404).json({ message: 'User not found' });
        }
        db.authUsers= users.filter(u=>u.id !== id)
        console.log("user deleted",users);
        await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
        res.status(201).json({ message: 'user deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
}

module.exports = { getAllUsers, getUserById, addUser, deleteUser, updateUser };

