//import counterReducer from './counter';
import loggedReducer from './isLogged';
import hotel from './hotel';
import listingType from './listingType';
import category from "./category";
import childCategory from "./childCategory";
import services from "./services";
import promotion from "./promotion";
import childPromotion from "./childPromotion";
import promotionServices from "./promotionServices";
import whatsOn from "./whatsOn";
import childWhatsOn from "./childWhatsOn";
import WhatsOnServices from "./WhatsOnServices";
import experience from "./experience";
import childExperience from "./childExperience";
import experienceServices from "./experienceServices";
import guestDirectory from "./guestDirectory";
import childGD from "./childGD";
import GDServices from "./GDServices";
import feedbackmsg from "./feedbackmsg";
import others from "./others";
import childOthers from "./childOthers";
import othersServices from "./othersServices";
import carouselIndex from "./carouselIndex";
import { combineReducers } from 'redux';
import carouselIndexAll from './carouselIndexAll';
import childBeauty from './childBeauty';
import beautyServices from './beautyServices';
import beauty from './beauty';

const allReducers = combineReducers({
    //counter: counterReducer,
    LoginDetails: loggedReducer,
    HotelDetails: hotel,
    ListingType: listingType,
    Category: category,
    ChildCategory: childCategory,
    Services: services,
    Promotion: promotion,
    ChildPromotion: childPromotion,
    PromotionServices: promotionServices,
    WhatsOn: whatsOn,
    ChildWhatsOn: childWhatsOn,
    WhatsOnServices: WhatsOnServices,
    Experience: experience,
    ChildExperience: childExperience,
    ExperienceServices: experienceServices,
    GuestDirectory: guestDirectory,
    ChildGuestD: childGD,
    GuestDServices: GDServices,
    Feedbackmsg: feedbackmsg,
    Others: others,
    ChildOthers: childOthers,
    CarouselIndex: carouselIndex,
    CarouselIndexAll: carouselIndexAll,
    OthersServices: othersServices,
    ChildBeauty: childBeauty,
    BeautyServices: beautyServices,
    Beauty: beauty,


});

export default allReducers;