import express from "express";
import session from 'express-session';
import cors from "cors";
import multer from "multer";
import path from 'path';
import 'dotenv/config';
import * as vanLife from "./vanLife.js"
import cloudinary from "./utils/cloudinary.js"
import { getPublicId, bufferToDataUri } from "./utils/helpers.js"
import MongoStore from "connect-mongo"
// create an express application
const app = express();
const PORT = process.env.PORT || 3000;

// setup for image upload
const upload = multer();

// Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
app.use(
  cors({
    origin: 'https://vanlynk.onrender.com',
    credentials: true,
  })
);
// session config
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Keep your secret in environment variables
    resave: false,
    saveUninitialized: false, // Avoid saving uninitialized sessions
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // MongoDB connection string from environment variables
      ttl: 14 * 24 * 60 * 60, // Session expiration time (14 days here)
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 14 * 24 * 60 * 60 * 1000, // Set cookie expiration (14 days here)
    },
  })
);
// using JSON file from any client to Express
app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
})

// ROUTES - LOGIN/LOGOUT/REGISTER
app.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const result = await vanLife.authenticateUser(email, password, userType);
    const user = userType === "host" ? result.owners : result.renters;

    if (user) {
      if (userType === "host") {
        req.session.hostId = user._id.toString();
        console.log(req.session.hostId);
      } else if (userType === "renter") {
        req.session.renterId = user._id.toString();
      }

      res.json({ success: true, message: 'Login successful' })
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
})

app.get('/logout', async (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logout successful' });
})

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;

  try {
    const result = await vanLife.authenticateUser(email, password, userType);
    const user = userType === "host" ? result.owners : result.renters;

    if (user) {
      res.status(409).json({ success: false, message: 'User already exists with that email' })
      return;
    }

    let msg
    if (userType === "host") {
      msg = await vanLife.insertOwner(email, password, firstName, lastName)
    } else if (userType === "renter") {
      msg = await vanLife.insertRenter(email, password, firstName, lastName)
    }

    res.json({ success: true, message: msg })
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
})

