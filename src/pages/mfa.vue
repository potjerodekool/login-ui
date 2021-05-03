<template>
  <div class="App jumbotron d-flex">
      <div>
        <div class="container mfa-code-container">
          <div class="row">
          <div class="col-3">
          </div>  
          <div class="col-6">
            Twee factor authenticatie is actief. Vul de MFA code uit de authenticator hieronder in.
          </div>  
          <div class="col-3">              
          </div>  
        </div>
        <div class="row">
          <div class="col-3">
          </div>  
          <div class="col-3">
            <input v-model="state.code" placeholder="MFA code" />
          </div>  
          <div class="col-3">              
            <button class="btn btn-primary" v-on:click="verify()">Versturen</button>
          </div>  
        </div>          

        <div class="row">
          <div class="col-3">
          </div>  
          <div class="col-6">
            
          </div>
          <div class="col-3">
          </div>  
        </div>
        </div>
        <div class="container">
          <div class="row">
          <div class="col-3">
          </div>  
          <div class="col-6">
            Bent u de account in authenticator kwijt? Vul dan hieronder een herstelcode in om weer toegang te krijgen.
            Houd uw authenticator bij de hand.
          </div>
          <div class="col-3">
          </div>  
        </div>
        <div class="row">
          <div class="col-3">
          </div>  
          <div class="col-6">
            <input v-model="this.state.recoveryCode" placeholder="Recovery code" >
          </div>
          <div class="col-3">
          </div>  
        </div>
        <div class="row">
          <div class="col-3">
          </div>  
          <div class="col-6">
            <button class="btn btn-primary" v-on:click="restore()">Herstellen</button>
          </div>
          <div class="col-3">
          </div>  
        </div>
       </div>
       <div>
      </div>
      <div>
        <mfa-codes v-show="this.state.secretImageUri"
          v-bind:secretImageUri="this.state.secretImageUri"
          v-bind:recoveryCodes="this.state.recoveryCodes"></mfa-codes>
      </div>
      </div>
      
  </div>  
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue';
import authenticationService from '../api/AuthenticationService';
import MfaCodes from '../components/mfa-codes.vue';

interface State {
  code: string
  recoveryCode: string
  secretImageUri: string
  recoveryCodes: string[]
}

export default defineComponent({
    name: 'Mfa',
    components:{MfaCodes},
    
    mounted() {
    },

    methods: {
      getLoginToken() {
        return localStorage.getItem('loginToken');
      },
   
      verify() {        
        authenticationService.verifyMFACode(this.state.code)
          .then(response => {
             if (response.status == 200)  {
                localStorage.setItem("accessToken", response.data.accessToken);

                const refreshToken = response.data.refreshToken;

                if (refreshToken) {
                  localStorage.setItem("refreshToken", refreshToken);
                }                

                window.location.replace(origin + '/dashboard/');
             }
          }).catch(error => {
             console.log(error);
          });
      },

      restore() {
        authenticationService.recoverMFA(this.state.recoveryCode).then(response => {
          this.state.secretImageUri = response.data.secretImageUri;
          this.state.recoveryCodes = response.data.recoveryCodes;
        })
      }
  },

  setup() {
    const state: State = reactive({
      code: '',
      message: '',
      recoveryCode: '',
      canRecover: false,
      secretImageUri: '',
      recoveryCodes: []
    });

    return {
      state
    };

  },  
});
</script>

<style>
  .mfa-code-container {
    margin-bottom: 2rem;
  }
</style>
