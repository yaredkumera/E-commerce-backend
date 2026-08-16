import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import SignupModel from "../models/signUpModel.js";

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

async function googleLogin(req, res) {

    try {

        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const {
            sub,
            email,
            name,
            picture,
            email_verified,
        } = payload;

        if (!email_verified) {
            return res.status(401).json({
                success: false,
                message: "Google email is not verified",
            });
        }

        let user = await SignupModel.findOne({
            googleId: sub,
        });

        if (!user) {

            user = await SignupModel.findOne({
                email,
            });

            if (user) {

                if (user.googleId && user.googleId !== sub) {
                    return res.status(409).json({
                        success: false,
                        message: "This email is already linked to another Google account",
                    });
                }

                user.googleId = sub;
                user.profileImage = picture;

                await user.save();

            } else {

                user = await SignupModel.create({
                    fullName: name,
                    email,
                    googleId: sub,
                    profileImage: picture,
                    role: "user",
                });
            }
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Google login successful",

            data: {
                token,
                user: user.fullName,
                role: user.role,
            },
        });

    } catch (error) {

        console.error(
            "Google login error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Google authentication failed",
        });
    }
}

export default googleLogin;