// ROUTES - RENTALS
app.get('/rentals', async (req, res) => {
  try {
    let email = ""

    if (req.session.hostId) {
      const host = await vanLife.getHostById(req.session.hostId)
      email = host.email
    } else if (req.session.renterId) {
      const renter = await vanLife.getRenterById(req.session.renterId)
      email = renter.email
    }
    const result = await vanLife.getUserRentals(email)
    const rentals = result.rentals
    res.json({ rentals: rentals })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
})

app.post('/rentals/review', async (req, res) => {
  const { email, vanId, rating, description } = req.body;

  try {
    const msg = await vanLife.insertReview(email, vanId, rating, description);
    res.json({ success: true, message: msg })
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
})

// ROUTES - VANS
app.get('/vans', async (req, res) => {
  try {
    let result
    if (req.session.hostId) {
      result = await vanLife.getAvailableVansForHost(req.session.hostId)
    } else if (req.session.renterId) {
      result = await vanLife.getAvaliableVansForRenter()
    } else {
      result = await vanLife.getVans()
    }
    const vans = result.vans;
    res.json({ vans })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
})

app.get('/vans/:id', async (req, res) => {
  const vanId = req.params.id

  try {
    const result = await vanLife.getVanById(vanId)
    const van = result.vans;

    res.json({ van })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
})

app.post('/vans/:id/rent', async (req, res) => {
  const vanId = req.params.id

  let email = ""
  if (req.session.hostId) {
    const host = await vanLife.getHostById(req.session.hostId)
    email = host.email
  } else if (req.session.renterId) {
    const renter = await vanLife.getRenterById(req.session.renterId)
    email = renter.email
  }

  const { totalCost, startDate, endDate } = req.body

  try {
    const result = await vanLife.getVanById(vanId)
    const van = result.vans;
    if (!van) {
      res.status(404).json({ success: false, message: 'Van not found' })
      return;
    }
    const vanImage = van.image_url
    const msg = await vanLife.insertRental(vanId, vanImage, email, totalCost, startDate, endDate)
    res.json({ success: true, message: msg })
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
})

app.get('/host/vans', async (req, res) => {
  const hostId = req.session.hostId
  console.log(`the session object is ${JSON.stringify(req.session)}`)
  console.log(`the host id is:${hostId}`)

  try {
    const result = await vanLife.getHostVans(hostId)
    const hostVans = result.vans;
    console.log("the host vans are:")
    console.log(hostVans)
    if (!hostVans || hostVans.length === 0) {
      return res.json({ hostVans: [] });
    }
    res.json({ hostVans:hostVans })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
})

app.post('/host/vans', upload.single('imageFile'), async (req, res) => {
  const hostId = req.session.hostId

  console.log(`the owner id is ${hostId}`)
  const { name, type, price, description } = req.body

  try {
    const result = await vanLife.getVanByName(name)
    const van = result.vans;
    if (van) {
      res.status(409).json({ success: false, message: 'Van already exists with that name' })
      return;
    }

    const fileExtension = path.extname(req.file.originalname).toString();
    const dataUri = bufferToDataUri(req.file.buffer, req.file.mimetype);

    // Upload the image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(dataUri, {
      folder: "vans",
      format: fileExtension.slice(1)
    });
    const imageURL = cloudinaryResponse.secure_url;

    const msg = await vanLife.insertVan(hostId, name, type, price, description, imageURL)
    res.json({ success: true, message: msg })
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
})

app.get('/host/vans/rented', async (req, res) => {
  const hostId = req.session.hostId
  try {
    const result = await vanLife.getHostRentedVans(hostId)
    const hostRentedVans = result.rentals || [];

    res.json({ hostRentedVans })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
})

app.get('/host/vans/:id', async (req, res) => {
  const hostId = req.session.hostId
  const vanId = req.params.id

  try {
    const result = await vanLife.getHostVanById(hostId, vanId)
    const hostVan = result.vans;

    res.json({ hostVan })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
})

app.put('/host/vans/:id', upload.single('imageFile'), async (req, res) => {
  const vanId = req.params.id
  const { name, type, price, description, imageURL } = req.body

  try {
    const result = await vanLife.getVanByNameExcludingId(vanId, name)
    const van = result.vans;
    if (van) {
      res.status(409).json({ success: false, message: 'Van already exists with that name' })
      return;
    }

    let newImageURL = imageURL // default to old image url
    let oldImagePublicId;

    if (req.file) {
      // If a new file is uploaded, upload to Cloudinary and get the new URL
      const fileExtension = path.extname(req.file.originalname).toString();
      const dataUri = bufferToDataUri(req.file.buffer, req.file.mimetype);

      const cloudinaryResponse = await cloudinary.uploader.upload(dataUri, {
        folder: "vans",
        format: fileExtension.slice(1)
      });
      newImageURL = cloudinaryResponse.secure_url;

      // get id of old image since new file is uploaded
      oldImagePublicId = getPublicId(imageURL);
    }

    const msg = await vanLife.updateVan(vanId, name, type, price, description, newImageURL)

    // delete old image from cloudinary
    if (oldImagePublicId) {
      await cloudinary.uploader.destroy(`vans/${oldImagePublicId}`)
    }

    res.json({ success: true, message: msg })
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
})

app.delete('/host/vans/:id', async (req, res) => {
  const vanId = req.params.id

  try {
    // delete van image from cloudinary
    const result = await vanLife.getVanById(vanId);
    const van = result.vans;
    console.log(`the van is`)
    console.log(van);
    await cloudinary.uploader.destroy(`vans/${getPublicId(van.image_url)}`)

    const msg = await vanLife.deleteVan(vanId)

    res.json({ success: true, message: msg })
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
})

app.get('/host/reviews', async (req, res) => {
  const hostId = req.session.hostId
  try {
    const result = await vanLife.getHostReviews(hostId)
    const hostReviews = result.reviews;

    res.json({ hostReviews })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
})

// app listens to 3000 port
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});

//test connection
// connection.connect(err => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('Connected to the database');
// });
