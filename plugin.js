const Mongoose = require('mongoose');
const axios = require('axios');
const ApiOfferModel = require('../db/offer/ApiOffer');
const OfferStatsModel = require('../db/offer/OfferApiStats');
const debug = require("debug")("darwin:plugin:plugin");
const { config } = require('../constants/Global');
const Producer = require('../helpers/rabbitMQ');
const { generateHash, UpdateLiveOffer, liveApiOffer, getDeviceAppId, checkMyOffer} = require('../helpers/Functions');
const mongooseObjectId = Mongoose.Types.ObjectId;
const pluginApis = require("./index");
const Redis = require('../helpers/Redis');
const Promise = require('promise');
const moment = require('moment');

// var axiosFormat = {
//     url: '',
//     method: 'get',
//     baseURL: 'https://some-domain.com/api/',  // `baseURL` will be prepended to `url` unless `url` is absolute.
//     transformRequest: [function (data, headers) {
//         return data;
//     }],
//     transformResponse: [function (data) {
//         return data;
//     }],
//     headers: { 'X-Requested-With': 'XMLHttpRequest' },
//     params: {
//         ID: 12345
//     },
//     paramsSerializer: function (params) {
//         return Qs.stringify(params, { arrayFormat: 'brackets' })
//     },
//     data: {
//         firstName: 'Fred'
//     },
//     timeout: 1000,
//     withCredentials: false,
//     auth: {
//         username: 'janedoe',
//         password: 's00pers3cret'
//     },
//     responseType: 'json',
//     xsrfCookieName: 'XSRF-TOKEN',
//     xsrfHeaderName: 'X-XSRF-TOKEN',
//     onUploadProgress: function (progressEvent) {
//     },
//     onDownloadProgress: function (progressEvent) {
//     },
//     maxContentLength: 2000,
//     validateStatus: function (status) {
//         return status >= 200 && status < 300; // default
//     },
//     maxRedirects: 5,
//     httpAgent: new http.Agent({ keepAlive: true }),
//     httpsAgent: new https.Agent({ keepAlive: true }),
//     proxy: {
//         host: '127.0.0.1',
//         port: 9000,
//         auth: {
//             username: 'mikeymike',
//             password: 'rapunz3l'
//         }
//     },
//     cancelToken: new CancelToken(function (cancel) {
//     })
// }

exports.ImportantFields = ['offer_name', 'preview_url', 'kpi', 'revenue', 'payout', 'device_targeting', 'geo_targeting', 'isTargeting', 'offer_capping', 'description', 'isCapEnabled', 'status_label', 'tracking_link', 'app_id', 'isMyOffer','isPublic'];

exports.makeRequest = async function (newConfig) {

    let config = newConfig;
    // var ax = axios.create();
    // debug(ax);
    return await axios(config)

}

const OffersFetchFileds = [
    { field: 'offer_name', action: 'getOfferName' },
    { field: 'goal', action: 'getGoals' },
    { field: 'category', action: 'getCategory' },
    { field: 'currency', action: 'getCurrency' },
    { field: 'advertiser_offer_id', action: 'getOfferId' },
    { field: 'thumbnail', action: 'getThumbnail' },
    { field: 'description', action: 'getDescription' },
    { field: 'kpi', action: 'getKpi' },
    { field: 'preview_url', action: 'getPreviewUrl' },
    { field: 'tracking_link', action: 'getTrackingLink' },
    { field: 'expired_url', action: 'getExpiredUrl' },
    { field: 'start_date', action: 'getStartDate' },
    { field: 'end_date', action: 'getEndDate' },
    { field: 'revenue', action: 'getRevenue' },
    { field: 'revenue_type', action: 'getRevenueType' },
    { field: 'payout', action: 'getPayout' },
    { field: 'payout_type', action: 'getPayoutType' },
    { field: 'approvalRequired', action: 'getApprovalRequired' },
    { field: 'isCapEnabled', action: 'getIsCapEnabled' },
    { field: 'isgoalEnabled', action: 'getIsGoalEnabled' },
    { field: 'offer_capping', action: 'getOfferCapping' },
    { field: 'isTargeting', action: 'getIsTargeting' },
    { field: 'geo_targeting', action: 'getGeoTargeting' },
    { field: 'device_targeting', action: 'getDeviceTargeting' },
    { field: 'creative', action: 'getCreative' },
    { field: 'offer_visible', action: 'getOfferVisible' },
    { field: 'status_label', action: 'getStatusLabel' },
    { field: 'redirection_method', action: 'getRedirectionMethod' }
];

