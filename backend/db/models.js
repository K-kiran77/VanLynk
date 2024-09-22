import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true }
});

const vanSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true, min: 1 },
  description: { type: String, required: true },
  image_url: { type: String, required: true },
  type: { type: String, enum: ['simple', 'rugged', 'luxury'], required: true }
});

const renterSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true }
});

const rentalSchema = new mongoose.Schema({
  van_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Van', required: true },
  image_url: { type: String, required: true },
  email: { type: String, required: true },
  total_cost: { type: Number, required: true },
  placed_date: { type: Date, required: true, default: Date.now },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true }
});

const reviewSchema = new mongoose.Schema({
  email: { type: String, required: true },
  van_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Van', required: true },
  date: { type: Date, required: true, default: Date.now },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true }
});

const Owner = mongoose.model('Owner', ownerSchema, 'owners');
const Van = mongoose.model('Van', vanSchema, 'vans');
const Renter = mongoose.model('Renter', renterSchema, 'renters');
const Rental = mongoose.model('Rental', rentalSchema, 'rentals');
const Review = mongoose.model('Review', reviewSchema, 'reviews');

export { Owner, Van, Renter, Rental, Review };