import Users from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import { where } from "sequelize";
export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','phone']
        });
        
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ msg: "Failed to fetch users" });
    }
};

export const Register = async(req, res) => {
    const {name, phone, password, confPassword} = req.body;
    
    console.log('Request body:', req.body);

    if (!name || !phone || !password || !confPassword) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    

    
    if(password != confPassword) return res.status(400).json({msg:"PAssword dan confirm tidak coocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const hashConfPassword = await bcrypt.hash(confPassword, salt);
    try {
        await Users.create({
            name: name,
            phone:phone,
            password:hashPassword,
            confPassword:hashConfPassword,
        });
        res.json({msg:"Register Berhasil"});

    } catch(error) {
        console.log(error);
        res.status(500).json({ msg: "Server error during registration" });
    }
};

// export const Login = async(req, res) => {
//     try {
//         const user = await Users.findAll({
//             where:{
//                 phone:req.body.phone
//             }
//         });
//         if (!phone || !password) {
//             return res.status(400).json({ msg: "Phone and password are required" });
//         }
//         const match = await bcrypt.compare(req.body.password, user[0].password);
//         if(!match) return res.status(400).json({msg:"wrong password"});
//         const userId = user[0].id;
//         const name = user[0].name;
//         const phone = user[0].phone;
//         const accessToken = jwt.sign({userId, name, phone}, process.env.ACCESS_TOKEN_SECRET,{
//             expiresIn:'20s'
//         });
//         const refreshToken = jwt.sign({userId, name, phone}, process.env.REFRESH_TOKEN_SECRET,{
//             expiresIn:'1d'
//         });
//         await Users.update({refresh_token: refreshToken},{
//             where:{
//                 id:userId
//             }
//         });
//         res.cookie('refreshToken', refreshToken , {
//             httpOnly:true,
//             maxAge:24 * 60 * 60 * 1000,
            
//         });
//         res.json({accessToken});
    
//     } catch (error) {
//         res.status(404).json({msg:"Nomor telepon tidak ditemukan"});
//     }
// }

export const Login = async (req, res) => {
    const { phone, password } = req.body;

    // Validasi input
    if (!phone || !password) {
        return res.status(400).json({ msg: "Phone and password are required" });
    }

    try {
        // Cari pengguna berdasarkan nomor telepon
        const user = await Users.findOne({
            where: { phone: phone }
        });

        if (!user) {
            return res.status(404).json({ msg: "Phone number not found" });
        }

        // Periksa kecocokan password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Wrong password" });
        }

        // Buat token
        const userId = user.id;
        const name = user.name;
        const accessToken = jwt.sign({ userId, name, phone }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '10m'
        });
        const refreshToken = jwt.sign({ userId, name, phone }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        // Simpan refresh token ke database
        await Users.update({ refresh_token: refreshToken }, {
            where: { id: userId }
        });

        // Set cookie untuk refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
            msg: "Login berhasil",
            userId: userId,
            accessToken: accessToken});
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ msg: "Server error during login" });
    }
};

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where:{
                refresh_token:refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id;
        //update refresh token di db
        await Users.update({refresh_token:null}, {
            where:{
                id:userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
}