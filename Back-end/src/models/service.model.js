const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // duración en minutos
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: ['corte', 'barba', 'combo', 'tratamiento', 'otro']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 