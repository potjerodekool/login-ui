import axios from 'axios';
import type { VerifyResponse } from '../api/model/VerifyResponse';
import orginService from '../api/OriginService';
import type { RecoveryResponse } from './model/RecoveryResponse';

export default {

    getLoginToken() {
        return localStorage.getItem('loginToken');
    },
    
    verifyMFACode(code: string) {
        const origin = orginService.getOrigin()
        const url = `${origin}/auth/verify`; 
        const loginToken = this.getLoginToken();

        return axios.post<VerifyResponse>(url,
        {
          email: localStorage.getItem('email'),
          code: code
        }, 
        {
          headers: {
            'Authorization': 'Bearer ' + loginToken
          }
        },
        );
    },

    recoverMFA(recoveryCode: string) {
        const origin = orginService.getOrigin();
        const loginToken = this.getLoginToken();

        return axios.patch<RecoveryResponse>(`${origin}/auth/recover`, {
          recoveryCode: recoveryCode
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + loginToken
          }
        }
        );
    }
}