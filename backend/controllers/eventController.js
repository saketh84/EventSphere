const Event = require('../models/Event');
const Registration = require('../models/Registration');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.WRONG_PASS_VAR
    }
});
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.getEventRegistrations = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        const registrations = await Registration.find({
            event: req.params.id
        })

            .sort({
                createdAt: -1
            });

        res.status(200).json(registrations);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.addEvent = async (req, res) => {
    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            title,
            description,
            date,
            venue,
            organizer,
            category,
            capacity,
            price
        } = req.body;
        const image = req.file ? req.file.path : "";

        if (!title || !venue || !date) {
            return res.status(400).json({
                success: false,
                message: "Title, venue and date are required"
            });
        }

        const newEvent =
            await Event.create({

                title,

                description,

                date,

                venue,

                organizer,

                category,

                capacity,

                price,

                image,
                createdBy: req.user.id
            });



        return res.status(201).json({
            success: true,
            event: newEvent
        });

    } catch (error) {

        console.error("ADD EVENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({});

        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.notifyParticipants = async (req, res) => {

    try {
        console.log("EMAIL_USER =", process.env.EMAIL_USER);
        console.log("EMAIL_PASS =", process.env.EMAIL_PASS);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const { id } = req.params;

        const { message } = req.body;

        const registrations =
            await Registration.find({
                event: id
            });

        if (!registrations.length) {

            return res.status(404).json({
                success: false,
                message: "No registrations found"
            });
        }

        for (const reg of registrations) {

            if (!reg.studentEmail) continue;

            try {

                await transporter.sendMail({

                    from:
                        process.env.EMAIL_USER,

                    to:
                        reg.studentEmail,

                    subject:
                        "Event Notification",

                    html:
                        `<p>${message}</p>`
                });

            } catch (mailError) {

                console.error(
                    `Failed to send mail to ${reg.studentEmail}`,
                    mailError.message
                );
            }
        }

        return res.status(200).json({

            success: true,

            message:
                "Notifications sent successfully"
        });

    } catch (err) {

        console.error(
            "Notification Error:",
            err
        );

        return res.status(500).json({

            success: false,

            error:
                err.message
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {

            title: req.body.title,

            description:
                req.body.description,

            date:
                req.body.date,

            venue:
                req.body.venue,

            organizer:
                req.body.organizer,

            category:
                req.body.category,

            price:
                req.body.price,

            capacity:
                req.body.capacity
        };

        if (req.file) {

            updateData.image = req.file.path;
        }


        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEvent =
    async (req, res) => {

        try {

            await Event.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({

                success: true,

                message:
                    "Event deleted successfully"
            });

        } catch (err) {

            res.status(500).json({

                success: false,

                error:
                    err.message
            });
        }
    };
exports.getMonitorData =
    async (req, res) => {

        try {

            let match = {};

            if (
                req.user.role !==
                "superadmin"
            ) {

                match = {

                    createdBy:
                        new mongoose.Types.ObjectId(req.user.id)
                };
            }


            const events =
                await Event.aggregate([

                    {
                        $match: match
                    },

                    {
                        $lookup: {

                            from:
                                "registrations",

                            localField:
                                "_id",

                            foreignField:
                                "event",

                            as:
                                "students"
                        }
                    }

                ]);

            res.status(200).json(events);

        } catch (err) {

            res.status(500).json({
                error:
                    err.message
            });
        }
    };