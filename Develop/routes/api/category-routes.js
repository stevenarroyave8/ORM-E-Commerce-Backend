// Import the Router function from the Express library
const router = require('express').Router();

// Import the Category and Product models
const { Category, Product } = require('../../models');

// Route to find all categories
router.get('/', async (req, res) => {
  try {
    const categoriesData = await Category.findAll({}); 
    console.log (categoriesData)
    if (categoriesData.length <= 0) {
      res.status(404).send("cannot get categoies");
      return;
    }
    res.status(200).json(categoriesData); 
  } catch (err) {
    res.status(500).json(err); 
  }
});

// Route to find one category by its `id` value
router.get('/:id', async (req, res) => {
  try{
    const categoriesData = await Category.findByPk(req.params.id, { 
      include: [{ model: Product}] 
    });

    if(!categoriesData) {
      res.status(404).json({ message: 'No categories found with this id'}); 
      return;
    }

    res.status(200).json(categoriesData); 
  } catch (err) {
    res.status(500).json(err); 
  }
});

// Route to create a new category
router.post('/', async (req, res) => {
  try{
    const categoriesData = await Category.create(req.body); 
    res.status(200).json(categoriesData); 
  } catch(err) {
    res.status(400).json(err); 
  }
});

// Route to update a category by its `id` value
router.put('/:id', (req, res) => {
  // Update a category by its `id` value using the Category model and the request body
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
     res.json(category) 
    })
});

// Route to delete a category by its `id` value
router.delete('/:id', async (req, res) => {
 try{
  const categoriesData = await Category.destroy({ 
    where: {
      id: req.params.id
    }
  });
  if (!categoriesData) {
    res.status(400).send("delete category failed")
  }
  res.status(200).end(); 
 } catch(err) {
  res.status(500).json(err); 
 }
});

// Export the router so it can be used by other parts of the application
module.exports = router;