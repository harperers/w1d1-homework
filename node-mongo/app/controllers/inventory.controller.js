const mongoose = require('mongoose');
const Inventory = mongoose.model('Inventory');

exports.createInventory = (req, res) => {
    const inventory = new Inventory({
        prodname: req.body.prodname,
        qty: req.body.qty,
        price: req.body.price,
        status: req.body.status,
    });

    inventory.save()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: "Fail!",
                error: err.message
            });
        });
};

exports.getInventory = (req, res) => {
    Inventory.findById(req.params.id)
        .select('-__v')
        .then(inventory => {
            if (!inventory) {
                return res.status(404).send({
                    message: "Inventory not found with id " + req.params.id,
                    error: err
                });
            }
            res.status(200).json(inventory);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Inventory not found with id " + req.params.id,
                    error: err
                });
            }
            return res.status(500).send({
                message: "Error retrieving Inventory with id " + req.params.id,
                error: err
            });
        });
};

exports.inventories = (req, res) => {
    Inventory.find()
        .select('-__v')
        .then(inventoryInfos => {
            res.status(200).json(inventoryInfos);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error
            });
        });
};

exports.deleteInventory = (req, res) => {
    Inventory.findByIdAndRemove(req.params.id)
        .select('-_v -_id')
        .then(inventory => {
            if (!inventory) {
                res.status(404).json({
                    message: "No inventory found with id " + req.params.id,
                    error: "404",
                });
            }
            res.status(200).json({});
        })
        .catch(err => {
            res.status(500).json({
                message: "Error -> Can't delete inventory with id = " + req.params.id,
                error: err.message
            });
        });
};

exports.updateInventory = (req, res) => {
    Inventory.findByIdAndUpdate(
        req.params.id,
        {
            prodname: req.body.prodname,
            qty: req.body.qty,
            price: req.body.price,
            status: req.body.status
        },
        { new: true }
    )
        .select('-_v')
        .then(inventory => {
            if (!inventory) {
                return res.status(404).send({
                    message: "Error -> Can't update an inventory with id = " + req.params.id,
                    error: "Not Found!"
                });
            }
            res.status(200).json(inventory);
        })
        .catch(err => {
            res.status(500).json({
                message: "Error -> Can't update a inventory with id = " + req.params.id,
                error: err.message
            });
        });
};