const OffersExtraFields = [
    // { field: 'LiveOfferId', action: 'getLiveOfferId' },
    { field: 'isLive', action: 'getIsLive' },
    { field: 'status', action: 'getStatus' },
    { field: 'revenue_type', action: 'getRevenueType' },
    { field: 'payout_type', action: 'getPayoutType' },
]

exports.getOffersFields = (allowed, not_allowed) => {
    return OffersFetchFileds;
}



// exports.InsertUpdateOffer = async (fields,offers, jobContent) =>
// {
//     let newOffer = [];
//     let status = false;
//     let updateStatus = false;
//     let isApplyJobAvailable = false;
//     try {
//         let keysArray = Object.keys(offers);
//         let offersLength = keysArray.length;
//         for (index = 0; index < offersLength; index++) {
//             try {
//                 let key = keysArray[index];
//                 let updatefields = {};
//                 let search = {};
//                 search['advertiser_id'] = mongooseObjectId(offers[key].advertiser_id);
//                 search['network_id'] = mongooseObjectId(offers[key].network_id);
//                 search['advertiser_platform_id'] = mongooseObjectId(offers[key].advertiser_platform_id);
//                 search['advertiser_offer_id'] = offers[key].advertiser_offer_id;
//                 debug(offers[key].advertiser_offer_id);
//                 if (offers[key]['app_id']) {
//                     offers[key]['isMyOffer'] = await checkMyOffer(offers[key]['app_id'], offers[key]['network_id']);
//                 }
//                 let result = await ApiOfferModel.getOneOffer(search);
//                 if (result) {
//                     if (offers[key].status_label == "no_link" && result.status_label == "applied" && offers[key]['isMyOffer']) {
//                         offers[key].status_label = "applied";
//                     }
//                     updateStatus = this.checkOfferNeedsUpdate(fields, result.offer_hash, offers[key]);
//                     if (updateStatus === true) {
//                         updatefields = this.FindUpdateFields(fields, result, offers[key], jobContent);
//                         search['_id'] = result._id;
//                         let status = await ApiOfferModel.findandupdateOffer({ _id: result._id}, updatefields)
//                         if (status)
//                         {
//                             debug(' 1 offer updated');    
//                         }
//                     }
//                     else if (jobContent.offer_live_type != "manual_offer_live"  && result.isLive === false && result.tracking_link){
//                         this.LiveSingleOffer(jobContent, result);
//                     }
//                     if (index >= offersLength - 1 && newOffer.length > 0) {
//                         status = await this.InsertNewOffer(fields, newOffer, jobContent, isApplyJobAvailable);
//                         if (status) {
//                             newOffer = [];
//                             isApplyJobAvailable = false;
//                         }
//                     }
//                 }
//                 else {
//                     if (offers[key]['status_label'] == 'no_link' && pluginApis.applyPlugin[offers[key]['platform_name']] && offers[key]['isMyOffer']) {
//                         offers[key]['status_label'] = 'applied';
//                         isApplyJobAvailable = true;
//                         // debug("applied jobs");
//                     }
//                     newOffer.push(offers[key]);
//                     if (newOffer.length >= 50) {
//                         status = await this.InsertNewOffer(fields, newOffer, jobContent, isApplyJobAvailable);
//                         if (status) {
//                             newOffer = [];
//                             isApplyJobAvailable = false;
//                         }
//                     }
//                     if (index >= offersLength - 1 && newOffer.length > 0) {

