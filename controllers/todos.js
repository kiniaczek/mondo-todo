const {create } = require('domain')
const Todo = require('../models/Todo')

function dayStringToNum (stringDay){
    switch (stringDay){
        case 'monday':
            return 1;
        case 'tuesday':
            return 2;
        case 'wednesday':
            return 3;
        case 'thursday':
            return 4;
        case 'friday':
            return 5;
        case 'saturday':
            return 6;
        case 'sunday':
            return 7;
    }
}

module.exports = {
    getTodos: async (req,res)=>{
        try{
            
            let todoItems 
            
            if (req.query.day) {
                todoItems = await Todo.find({ day: req.query.day });
            } else {
                const todosByDay = await Todo.aggregate([
                    { $group: { _id: "$day", todos: { $push: "$$ROOT" } } } 
                ]);
                let sortTodosByDay = todosByDay.sort((a, b) => {return dayStringToNum(a._id) - dayStringToNum(b._id)})
                console.log(sortTodosByDay)
                todoItems = sortTodosByDay
            }

            let itemsLeft = await Todo.countDocuments( !req.query.day ? {completed: false} : {completed: false, day: req.query.day})
            
            console.log('odpaliliśmy getTodos')
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, isDaySelected: req.query.day})

        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req,res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, 
                               completed: false, 
                               day: req.body.day})
            console.log('Todo has been added')
            res.redirect('back')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req,res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log(req.body.todoIdFromJSFile)
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
        console.log(err)
        }
    },
    markIncomplete: async (req,res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log(req.body.todoIdFromJSFile)
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req,res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}