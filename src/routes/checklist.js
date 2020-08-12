const express = require ('express')

const router = express.Router();
const Checklist = require ( '../models/checklist')

router.get('/', async (req,res) => {
    try {
        let checklists = await Checklist.find({}); //estou passando atributos vazios
        res.status(200).render('checklists/index', {checklists: checklists});
    }catch{
        res.status(400).render('pages/error', {error: 'Erro ao exibir as listas'});
    }
})

router.get('/new', async (req,res) => {
    try {
        let checklist = new Checklist(); //crio um objeto vazio não salvo para dar uma estrutura para o que vou criar lá dentro
        res.status(200).render('checklists/new', {checklist: checklist})
    }catch{
        res.status(500).render('pages/error', {error: 'Erro ao carregar o formulário'});
    }
})

router.get('/:id/edit', async (req,res) => {
    try {
        let checklist = await Checklist.findById(req.params.id);
        res.status(200).render('checklists/edit', {checklist: checklist})
    }catch (error) {
        res.status(422).render('pages/error', {error: 'Erro ao exibir a página'});
    }
})

router.post('/', async (req,res) => {
    let { name } = req.body.checklist; //nao vou receber mais so do body. vai estar encapsulado dentro da variavel checklist que declarei ali em cima
    let checklist = new Checklist({name}); //o padrao é criar uma variavel e passar o valor

    try {
        await checklist.save() //quando recebo a requisicao salvo em cima do meu checklist
        res.redirect ('/checklists') //quando enviar, vou redirecionar para checklists
    }catch (error) {
        res.status(422).render('checklists/new', { checklist: {...checklist, error}}); //para eu poder passar o erro para o form, tenho que fazer isso. o error vai indicar automaticamente onde está errado
    }
})


router.get('/:id', async (req,res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks');
        res.status(200).render('checklists/show', {checklist: checklist})
    }catch (error){
        res.status(400).render('pages/error', {error: 'Erro ao exibir as listas'});
    }
})

router.put ('/:id', async (req,res) => {
    let { name } = req.body.checklist;
    let checklist = await Checklist.findById(req.params.id); //encontro o checklist antes e fora do try para poder usar na mensagem de erro
    try {
        await checklist.update({name});
        res.redirect('/checklists');
    }catch (error){
        let errors = error.errors; //erro vindo do catch virá com esse objeto errors dentro
        res.status(422).render('checklists/edit', {checklist: {...checklist, errors}});
    }
})

router.delete('/:id', async (req,res) => {
    try {
        let checklist = await Checklist.findByIdAndDelete(req.params.id);
        res.redirect('/checklists');
    }catch (error){
        res.status(500).render('pages/error', {error: 'Erro ao deletar a lista'});
    }
})

module.exports = router;