//                         status = await this.InsertNewOffer(fields, newOffer, jobContent, isApplyJobAvailable);
//                         newOffer = [];
//                         isApplyJobAvailable = false;
//                         if (status) {
//                             // return true;
//                         }
//                     }
//                 }
//             }
//             catch (err) {
//                 console.error(e);
//             }
//         }
//     }
//     catch (err) {
//         console.error(e);
//     }
//     return await Promise.resolve(true);

// }

exports.FindUpdateFields = (fields, result, newOffer, jobContent) => {
    let updated_field = {};
    let linkChange = true;
    fields.map(key => {
        updated_field[key] = newOffer[key];
    })
    if (newOffer['tracking_link']!=result['tracking_link'])
    {
        linkChange = true;
    }
    newOffer = this.addUpdateExtraFields(newOffer, fields, result);
    updated_field['offer_hash'] = newOffer.offer_hash;
    updated_field['revenue_type'] = newOffer.revenue_type;
    updated_field['payout_type'] = newOffer.payout_type;
    updated_field['status'] = newOffer.status;
    if (newOffer.isLive === true) {
        UpdateLiveOffer(fields, updated_field, result);
    }
    else {
        if (linkChange && newOffer.tracking_link && newOffer.preview_url) {
            newOffer['_id'] = result._id;
            this.LiveSingleOffer(jobContent, newOffer);
        }
    }
    return updated_field;
}

exports.checkOfferNeedsUpdate = (ImportantFields, oldOfferHash, newOffer) => {
    let offerNeedsUpdate = false;
    let hash = generateHash(ImportantFields, newOffer);
    if (!oldOfferHash || hash !== oldOfferHash) {
        offerNeedsUpdate = true;
    }
    return offerNeedsUpdate;
}

exports.InsertNewOffer = async (ImportantFields, newOfferArray, jobContent, isApplyJobAvailable) => {
    return new Promise( async( resolve, reject)=>{
        let offer = [];
        newOfferArray.map(async newOffer => {


            newOffer = this.addUpdateExtraFields(newOffer, ImportantFields, {});
            let hash = generateHash(ImportantFields, newOffer);
            newOffer.offer_hash = hash;
            offer.push(newOffer);
            try{
                let a = new ApiOfferModel(newOffer);
                await a.save();
            }
            catch(e){
                console.log(e)
            }
        })
        let result = await ApiOfferModel.insertManyOffers(offer);
        debug('total offer ', newOfferArray.length, 'inserted', result.length);
        if (result) {
            if (isApplyJobAvailable) {
                this.publishApplyJobs(result, jobContent);
            }
            if (jobContent.offer_live_type == "all_offer_live") {
                liveApiOffer(result, {}, jobContent.visibility_status, jobContent.publishers, jobContent.payout_percent, 1);
            }
            else if (jobContent.offer_live_type == "working_offer_live") {
                this.publishWorkingLinkJobs(result, jobContent);
            }
            result.map(obj => {
                let redisHash = "offerHash:" + obj.network_id + ":" + obj.advertiser_id + ":" + obj.advertiser_platform_id;
                let redisKey = obj.advertiser_offer_id;
                Redis.setRedisHashData(redisHash, redisKey, obj.offer_hash, process.env.REDIS_Exp);
            })    
        }
        resolve(true);
    });
}

exports.getStatus = (newOffer, oldOffer = {}) => {
    let status_label = newOffer.status_label;
    let status = config.OFFERS_STATUS.unmanaged.value;
    if (status_label && config.OFFERS_STATUS[status_label] ) {
        status = config.OFFERS_STATUS[status_label].value;
    }
    return status;
}
exports.getIsLive = (newOffer, oldOffer = {}) => {
    let isLive = false;
    if (oldOffer.isLive ) {
        isLive = true;
    }
    return isLive;
}


