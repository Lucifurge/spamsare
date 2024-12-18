const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

// Supported domains
const domains = ["com", "net", "org", "rteet"];

// Generate email using 1secmail API
async function generateEmail() {
    const randomUser = Math.random().toString(36).substring(2, 15);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${randomUser}@1secmail.${domain}`;
}

// Function to create Facebook account
async function createFacebookAccount(firstName, middleName, lastName, totalAccounts) {
    const accounts = [];
    for (let i = 0; i < totalAccounts; i++) {
        const email = await generateEmail();
        const password = Math.random().toString(36).substring(2, 10) + "!A1";

        const browser = await puppeteer.launch({ headless: true }); // Set to false to see the browser
        const page = await browser.newPage();

        try {
            await page.goto("https://www.facebook.com/r.php");

            // Fill the form
            await page.type("#u_0_n", firstName, { delay: 100 });
            if (middleName) await page.type("#u_0_p", middleName, { delay: 100 });
            await page.type("#u_0_r", lastName, { delay: 100 });
            await page.type("#u_0_u", email, { delay: 100 });
            await page.type("#u_0_x", email, { delay: 100 });
            await page.type("#password_step_input", password, { delay: 100 });

            // Set birthdate
            await page.select("#day", "1");
            await page.select("#month", "1");
            await page.select("#year", "2000");

            // Select gender
            await page.click("input[name='sex'][value='2']"); // 1 for male, 2 for female

            // Submit the form
            await page.click("#u_0_15");
            await page.waitForTimeout(5000);

            accounts.push({ email, password });
        } catch (error) {
            console.log(`Failed to create account ${i + 1}:`, error);
        } finally {
            await browser.close();
        }
    }
    return accounts;
}

// Route for the form
app.get("/", (req, res) => {
    res.render("index");
});

// Route to handle form submission
app.post("/create", async (req, res) => {
    const { firstName, middleName, lastName, totalAccounts } = req.body;

    try {
        const accounts = await createFacebookAccount(
            firstName,
            middleName || "",
            lastName,
            parseInt(totalAccounts)
        );
        res.render("index", { accounts });
    } catch (error) {
        res.send(`Error: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
