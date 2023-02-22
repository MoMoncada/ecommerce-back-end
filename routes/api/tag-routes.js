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





router.post('/', (req, res) => {
  // create a new tag
});





router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});




router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
