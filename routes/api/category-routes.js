const router = require('express').Router();
const { Category, Product } = require('../../models');


//---- GET for all categories ----//
router.get('/', async (req, res) => {
  
  try {
    const dbCategoriesData = await Category.findAll({
      //-- Joining Categories with Products --//
      include: [{model: Product}]
    });

    res.status(200).json(dbCategoriesData);

  } catch (err) {
    res.status(500).json(err);
  }

});

//---- GET for a single category ----//
router.get('/:id', async (req, res) => {
  
  try {
    const singleCategoryData = await Category.findByPk(req.params.id, {
      //-- Joining Categories with Products --//
      include: [{model: Product}]
    });

    if (!singleCategoryData) {
      res.status(404).json({message: 'No category found under the entered id'});
    } else {
      res.status(200).json(singleCategoryData);
    }

  } catch {
    res.status(500).json(err)
  }
  
});


router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
