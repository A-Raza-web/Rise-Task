import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
  tasksCompleted: {
    type: Number,
    required: true,
    default: 0,
  },
  productivityBoost: {
    type: Number,
    required: true,
    default: 0,
  },
  happyUsers: {
    type: Number,
    required: true,
    default: 0,
  },
});

const StatsModel = mongoose.model('Stats', StatsSchema);
export default StatsModel;
