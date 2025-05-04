const express = require("express");
const session = require("express-session");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesión
app.use(session({
  secret: 'mi-clave-supersecreta',
  resave: false,
  saveUninitialized: true
}));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "carrito.html");
});

// Página de login
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "login.html");
});

// Procesar login (simulado)
app.post("/login", (req, res) => {
  const { email } = req.body;
  if (email) {
    req.session.user = email;
    res.redirect("/");
  } else {
    res.send("Correo requerido.");
  }
});

// Ruta para crear sesión de pago (protegida)
app.post("/create-checkout-session", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Debes iniciar sesión" });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal", "link"],
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "Producto ejemplo" },
        unit_amount: 2000,
      },
      quantity: 1,
    }],
    success_url: "http://localhost:4242/success.html",
    cancel_url: "http://localhost:4242/cancel.html",
  });

  res.json({ url: session.url });
});

app.listen(4242, () => console.log("Servidor en http://localhost:4242"));

