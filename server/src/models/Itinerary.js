const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  dayNumber: { type: Number },
  date: { type: String },
  morning: {
    activities: [{ type: String }],
    notes: { type: String, default: '' },
  },
  afternoon: {
    activities: [{ type: String }],
    notes: { type: String, default: '' },
  },
  evening: {
    activities: [{ type: String }],
    notes: { type: String, default: '' },
  },
  transport: { type: String, default: '' },
  meals: {
    breakfast: { type: String, default: '' },
    lunch: { type: String, default: '' },
    dinner: { type: String, default: '' },
  },
  estimatedExpense: { type: String, default: '' },
  notes: { type: String, default: '' },
});

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    destination: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    flights: [
      {
        airline: { type: String, default: '' },
        flightNumber: { type: String, default: '' },
        departureAirport: { type: String, default: '' },
        arrivalAirport: { type: String, default: '' },
        departureTime: { type: String, default: '' },
        arrivalTime: { type: String, default: '' },
        date: { type: String, default: '' },
      },
    ],
    hotels: [
      {
        hotelName: { type: String, default: '' },
        address: { type: String, default: '' },
        checkIn: { type: String, default: '' },
        checkOut: { type: String, default: '' },
        confirmationNumber: { type: String, default: '' },
      },
    ],
    trains: [
      {
        departureStation: { type: String, default: '' },
        destinationStation: { type: String, default: '' },
        seatNumber: { type: String, default: '' },
        boardingTime: { type: String, default: '' },
      },
    ],
    activities: [{ type: String }],
    aiSummary: {
      type: String,
      default: '',
    },
    itineraryDays: [itineraryDaySchema],
    recommendations: {
      restaurants: [{ type: String }],
      attractions: [{ type: String }],
      packingTips: [{ type: String }],
      weatherInfo: { type: String, default: '' },
      emergencyContacts: [{ type: String }],
      localTransport: { type: String, default: '' },
      estimatedBudget: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['draft', 'generated', 'published'],
      default: 'draft',
    },
    shareCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    sourceFiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UploadedFile',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for search
itinerarySchema.index({ title: 'text', destination: 'text' });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
