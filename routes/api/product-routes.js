const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//---- GET for all products ----//
router.get('/', async (req, res) => {
 
  try {

    console.log(`\n Getting all Product data: \n`)

    const productData = await Product.findAll({
      include: [
      {model: Category}, 
      {model: Tag, through: ProductTag }],
  });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});



//---- GET for a single product ----//
router.get('/:id', async (req, res) => {
  try {

    console.log(`\n Getting Product data for id: ${req.params.id} \n`);

    const singleProduct = await Product.findByPk(req.params.id, {
      //Joining with Category, Tag through ProductTag
      include: [ { model: Category },
                 { model: Tag, through: ProductTag }],
    });

    if (!singleProduct) {
      res.status(404).json({ message: 'No product found under this id!' });
    } else {
      res.status(200).json(singleProduct);
    }

  } catch (err) {
    res.status(500).json(err)
  }

});



// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 2,
      tagIds: [1, 2, 3, 4]
    }
  */
    Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr)
          .then(() => {
            return product;
          });
      } else {
        // if no product tags, just respond with the product object
        res.status(200).json(product);
      }
    })
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });

});




// update product
router.put('/:id', (req, res) => {

  // update product data
  Product.update(req.body, {

    where: {
      id: req.params.id,
    },

  })
    .then((product) => {

      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {

      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds

        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {

          return {
            product_id: req.params.id,
            tag_id,
          };

        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([

        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),

      ]);

    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      
      // console.log(err);
      res.status(400).json(err);
    });
});


//---- DELETE request for a product by :id ----//
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id }
    });

    
    if (!deletedProduct) {
      res.status(404).json({message: 'No product found with this id!'});
      return;
    } else {
      console.log(`\n Deleted product under the id: ${req.params.id} \n`);
    }

    res.status(200).json(deletedProduct);
  } catch {
    res.status(500).json(err);
  }
});

module.exports = router;