exports.getRevenueType = (newOffer, oldOffer = {}) => {
    let revenue_type = newOffer.revenue_type;
    let tempRevenueType = { enum_type: 'unknown', offer_type: '' };
    let tempKey = '';
    if (revenue_type.offer_type ) {
        tempRevenueType = revenue_type;
        tempRevenueType.enum_type = 'unknown';
        config.OFFERS_REVENUE_TYPE.map((key, index) => {
            tempKey = tempRevenueType.offer_type.toUpperCase();
            if (key && key.toUpperCase() === tempKey) {
                tempRevenueType.enum_type = key;
                return true;
            }
            else if (tempKey.indexOf(key.toUpperCase()) !== -1) {
                tempRevenueType.enum_type = key;
            }
        })
    }
    if (tempRevenueType.enum_type == '') {
        tempRevenueType.enum_type = 'unknown';
    }
    return tempRevenueType;
}

exports.getPayoutType = (newOffer, oldOffer = {}) => {
    let payout_type = newOffer.payout_type;
    let tempPayoutType = { enum_type: 'unknown', offer_type: '' };
    let tempKey = '';
    if (payout_type.offer_type ) {
        tempPayoutType = payout_type;
        tempPayoutType.enum_type = 'unknown';
        config.OFFERS_REVENUE_TYPE.map((key, index) => {
            tempKey = tempPayoutType.offer_type.toUpperCase();
            if (key && key.toUpperCase() === tempKey) {
                tempPayoutType.enum_type = key;
                return true;
            }
            else if (tempKey.indexOf(key.toUpperCase()) !== -1) {
                tempPayoutType.enum_type = key;
            }
        })
    }
    if (tempPayoutType.enum_type == '') {
        tempPayoutType.enum_type = 'unknown';
    }
    return tempPayoutType;
}

exports.addUpdateExtraFields = (newOffer, ImportantFields, oldOffer) => {
    newOffer['offer_hash'] = generateHash(ImportantFields, newOffer);
    newOffer['revenue_type'] = this.getRevenueType(newOffer, oldOffer);
    newOffer['payout_type'] = this.getPayoutType(newOffer, oldOffer);
    newOffer['status'] = this.getStatus(newOffer, oldOffer);
    newOffer['isLive'] = this.getIsLive(newOffer, oldOffer);
    // newOffer['LiveOfferId'] = this.getLiveOfferId(newOffer, oldOffer);
    return newOffer;
}

exports.getAppId = (url) => {
    let app_id = '';
    if (url) {
        let response = getDeviceAppId(url);
        if (response && response.app_id) {
            app_id = response.app_id;
        }
    }
    return app_id;
}

exports.addExtraFields = (offer, content) => {
    offer['platform_id'] = content.platform_id;
    offer['platform_name'] = content.platform_name;
    offer['advertiser_id'] = content.advertiser_id;
    offer['network_id'] = content.network_id;
    offer['advertiser_name'] = content.advertiser_name;
    offer['advertiser_platform_id'] = content.advertiser_platform_id;
    try {
        offer['app_id'] = this.getAppId(offer['preview_url']);
        offer['isMyOffer'] = false;
        offer['isPublic'] = false;
        if (offer['offer_visible'] != "private")
        {
            offer['isPublic'] = true;
        }
        offer['revenue'] = + offer['revenue'];
        offer['payout'] = + offer['payout'];
        // if (offer['app_id'])
        // {
        //     offer['isMyOffer'] = checkMyOffer(offer['app_id'], offer['network_id']);
        // }
        if (content.payout_percent) {
            offer['payout'] = ((offer['revenue'] * (+content.payout_percent)) / 100) || 0;
            offer['payout'] = offer['payout'].toFixed(3);
            offer['revenue'] = offer['revenue'].toFixed(3);
        }
    }
    catch (e) {
        console.error(e)
        offer['payout'] = 0;
    }
    return offer;
}

