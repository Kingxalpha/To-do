require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3500;
const pass = process.env.password;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
const connectionString = `mongodb+srv://360Dev:${pass}@paytonaira.j0xe8sl.mongodb.net/?retryWrites=true&w=majority`
async function TodoDB() {
    await mongoose.connect(connectionString);
    console.log("TodoDB connected Successfully");
}

const todoSchema = new mongoose.Schema({
    todo: String,
});

const todoModel = mongoose.model("todo", todoSchema);

// Get all tasks

app.get("/todo", async(req, res)=>{
    try {
        const todo = await todoModel.find();
        res.json(todo);
    } catch (error) {
        console.error('Error getting todo:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Create a new task

app.post("/todo", async(req, res) => {
    const {todo} = req.body;
    app.use(express.json());

    try {
        const newTodo = await todoModel.create({
            todo
        });

        console.log(newTodo);
        res.json({ msg: "New todo task added successfully", task : newTodo.todo});


    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error while adding new todo task"});
    }
});

// Delete a task

app.delete("/todo/:id", async(req, res)=>{
    const _id = req.params['id'];

    const userTodo = await todoModel.findById({_id});

    if (userTodo){
        await todoModel.findByIdAndDelete({_id});
        return res.json({msg: "todo deleted successfully"})
    }else{
        res.json({msg: "No todo task found"})
    }
});

// Update a task

app.patch("/todo/:id", async (req, res) => {
    const todoId = req.params.id;
    const { todo } = req.body;
  
    try {
    const updatedTodo = await todoModel.findOneAndUpdate({_id: todoId}, req.body, {
        new:true, runValidators:true
    })
  
      if (!updatedTodo) {
        return res.status(404).json({ msg: "Todo task not found" });
      }
  
      res.json({ msg: "Todo task updated successfully", todo: updatedTodo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error while updating todo task" });
    }
  });
  

app.listen(port, async() => {
    await TodoDB()
  console.log(`Server is running on port ${port}`);
});

