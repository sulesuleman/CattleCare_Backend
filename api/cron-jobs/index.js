// const { FeaturedTutor } = require("../data/featuredtutor.model");
// const { User } = require("../data/user.model");
// const nodemailer = require("nodemailer");
const config = require("config");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: config.get("sender_email"),
//     pass: config.get("sender_pass"),
//   },
// });

// module.exports.adjustNewTutor = async () => {
//   console.log(
//     "------------------IN CRON JOB------------------------"
//     // config.get("sender_email"),
//     // config.get("sender_pass")
//   );
//   const toBeRemoved = await FeaturedTutor.find({
//     endingTimeDate: { $lt: new Date() },
//   }).sort({ endingTimeDate: 1 });

//   console.log("toBeRemoved", toBeRemoved.length);

//   if (toBeRemoved && toBeRemoved.length) {
//     for (let item of toBeRemoved) {
//       await FeaturedTutor.deleteOne({ _id: item._id });
//     }

//     const toBeAdded = await FeaturedTutor.find({ status: "PENDING" })
//       .limit(toBeRemoved.length)
//       .sort({
//         startingTimeDate: 1,
//       });
//     console.log("toBeAdded", toBeAdded.length);

//     for (let item of toBeAdded) {
//       await FeaturedTutor.updateOne(
//         { _id: item._id },
//         { $set: { status: "ACTIVE" } }
//       );

//       const { email } = await User.findOne({ _id: item.userId });

//       const mailOptions = {
//         from: "Gulf Academy <admin@gulfacademy.com>",
//         to: `${email}`,
//         subject: "Featured Tutor",
//         text: `Congratulations, You've been included in our FEATURED TUTORS list.`,
//       };

//       await transporter.sendMail(mailOptions, (error) => {
//         if (error) {
//           console.log("error in sending mail", error.message);
//         } else console.log("Mail Sent");
//       });
//     }
//   }
// };