exports.LiveSingleOffer = (jobContent, newOffer) => {
    try {
        if (jobContent.offer_live_type == "all_offer_live") {
            liveApiOffer([newOffer], {}, jobContent.visibility_status, jobContent.publishers, jobContent.payout_percent,1);
        }
        else if (jobContent.offer_live_type == "working_offer_live") {
            this.publishWorkingLinkJobs([newOffer], jobContent);
        } 
    }
    catch (e)
    {
        console.error(e);
    }
}


exports.applyOfferStatusUpdate = async (advertiser_offer_id, offer_id, status_label, network_id, advertiser_id, advertiser_platform_id, ImportantFields) => {
    return new Promise(async (resolve, reject) => {
        try {
            let status = '';
            if (status_label  && config.OFFERS_STATUS[status_label]) {
                status = config.OFFERS_STATUS[status_label].value;
            }
            if ((status == 0 || status) && mongooseObjectId.isValid(offer_id)) {
                let offer = await ApiOfferModel.getOneOffer({ _id: offer_id, advertiser_offer_id: advertiser_offer_id, network_id: mongooseObjectId(network_id), advertiser_id: mongooseObjectId(advertiser_id), advertiser_platform_id: mongooseObjectId(advertiser_platform_id) });
                if (offer && offer._id) {
                    offer['status_label'] = status_label;
                    offer['status'] = status;
                    offer_hash = generateHash(ImportantFields, offer);
                    let offerupdate = await ApiOfferModel.findandupdateOffer({ _id: offer._id }, { offer_hash: offer_hash, status_label: offer['status_label'], status: offer['status'] });
                    if (offerupdate) {
                        debug('offer updated');
                        return resolve(true);
                    }
                }
                debug('offer not found');
                return resolve(false);
            }
            return resolve(false);
        }
        catch (e) {
            console.error(e);
            return resolve(false);
        }
    });
}


exports.checkOfferChanges = async ( ImportantFields, newOffer) =>
{
    let isUpdateNeeded = false;
    let response = { isUpdateNeeded: false, offerData: null, isNewOffer:false };
    let redisHash = "offerHash:" + newOffer.network_id + ":" + newOffer.advertiser_id + ":" + newOffer.advertiser_platform_id;
    let redisKey = newOffer.advertiser_offer_id;
    let redisResult = await this.findOfferHashFromRedis(newOffer.platform_name, redisHash, redisKey);
    if (redisResult)
    {
        isUpdateNeeded = this.checkOfferNeedsUpdate(ImportantFields, redisResult, newOffer );
        response['isUpdateNeeded'] = isUpdateNeeded;
    }
    if (!redisResult || isUpdateNeeded){
        let offerData = await this.findOfferFromDb(newOffer.network_id, newOffer.advertiser_id, newOffer.advertiser_platform_id, newOffer.advertiser_offer_id);
        if (offerData)
        {
            if (newOffer.status_label == "no_link" && offerData.status_label == "applied" ) {
                newOffer.status_label = "applied";
            }
            isUpdateNeeded = this.checkOfferNeedsUpdate(ImportantFields, offerData.offer_hash, newOffer);  
            if ( !isUpdateNeeded)
            {
                let redisHash = "offerHash:" + newOffer.network_id + ":" + newOffer.advertiser_id + ":" + newOffer.advertiser_platform_id;
                let redisKey = newOffer.advertiser_offer_id;
                Redis.setRedisHashData(redisHash, redisKey, offerData.offer_hash, process.env.REDIS_Exp);    
            }
        }
        else {
            response['isNewOffer'] = true;
        }
        response['isUpdateNeeded'] = isUpdateNeeded;
        response['offerData'] = offerData;
    }
    return response;
}

exports.findOfferFromDb = async (network_id, advertiser_id, advertiser_platform_id, advertiser_offer_id) => {
    let search = { advertiser_id: mongooseObjectId(advertiser_id), network_id: mongooseObjectId(network_id), advertiser_platform_id: mongooseObjectId(advertiser_platform_id), advertiser_offer_id: advertiser_offer_id };
    return await ApiOfferModel.getOneOffer(search);
}

