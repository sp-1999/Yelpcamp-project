var mongoose=require('mongoose'),
    Campground=require('./models/campground');
    Comment=require('./models/comment');
var data=[
    {
        name:"Tso Moriri Lake, Ladakh",
        image:"https://www.holidify.com/images/cmsuploads/compressed/640px-Tsomoriri_Lake_DSC4010_20190212171119.jpg",
        description:"Tsomoriri Lake is the highest lake in the world and located in Ladakh. Camping here is the experience of a lifetime. The lake is completely frozen during the winters and is an excitingly unique thing to witness. The best time to camp here is during May to September and it is simply wonderful to spend time in the decorated tents. You can trek in the nearby Ladakh region and witness the mesmerizing sunset at the lake. The best part is that the tents are comfortable with electricity supply."
    },
    {
        name:"Camp Exotica, Kullu",
        image:"https://www.holidify.com/images/cmsuploads/compressed/tent-1208201_1920_20190212172038.jpg",
        description:"The Camp Exotica is a perfect weekend getaway option located in Kullu in the Manali district of Himachal Pradesh. The accommodation provided is world class and the tents simply leave you connecting with nature like never before. The location of these tents is such that it gives a panoramic view of the surrounding mountains. The food provided is of fine quality and the incredible view will simply leave you in awe of this adventure. Make sure to take out time for this pleasure full camping trip."
    },
    {
        name:"Kipling Camp, Madhya Pradesh",
        image:"https://www.holidify.com/images/cmsuploads/compressed/4133327541_b597f6451b_z_20190212174017.jpg",
        description:"Camping in the largest protected Tiger Reserve in the country has to be an unparalleled experience, right? The Kipling Camp is located in the Kanha National Park in Madhya Pradesh. This campsite is in the Satpura Hills refreshed by the water of the Narmada. Camping here lets you experience the dense wild forest and amazingly calm weather. The best thing to do here is to go bird watching or pursue a jungle safari. This one is a complete family vacation spot with the chance to make joyous memories."
    }
]
//start form data creation
function seedDB(){
    //remove all campground
    Campground.remove({},function(err){
        // if(err){
        //     console.log(err);
        // }else{
        //     console.log("removed campground!");
        //     //add a few campground
        //     data.forEach(function(seed){
        //         Campground.create(seed,function(err,campground){
        //             if(err){
        //                 console.log(err);
        //             }else{
        //                 console.log("added a campground");
        //                 //create a comment
        //                 Comment.create({
        //                     text:"This place is great,but i wish there was internet",
        //                     author:'Homer'
        //                 },function(err,comment){
        //                     if(err){
        //                         console.log(err);
        //                     }else{
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log("created new comment");
        //                     }  
        //                 });
        //             }
        //         });
        //     });
        // }
    });
}
module.exports=seedDB;


