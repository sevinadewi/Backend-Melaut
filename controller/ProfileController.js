import fs from "fs";
import path from "path";
import Users from "../models/UserModel.js";

const defaultProfilePhoto = "/uploads/default-photo.jpg"; // Path ke foto default

export const getProfile = async (req, res) => {
    // const { id } = req.params;
    // // Fetch user data from database (sesuaikan dengan model Anda)
    // const user = { id, name: "John Doe", phone: "123456789", profile_photo: defaultProfilePhoto };
    // res.json(user);
    try {
        const { id } = req.params;

        // Mengambil data user berdasarkan ID dari database
        const user = await Users.findOne({
            where: { id },
            attributes: ['id', 'name', 'phone', 'profile_photo']
        });

        // Jika user tidak ditemukan
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

         // Gunakan foto profil default jika tidak ada foto profil yang tersimpan
         const profilePhoto = user.profile_photo || defaultProfilePhoto;
        
        // res.json(user);
        res.json({
            id: user.id,
            name: user.name,
            phone: user.phone,
            profile_photo: profilePhoto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const updateProfile = async (req, res) => {
    // const { id } = req.params;
    // const { name, phone } = req.body;
    // // Update data user di database (sesuaikan dengan model Anda)
    // // res.json({ id, name, phone, message: "Profile updated successfully" });
    // const user = await Users.update(
    //     { name, phone },
    //     { where: { id } }
    // );
    try {
        const { id } = req.params;
        const { name, phone } = req.body;

        // Update user data di database
        const user = await Users.update(
            { name, phone },
            { where: { id } }
        );

        if (!user[0]) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        res.json({ id, name, phone, message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }

    

};

export const uploadProfilePhoto = async (req, res) => {
    // const { id } = req.params;
    // const file = req.file;

    // if (!file) {
    //     return res.status(400).json({ message: "No file uploaded" });
    // }

    // // Update path file foto di database (sesuaikan dengan model Anda)
    // const filePath = `/uploads/${file.filename}`;
    // res.json({ id, profile_photo: filePath, message: "Photo uploaded successfully" });
    const { id } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    // Update path file foto di database (sesuaikan dengan model Anda)
    const filePath = `/uploads/${file.filename}`;

    try {
        // Perbarui kolom profile_photo di database
        const result = await Users.update(
            { profile_photo: filePath },
            { where: { id } }
        );

        // Cek apakah update berhasil
        if (!result[0]) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.json({ id, profile_photo: filePath, message: "Photo uploaded successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

export const deleteProfilePhoto = async (req, res) => {
    // const { id } = req.params;
    // // Hapus file foto lama jika ada (sesuaikan dengan database Anda)
    // const filePath = path.join(process.cwd(), "uploads", "old-photo.jpg"); // Ganti dengan nama file sebenarnya
    // if (fs.existsSync(filePath)) {
    //     fs.unlinkSync(filePath);
    // }
    // res.json({ id, message: "Photo deleted successfully" });
    const { id } = req.params;

    try {
        // Ambil informasi user berdasarkan id
        const user = await Users.findOne({
            where: { id },
            attributes: ['profile_photo']
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profilePhoto = user.profile_photo;

        // Jika user memiliki foto profil, hapus file foto dari server
        if (profilePhoto && profilePhoto !== '/uploads/default-photo.jpg') {
            const filePath = path.join(process.cwd(), "uploads", profilePhoto.replace('/uploads/', ''));

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Update database untuk menghapus foto profil
        await Users.update({ profile_photo: null }, { where: { id } });

        res.json({ id, message: "Photo deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred while deleting photo" });
    }
};