exports.findOfferHashFromRedis = async (platform_name, redisHash, redisKey) => {
    try {
        let redisResult = await Redis.getRedisHashData(redisHash, redisKey);
        return redisResult.data;
        
    }
    catch{
        return null;
    }
}

exports.InsertUpdateOffer = async (fields, offers, jobContent) => {
    return new Promise(async (resolve, reject) => {
        let InsertOfferList = [];
        let isApplyJobAvailable = false;
        let offerLog = this.defaultLog();
        let newOfferCount = 0;
        let updateOfferCount = 0;
        let approvedOfferCount = 0;
        let noLinkOfferCount = 0;
        let offerAlreadyUpdated = 0;
        try {
            let keysArray = Object.keys(offers);
            let offersLength = keysArray.length;
            for (index = 0; index < offersLength; index++) {
                try {
                    let key = keysArray[index];
                    let newOffer = offers[key];
                    if (newOffer['app_id']) {
                        newOffer['isMyOffer'] = await checkMyOffer(newOffer['app_id'], newOffer['network_id']);
                    }
                    if (newOffer['status_label'] == 'active') {
                        approvedOfferCount++;
                    }
                    else if (newOffer['status_label'] == 'no_link') {
                        noLinkOfferCount++;
                    }
                    let offerResponse = await this.checkOfferChanges(fields, newOffer);
                    if (offerResponse.isUpdateNeeded && offerResponse.offerData) {
                        let updatefields = this.FindUpdateFields(fields, offerResponse.offerData, newOffer, jobContent);
                        let tempResult = await ApiOfferModel.findandupdateOffer({ _id: mongooseObjectId(offerResponse.offerData._id) }, updatefields);
                        if (tempResult) {
                            let redisHash = "offerHash:" + newOffer.network_id + ":" + newOffer.advertiser_id + ":" + newOffer.advertiser_platform_id;
                            let redisKey = newOffer.advertiser_offer_id;
                            Redis.setRedisHashData(redisHash, redisKey, newOffer.offer_hash, process.env.REDIS_Exp);    
                            updateOfferCount++;
                        }
                        // if (jobContent.offer_live_type != "manual_offer_live" && offerResponse.offerData.isLive === false && offerResponse.offerData.status_label == 'active') {
                        //     this.LiveSingleOffer(jobContent, result);
                        // }
                    }
                    else if (offerResponse.isNewOffer) {
                        newOfferCount++;
                        if (newOffer['status_label'] == 'no_link' && pluginApis.applyPlugin[newOffer['platform_name']] && newOffer['isMyOffer']) {
                            newOffer['status_label'] = 'applied';
                            isApplyJobAvailable = true;
                            offerLog.apply_offers++;
                        }
                        InsertOfferList.push(newOffer);
                    }
                    else {
                        offerAlreadyUpdated++;
                    }
                    if (InsertOfferList.length >= 50) {
                        let tempResult = await this.InsertNewOffer(fields, InsertOfferList, jobContent, isApplyJobAvailable);
                        if (tempResult) {
                            InsertOfferList = [];
                            isApplyJobAvailable = false;
                        }

                    }
                    else if (index >= offersLength - 1 && InsertOfferList.length > 0) {
                        let tempResult = await this.InsertNewOffer(fields, InsertOfferList, jobContent, isApplyJobAvailable);
                        if (tempResult) {
                            InsertOfferList = [];
                            isApplyJobAvailable = false;
                        }
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
        offerLog.approved_offers = approvedOfferCount;
        offerLog.no_link_offers = noLinkOfferCount;
        offerLog.new_offers = newOfferCount;
        // offerLog.apply_offers = approvedOfferCount;
        offerLog.updated_offers = updateOfferCount;
        offerLog.up_to_date_offers = offerAlreadyUpdated;
        // console.log(jobContent.advertiser_name, " : ", jobContent.platform_name, jobContent.advertiser_platform_id, '(Approved Offers: ', approvedOfferCount, ') (No Link Offers: ', noLinkOfferCount, ') (New Offers: ', newOfferCount, ') (Update Offers: ', updateOfferCount, ') (Offers Up to Date: ', offerAlreadyUpdated,')');
        resolve(offerLog);
    });
}


exports.publishApplyJobs = async (offers, jobContent) => {
    let applyJobs = [];
    offers.map(obj => {
        if (!obj.tracking_link && obj.status == config.OFFERS_STATUS['applied'].value && obj.isMyOffer) {
            let temp = {};
            temp['network_id'] = obj.network_id;
            temp['offer_id'] = obj._id;
            temp['advertiser_id'] = obj.advertiser_id;
            temp['platform_id'] = obj.platform_id;
            temp['advertiser_platform_id'] = obj.advertiser_platform_id;
            temp['platform_name'] = obj.platform_name;
            temp['credentials'] = jobContent.credentials;
            temp['advertiser_offer_id'] = obj.advertiser_offer_id;
            applyJobs.push(temp);
        }
    });
    if (applyJobs.length) {
        await Producer.publish_Content(true, 'Apply_Offers_Api_queue', applyJobs, true, true, false, 0);
    }
}

exports.publishWorkingLinkJobs = async (offers, jobContent) => {
    let checkOffer = [];
    offers.map(obj => {
        if (obj.tracking_link && obj.preview_url) {
            let temp = {};
            temp['tracking_link'] = obj.tracking_link;
            temp['_id'] = obj._id;
            temp['preview_url'] = obj.preview_url;
            temp['country'] = "kr";
            temp['visibility_status'] = jobContent.visibility_status;
            temp['publishers'] = jobContent.publishers;
            temp['payout_percent'] = jobContent.payout_percent;
            if (obj.geo_targeting && obj.geo_targeting.country_allow && obj.geo_targeting.country_allow[0]) {
                temp['country'] = obj.geo_targeting.country_allow[0].key;
            }
            checkOffer.push(temp);
        }
    })
    if (checkOffer.length) {
        await Producer.publish_Content(true, 'filter_my_offer', checkOffer, true, true, false, 0);
    }
}

exports.defaultLog = () => {
    let apiLog = {
        approved_offers: 0,
        no_link_offers: 0,
        new_offers: 0,
        apply_offers: 0,
        updated_offers: 0,
        up_to_date_offers: 0
    };
    return apiLog;
}


exports.mergeOfferLog = (currentLog, tempLog) => {
    let log = {
        approved_offers: currentLog.approved_offers + tempLog.approved_offers || 0,
        no_link_offers: currentLog.no_link_offers + tempLog.no_link_offers || 0,
        new_offers: currentLog.new_offers + tempLog.new_offers || 0,
        apply_offers: currentLog.apply_offers + tempLog.apply_offers || 0,
        updated_offers: currentLog.updated_offers + tempLog.updated_offers || 0,
        up_to_date_offers: currentLog.up_to_date_offers + tempLog.up_to_date_offers || 0,
    };
    return log;
}

exports.lockOfferApiStats = async (offerStats, content, start_time) => {
    try {
        let time_taken = moment().diff(start_time, 'minutes');
        let stats = new OfferStatsModel({
            network_id: mongooseObjectId(content.network_id),
            advertiser_id: mongooseObjectId(content.advertiser_id),
            advertiser_name: content.advertiser_name,
            advertiser_platform_id: mongooseObjectId(content.advertiser_platform_id),
            platform_id: mongooseObjectId(content.platform_id),
            platform_name: content.platform_name,
            stats: offerStats,
            remarks: '',
            time_taken: time_taken
        });
        await stats.save();
        return true;

    } 
    catch(e){
        debug(e.message);
        return false;

    }
}