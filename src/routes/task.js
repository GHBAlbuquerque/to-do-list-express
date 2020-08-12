const express = require('express')

const checklistDependentRoute = express.Router();
const simpleRouter = express.Router(); //crio uma segunda rota que nao usa o ID do checklist

const Checklist = require('../models/checklist');

const Task = require('../models/task');


checklistDependentRoute.get('/:id/tasks/new', async (req, res) => {
    try {
        let task = Task();
        res.status(200).render('tasks/new', { checklistId: req.params.id, task: task });
    } catch (error) {
        res.status(422).render('pages/error', { errors: 'Erro ao carregar o formulário' });
    }
})

simpleRouter.delete('/:id', async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id);
        let checklist = await Checklist.findById(task.checklist);
        let taskToRemove = checklist.tasks.indexOf(task._id);
        checklist.tasks.splice(taskToRemove, 1);
        checklist.save();
        res.redirect(`/checklists/${checklist._id}`);
    } catch (error) {
        res.status(422).render('pages/error', { errors: 'Erro ao deletar a tarefa' });
    }
})

checklistDependentRoute.post('/:id/tasks', async (req, res) => {
    let { name } = req.body.task; //sempre tenho que dar um parametro para o post
    let task = new Task({ name: name, checklist: req.params.id });

    try {
        await task.save(); //aqui criei minha task
        let checklist = await Checklist.findById(req.params.id); //encontrei o checklist que ela está dentro
        checklist.tasks.push(task); //coloquei a task pra dentro do checklist
        await checklist.save(); //salvei o checklist
        console.log(checklist.tasks)
        res.redirect(`/checklists/${req.params.id}`);
    } catch (error) {
        let errors = error.errors;
        res.status(422).render('tasks/new', { task: { ...task, errors }, checklistId: req.params.id })
    }
})

//função para aatualizar o status done da task

simpleRouter.put('/:id', async(req,res) => { //id da task
    let task = await Task.findById(req.params.id) 

    try {
        task.set(req.body.task); //poderia usar o update tambem. atualizo com o que veio no body, no caso, meu status checked
        await task.save(); //atualizo a task
        res.status(200).json({ task }) //estou devolvendo minha task como um json que será trabalho via JS para alterar a view
    }catch (error){
        let errors = error.errors
        res.status(422).json({task: {...errors }});
    }
})

module.exports = {
    checklistDependent: checklistDependentRoute,
    simple: simpleRouter
}