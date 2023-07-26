// Import the Router function from the Express library
const router = require('express').Router();

const { request } = require('express');
// Import the Product, Category, Tag, and ProductTag models
const { Product, Category, Tag, ProductTag } = require('../../models');

// Define routes for the `/api/products` endpoint

// Route to find all products and include their associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'tag_product' }] // Include the Category and Tag models to get the product's associated category and tags
    });
    res.status(200).json(productData); // Respond with a JSON object containing the products data
  } catch (err) {
    res.status(500).json(err); // If there's an error, respond with a JSON object containing the error message
  }
});

// Route to find one product by its `id` and include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'tag_product' }] // Include the Category and Tag models to get the product's associated category and tags
    });

    if(!productData) {
      res.status(404).json({ message: 'No products found with this id'}); // If the product is not found, respond with a JSON object containing an error message
      return;
    }

    res.status(200).json(productData); // Respond with a JSON object containing the product data
  } catch (err) {
    res.status(500).json(err); // If there's an error, respond with a JSON object containing the error message
  }
});

// Route to create a new product
router.post('/', (req, res) => {


  Product.create(req.body) // Create a new product using the Product model and the request body
    .then((product) => {
      console.log (req.body,product)
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr); // Create the product tag pairings using the ProductTag model and the product and tag ids
      }
      // if no product tags, just respond
      res.status(200).json(product); // Respond with a JSON object containing the created product data
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err); // If there's an error, respond with a JSON object containing the error message
    });
});

// Route to update a product by its `id` and its associated Tag data
router.put('/:id', (req, res) => {
  // Update a product by its `id` and its associated Tag data using the Product, Tag, and ProductTag models and the request body
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
      // if there is an error, log it and send back a 400 error response
      console.log(err);
      res.status(400).json(err);
    });
});

// Route to delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    // delete the product with the given id
    const result = await Product.destroy({
      where: { id: req.params.id }
    });
    // send back the result
    res.json(result);
  } catch (err) {
    // if there is an error, log it and send back a 500 error response
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// export the router
module.exports = router;