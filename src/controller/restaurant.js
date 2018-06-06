import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';
import Review from '../model/review';

export default({ config, db }) => {
    let api = Router();

    // CRUD - Create Read Update Delete
    // '/v1/restaurant/add' - Create
    api.post('/add', (req, res) => {
        let newRest = new Restaurant();
        newRest.name = req.body.name;
        newRest.foodtype = req.body.foodtype;
        newRest.avgcost = req.body.avgcost;
        newRest.geometry.coordinates = req.body.geometry.coordinates;

        newRest.save(err => {
            if (err) {
                res.setEncoding(err);
            }
            res.json({ message: 'Restaurant saved successfully'});
        });
    });

    // '/v1/restaurant' - Read
    api.get('/', (req, res) => {
        Restaurant.find({}, (err, restaurants) => {
            if (err) {
                res.send(err);
            }
            res.json(restaurants);
        });
    });

    // '/v1/restaurant/:id' - Read 1
    api.get('/:id', (req, res) => {
        Restaurant.findById(req.params.id, (err, restaurant) => {
            if (err) {
                res.send(err);
            }
            res.json(restaurant);
        });
    });

    // '/v1/restaurant/:id' - Update
    api.put('/:id', (req, res) => {
        Restaurant.findById(req.params.id, (err, restaurant) => {
            if (err) {
                res.send(err);
            }
            restaurant.name = req.body.name;
            restaurant.foodtype = req.body.foodtype;
            restaurant.avgcost = req.body.avgcost;
            restaurant.geometry.coordinates = req.body.geometry.coordinates;
            restaurant.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: "Restaurant info updated"});
            });
        });
    });

    // '/v1/restaurant/:id' - Delete
    api.delete('/:id', (req, res) => {
        Restaurant.remove({
            _id: req.params.id
        }, (err, restaurant) => {
            if (err) {
                res.send(err);
            }
            res.json({message: "Restaurant Successfully Removed"});
        });
    });

    // add review for a specific restaurant id
    // '/v1/restaurant/reviews/add/:id'
    api.post('/reviews/add/:id', (req, res) => {
        Restaurant.findById(req.params.id, (err, restaurant) => {
            if (err) {
                res.send(err);
            }
            let newReview = new Review();
            newReview.title = req.body.title;
            newReview.text = req.body.text;
            newReview.restaurant = restaurant._id;
            newReview.save((err, review) => {
                if (err) {
                    res.send(err);
                }
                restaurant.reviews.push(newReview);
                restaurant.save(err => {
                    if (err) {
                        res.send(err);
                    }
                    res.json({message: 'Restaurant review saved'});
                });
            });
        });
    });

    // get reviews for a specific restaurant id
    // '/v1/restaurant/reviews/:id'
    api.get('/reviews/:id', (req, res) => {
        Review.find({restaurant: req.params.id}, (err, reviews) => {
            if (err) {
                res.send(err);
            }
            res.json(reviews);
        });
    });

    return api;
}