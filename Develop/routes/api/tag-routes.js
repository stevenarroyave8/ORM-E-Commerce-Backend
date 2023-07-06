const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// get all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'tagged_products' }]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one tag by its `id`
// be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'tagged_products' }]
    });

    if(!tagData) {
      res.status(404).json({ message: 'No tags found with this id'});
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try{
    const tagData = await Tag.create(req.body);
    console.log(req.body, tagData)
    res.status(200).json(tagData);
  } catch(err) {
    res.status(400).json(err);
  }
});

// update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update({tag_name: req.body.tag_name}, {
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    res.json(tag)
  })
});

// delete one tag by its `id` value
router.delete('/:id', async (req, res) => {
  try{
   const tagData = await Tag.destroy({
     where: {
       id: req.params.id
     }
   });
   res.status(200).end();
  } catch(err) {
   res.status(500).json(err);
  }
});

module.exports = router;