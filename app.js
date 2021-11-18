const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./user");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

const mongo_uri = "mongodb://localhost/comic-store";

mongoose.connect(mongo_uri, function (err) {
	if (err) {
		throw err;
	} else {
		console.log(`Conectado correctamente a: ${mongo_uri}`);
	}
});

app.post("/register", (req, res) => {
	const { email, password } = req.body;

	const user = new User({ email, password });

	user.save((err) => {
		if (err) {
			res.status(500).send("Error al registrar al usuario");
		} else {
			res.status(200).send("Usuario registrado");
		}
	});
});

app.post("/authenticate", (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email }, (err, user) => {
		if (err) {
			res.status(500).send("Error al autenticar al usuario");
		} else if (!user) {
			res.status(404).send("El usuario no existe");
		} else {
			user.isCorrectPassword(password, (err, result) => {
				if (err) {
					res.status(500).send("Error al autenticar");
				} else if (result) {
					res.status(200).send("Usuario autenticado correctamente");
				} else {
					res.status(500).send("Usuario y/o contraseña incorrecto");
				}
			});
		}
	});
});

app.listen(3000, () => {
	console.log("server started in port: 3000");
});

module.exports = app;
