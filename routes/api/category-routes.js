const router = require('express').Router();
const { Category, Product } = require('../../models');


//---- GET for all categories ----//
router.get('/', async (req, res) => {
  
  try {
    console.log(`\n Getting all Category data! \n`)

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
    console.log(`\n Getting category data for id: ${req.params.id} \n`);

    const singleCategory = await Category.findByPk(req.params.id, {
      //-- Joining Categories with Products --//
      include: [{model: Product}]
    });

    if (!singleCategory) {
      res.status(404).json({message: 'No category found under the entered id'});
    } else {
      res.status(200).json(singleCategory);
    }

  } catch {
    res.status(500).json(err)
  }
  
});



//---- POST request for new category by category_name----//
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create({category_name: req.body.category_name});

    console.log(`\n Creating new category: ${req.body.category_name}\n`);

    res.status(200).json(newCategory);

  } catch (err) {
    res.status(400).json(err);
  }
  
});



//---- PUT request for a category by :id ----//
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(
      {category_name: req.body.category},
      {returning: true, where: {id: req.body.id}}

    );

    console.log(`\n Updated category name to: ${req.body.category_name} \n`)

    res.status(200).json(updatedCategory);

  } catch (err) {
    res.status(400).json(err);
  }

});



//---- DELETE request to delete a category by :id ----//
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({
      where: {id: req.params.id}
    });

    if(!deletedCategory) {
      res.status(404).json({message: 'No category found under this id'});
      return;

    } else {
      console.log(`\n Deleted category stored under id number: ${req.params.id} \n`);
  }

  res.status(200).json(deletedCategory);

  } catch(err) {
    res.status(500).json(err);
  }
  
});

module.exports = router;
