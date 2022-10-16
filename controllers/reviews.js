const Review= require('../models/reviews');
const Campground= require('../models/campground');

module.exports.createReview= async(req,res)=>{
    const review= new Review(req.body.review);
    review.author= req.user._id;
    const campground= await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview= async(req,res)=>{
    const {id, reviewId}= req.params;
    await Campground.findOneAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/campgrounds/${id}`);
}