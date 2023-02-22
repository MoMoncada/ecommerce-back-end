const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

//---- GET for all tags ----//
router.get('/', async (req, res) => {
  try{
    console.log(`\n Getting all Tag data! \n`)

    const tagsData = await Tag.findAll({
      //-- Joining Tags with Products --//
      include: 
      {model: Product}
    });

    res.status(200).json(tagsData);

  } catch (err) {
    res.status(500).json(err);
  }

});



//---- GET for a single tag ----//
router.get('/:id', async (req, res) => {
  
  try {
    const singleTag = await Tag.findByPk(req.params.id);

    if (!singleTag){
      res.status(404).json({message:'No tag has been found under this id!'});
    } else {
      res.status(200).json(singleTag);
    }

  } catch (err) {
    res.status(500).json(err);
  }

});



//---- POST request for new tag by tag_name ----//
router.post('/', async (req, res) => {
  
  try {
    const newTag = await Tag.create({tag_name: req.body.tag_name});

    console.log(`\n Added a new tag: ${req.body.tag_name} \n`);

    res.status(200).json(newTag);

  } catch (err) {
    res.status(400).json(err);
  }

});



//---- PUT request for a tag by :id ----//
router.put('/:id', async (req, res) => {
   
  try {
    const updatedTag = await Tag.update(
      {tag_name: req.params.tag_name},
      {returning: true, where: {id: req.params.id}}
    )
    
    console.log(`Updated tag name to: ${req.body.tag_name}`)

    res.status(200).json(updatedTag);

  } catch (err) {
    res.status(500).json(err);
  }

});



//---- DELETE request for a tag by :id ----//
router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
