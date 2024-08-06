const axios = require('axios');
const crypto = require('crypto');
//Work cuy
class Paydisini {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://paydisini.co.id/api/';
    }

    
    generateSignature(signature) {
        return crypto.createHash('md5').update(this.apiKey + signature).digest('hex');
    }

    
    async request(endpoint, params) {
        try {
            const response = await axios.post(this.baseURL + endpoint, new URLSearchParams(params).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error making request:', error.message);
            throw new Error('[ERROR] Cannot get server response!');
        }
    }

    
    async transaction(params) {
        const signature = this.generateSignature(
            params.unique_code + params.service + params.amount + '10800' + 'NewTransaction'
        );

        const requestParams = {
            key: this.apiKey,
            request: 'new',
            unique_code: params.unique_code,
            service: params.service,
            amount: params.amount,
            note: params.note,
            valid_time: 10800,
            ewallet_phone: params.ewallet_phone,
            type_fee: params.type_fee,
            return_url: params.return_url,
            signature: signature
        };

        return await this.request('', requestParams);
    }

    
    async statusTransaction(unique_code) {
        const signature = this.generateSignature(unique_code + 'StatusTransaction');
        const requestParams = {
            key: this.apiKey,
            request: 'status',
            unique_code: unique_code,
            signature: signature
        };

        return await this.request('', requestParams);
    }

    
    async cancelTransaction(unique_code) {
        const signature = this.generateSignature(unique_code + 'CancelTransaction');
        const requestParams = {
            key: this.apiKey,
            request: 'cancel',
            unique_code: unique_code,
            signature: signature
        };

        return await this.request('', requestParams);
    }

    
    async chanel() {
        const signature = this.generateSignature('PaymentChannel');
        const requestParams = {
            key: this.apiKey,
            request: 'payment_channel',
            signature: signature
        };

        return await this.request('', requestParams);
    }

    
    async panduanPembayaran(service) {
        const signature = this.generateSignature(service + 'PaymentChannel');
        const requestParams = {
            key: this.apiKey,
            request: 'payment_guide',
            service: service,
            signature: signature
        };

        return await this.request('', requestParams);
    }

    
    callback(params) {
        const signature = this.generateSignature(params.unique_code + params.status + 'CallbackStatus');
        return {
            key: this.apiKey,
            signature: signature
        };
    }
}

module.exports = Paydisini;
