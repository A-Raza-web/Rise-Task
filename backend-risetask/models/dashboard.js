// models/dashboard.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  // ... (آپ کی موجودہ schema)
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    required: function() {
      return this.status === 'completed';
    }
  }
}, {
  timestamps: true
});

// یہ لائن تبدیل کریں
// پہلے چیک کریں کہ 'Task' ماڈل پہلے سے موجود ہے یا نہیں
// اگر ہے تو اسے استعمال کریں، ورنہ نیا بنائیں
const dashboard = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default dashboard;