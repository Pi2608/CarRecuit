const paypal = require('paypal-rest-sdk')
const user = require('../models/User')
const querystring = require('qs');
const crypto = require("crypto");
const Util = require('../Util/Util')
const moment = require('moment');

let price 
let userId
let amount
const pay = async (req,res)=>{
    amount = req.body.amount
    console.log(amount)
    userId = req.params.userId
    console.log(userId)
    price = parseFloat((Number(amount)*0.000040572).toFixed(2));
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:4000/transaction/PayPal/loadingPayment",
            "cancel_url": "http://localhost:4000/"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Giao dịch",
                    "sku": "001",
                    "price": price,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": price
            },
            "description": "This is the payment description."
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            for (var index = 0; index < payment.links.length; index++) {
            //Redirect user to this endpoint for redirect url
                if (payment.links[index].rel === 'approval_url') {
                    res.json(payment.links[index].href)
                }
            }
        }
    });
}

const loadingPayment = async (req, res)=>{
    const PayerId = req.query.PayerID
    var execute_payment_json = {
        "payer_id": PayerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": price
            }
        }]
    };
    
    var paymentId = req.query.paymentId;
    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            user.createTransaction(userId, amount, paymentId, amount, "PayPal")
            res.redirect('http://localhost:5173/')
        }
    });
}

const create_payment_url = async (req, res, next)=>{
    userId = req.params.userId
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        const tmnCode = 'RHXBVHN3';
        const secretKey = 'JXQHGGTPIFMWAABJFCIPHXRDCULOHYWO';
        const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        const returnUrl = 'http://localhost:4000/transaction/VNPay/vnpay_return';

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss')
        const orderId = await Util.generateRandomString(5);
        amount = req.body.amount;
        const bankCode = req.body.bankCode;
        console.log(amount, bankCode)
        let locale = 'vn';
        if (!locale) {
            locale = 'vn';
        }
        const currCode = 'VND';
        const vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': locale,
            'vnp_CurrCode': currCode,
            'vnp_TxnRef': orderId,
            'vnp_OrderInfo': "TransactionWithCarFlex",
            'vnp_OrderType': "other",
            'vnp_Amount': amount * 100,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate
        };
        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        const sortedParams = sortObject(vnp_Params);
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        const finalUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
        
        res.json(finalUrl)
}
const vnpay_return = async(req,res,next)=>{
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = 'RHXBVHN3'
    let secretKey = 'JXQHGGTPIFMWAABJFCIPHXRDCULOHYWO'

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        user.createTransaction(userId, amount, secureHash, amount, "VNPay")
        res.json("Success")
    } else{
        res.render('success', {code: '97'})
    }
}
function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
module.exports={
    pay,
    loadingPayment,
    create_payment_url,
    vnpay_return
}