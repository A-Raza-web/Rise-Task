// src/controllers/taskController.ts
import { Request, Response } from 'express';
import Task from '../models/taskModel';

export const createTask = async (req: Request, res: Response) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Task creation failed', error });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Fetching tasks failed', error });
  }
};
