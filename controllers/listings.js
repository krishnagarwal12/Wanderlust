const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", 
      populate: {
        path: "author",
      },
    }).populate("owner");
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res) => {
    // console.log("CREATE LISTING HIT");
    // console.log("req.body:", req.body);
    // console.log("req.file:", req.file);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
     if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", {listing, originalImageUrl});
};

// module.exports.updateListing = async (req, res) => {
//   let { id } = req.params;

//   const listing = await Listing.findById(id);

//   // update only fields coming from form
//   listing.title = req.body.listing.title;
//   listing.description = req.body.listing.description;
//   listing.price = req.body.listing.price;
//   listing.location = req.body.listing.location;

//   // image stays untouched
//   await listing.save();

//   req.flash("success", "Listing Updated!");
//   res.redirect(`/listings/${id}`);
// };

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => { //delete listing
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};