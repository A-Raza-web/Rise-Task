// src/models/Category.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isDefault: boolean;
  taskCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: mongoose.Types.ObjectId; // for future user authentication
  updateTaskCount(): Promise<void>;
}

export interface ICategoryModel extends Model<ICategory> {
  getDefaultCategories(): any[];
  initializeDefaults(): Promise<void>;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Category name must be at least 2 characters long'],
    maxlength: [30, 'Category name cannot exceed 30 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  color: {
    type: String,
    required: [true, 'Category color is required'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color']
  },
  icon: {
    type: String,
    trim: true,
    maxlength: [50, 'Icon name cannot exceed 50 characters']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  taskCount: {
    type: Number,
    default: 0,
    min: [0, 'Task count cannot be negative']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User' // for future user authentication
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance (name index is already created by unique: true)
categorySchema.index({ userId: 1 });
categorySchema.index({ isDefault: 1 });

// Static method to get default categories
categorySchema.statics.getDefaultCategories = function() {
  return [
    { name: 'General', description: 'General tasks', color: '#6c757d', icon: 'FaTasks', isDefault: true },
    { name: 'Work', description: 'Work-related tasks', color: '#007bff', icon: 'FaBriefcase', isDefault: true },
    { name: 'Personal', description: 'Personal tasks', color: '#28a745', icon: 'FaUser', isDefault: true },
    { name: 'Health', description: 'Health and fitness tasks', color: '#dc3545', icon: 'FaHeartbeat', isDefault: true },
    { name: 'Education', description: 'Learning and education tasks', color: '#ffc107', icon: 'FaGraduationCap', isDefault: true },
    { name: 'Shopping', description: 'Shopping and errands', color: '#17a2b8', icon: 'FaShoppingCart', isDefault: true },
    { name: 'Finance', description: 'Financial tasks', color: '#fd7e14', icon: 'FaDollarSign', isDefault: true },
    { name: 'Home', description: 'Home and household tasks', color: '#6f42c1', icon: 'FaHome', isDefault: true }
  ];
};

// Static method to initialize default categories
categorySchema.statics.initializeDefaults = async function() {
  const existingCount = await this.countDocuments({ isDefault: true });
  if (existingCount === 0) {
    const defaultCategories = this.getDefaultCategories();
    await this.insertMany(defaultCategories);
    console.log('Default categories initialized');
  }
};

// Method to update task count
categorySchema.methods.updateTaskCount = async function() {
  const Task = mongoose.model('Task');
  this.taskCount = await Task.countDocuments({ category: this.name });
  await this.save();
};

const Category = mongoose.model<ICategory, ICategoryModel>('Category', categorySchema);
export default Category;