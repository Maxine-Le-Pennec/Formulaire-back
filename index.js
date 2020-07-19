require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(formidable());

/* MAILGUN CONFIGURATION */
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
("sandboxc569632c3b0e416492d018005d4661b6.mailgun.org"); /* VOTRE DOMAINE SANDBOX */
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.post("/", (req, res) => {
  const { firstname, lastname, mail, subject, message } = req.fields;
  res.status(200).json(firstname, lastname, mail, subject, message);

  const data = {
    from: `${firstname} ${lastname} <${mail}>`,
    to:
      "lepennec.marine@gmail.com" /* EMAIL AVEC LAQUELLE VOUS VOUS ÊTES ENREGISTRÉS SUR MAILGUN */,
    subject: "nouveau formulaire ",
    text: "un nouveau message a été envoyé",
  };
  /* ENVOI DE L'OBJET VIA MAILGUN */
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.json(body);
    }
    res.status(401).json(error);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
