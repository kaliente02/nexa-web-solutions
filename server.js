"use strict";

require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 3000;

// ============================================================
// ENVIRONMENT CHECK
// ============================================================

if (!process.env.WEB3FORMS_ACCESS_KEY) {
    console.error(
        "ERROR: WEB3FORMS_ACCESS_KEY is missing from .env"
    );

    process.exit(1);
}

// ============================================================
// BASIC SERVER SECURITY
// ============================================================

// Hide Express from response headers.
app.disable("x-powered-by");

// Security headers.
// CSP is disabled because your frontend uses external
// Google Fonts / Bootstrap resources and inline functionality.
app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

// Limit JSON request body size.
app.use(
    express.json({
        limit: "20kb"
    })
);

// ============================================================
// FRONTEND
// ============================================================

const PUBLIC_DIR = path.join(__dirname, "public");

console.log("Frontend directory:");
console.log(PUBLIC_DIR);

// ------------------------------------------------------------
// STATIC FILES
// ------------------------------------------------------------
//
// Your folder should be:
//
// D:\Nexa
// │
// ├── server.js
// ├── .env
// ├── package.json
// │
// └── public
//     ├── index.html
//     ├── css
//     │   └── style.css
//     ├── js
//     │   └── script.js
//     └── images
//         ├── og-image.jpg
//         └── team
//             ├── kims-moring.jpg
//             ├── john-lesther-dy.jpg
//             ├── camila-kim-supremo.jpg
//             └── crystle-wyne-piodos.jpg
//
// Browser URLs:
//
// /
// /css/style.css
// /js/script.js
// /images/team/kims-moring.jpg
//
// NOT:
//
// /public/css/style.css
// /public/js/script.js
// ------------------------------------------------------------

app.use(
    express.static(PUBLIC_DIR, {
        extensions: ["html"],
        maxAge: "1h"
    })
);

// ============================================================
// CONTACT FORM RATE LIMIT
// ============================================================

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    // Maximum 5 contact submissions per IP
    // during a 15-minute window.
    limit: 5,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

// ============================================================
// CONTACT FORM API
// ============================================================

app.post(
    "/api/contact",
    contactLimiter,
    async (req, res) => {

        try {

            const {
                name,
                email,
                company,
                phone,
                message,
                website
            } = req.body || {};

            // ==================================================
            // HONEYPOT
            // ==================================================

            // Real users should never fill this field.
            // Bots often do.

            if (
                typeof website === "string" &&
                website.trim() !== ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request."
                });
            }

            // ==================================================
            // TYPE VALIDATION
            // ==================================================

            if (
                typeof name !== "string" ||
                typeof email !== "string"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name and email are required."
                });
            }

            // ==================================================
            // CLEAN INPUT
            // ==================================================

            const cleanName = name.trim();

            const cleanEmail = email.trim();

            const cleanCompany =
                typeof company === "string"
                    ? company.trim()
                    : "";

            const cleanPhone =
                typeof phone === "string"
                    ? phone.trim()
                    : "";

            const cleanMessage =
                typeof message === "string"
                    ? message.trim()
                    : "";

            // ==================================================
            // LENGTH VALIDATION
            // ==================================================

            if (
                cleanName.length < 2 ||
                cleanName.length > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid name."
                });
            }

            if (
                cleanEmail.length < 5 ||
                cleanEmail.length > 254
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email."
                });
            }

            if (cleanCompany.length > 150) {
                return res.status(400).json({
                    success: false,
                    message: "Company name is too long."
                });
            }

            if (cleanPhone.length > 30) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number is too long."
                });
            }

            if (cleanMessage.length > 3000) {
                return res.status(400).json({
                    success: false,
                    message: "Message is too long."
                });
            }

            // ==================================================
            // EMAIL VALIDATION
            // ==================================================

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(cleanEmail)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email."
                });
            }

            // ==================================================
            // SEND TO WEB3FORMS
            // ==================================================

            const web3Response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify({
                        access_key:
                            process.env.WEB3FORMS_ACCESS_KEY,

                        subject:
                            "New Inquiry — NEXA Website",

                        name: cleanName,

                        email: cleanEmail,

                        company: cleanCompany,

                        phone: cleanPhone,

                        message: cleanMessage
                    })
                }
            );

            const result = await web3Response.json();

            // ==================================================
            // WEB3FORMS ERROR
            // ==================================================

            if (
                !web3Response.ok ||
                !result.success
            ) {

                console.error(
                    "Web3Forms request failed:",
                    result
                );

                return res.status(502).json({
                    success: false,
                    message:
                        "Unable to send your inquiry right now."
                });
            }

            // ==================================================
            // SUCCESS
            // ==================================================

            return res.json({
                success: true,
                message: "Inquiry sent successfully."
            });

        } catch (error) {

            console.error(
                "Contact API error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Something went wrong. Please try again."
            });
        }
    }
);

// ============================================================
// UNKNOWN API ROUTES
// ============================================================

app.use("/api", (req, res) => {

    return res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });

});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {

    console.log("");
    console.log("==============================================");
    console.log(" NEXA SERVER");
    console.log("==============================================");
    console.log(` Local:    http://localhost:${PORT}`);
    console.log(` Frontend: ${PUBLIC_DIR}`);
    console.log("==============================================");
    console.log("");

});