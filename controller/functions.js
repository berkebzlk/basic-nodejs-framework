function example(req, res) {
    
    console.log('example function executed');
    res.json({msg: 123})
}

module.exports = {example}