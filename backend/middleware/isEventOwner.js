const Event =
    require("../models/Event");

const isEventOwner =
    async (
        req,
        res,
        next
    ) => {

        try {

            const event =
                await Event.findById(
                    req.params.id
                );

            if (!event) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Event not found"

                });
            }
            if (req.user.role === "student") {

                return res.status(403).json({

                    success: false,

                    message: "Students cannot manage events"

                });
            }

            if (

                req.user.role
                !==
                "superadmin"

                &&

                event.createdBy.toString()

                !==

                req.user.id

            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Not Event Owner"

                });
            }

            next();

        } catch (error) {

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });
        }
    };

module.exports =
    isEventOwner;