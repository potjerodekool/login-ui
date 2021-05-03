<template>
   <div class="App jumbotron d-flex">
    <div v-if="this.state.showSignup" class="container">
      <div class="row">
        <div class="col-3">
        </div>  
        <div class="col-6">
          {{state.errorMessage}}
        </div>  
      </div>
      <div class="row">
        <div class="col-3">
        </div>  
        <div class="col-6">
          <input class="form-control" 
                  placeholder="gebruikersnaam" 
                  v-model="state.email" 
                  v-on:focus="validateInput" 
                  v-on:change="validateInput"
                  v-on:keyup="validateInput"
                  ref="email">
        </div>
      </div>
      <div class="row">
        <div class="col-3">
        </div>  
        <div class="col-6">
            <input class="form-control" 
                  placeholder="Wachtwoord" 
                  type="password"
                  v-model="state.password" 
                  v-on:focus="validateInput" 
                  v-on:change="validateInput"
                  v-on:keyup="validateInput">
        </div>  
      </div>
      <div class="row">  
        <div class="col-3">
        </div>  
        <div class="col-6">
          <input class="form-control" 
                  placeholder="Herhalen"
                  type="password"
                  v-model="state.password2" 
                  v-on:focus="validateInput" 
                  v-on:change="validateInput"
                  v-on:keyup="validateInput">
        </div>
      </div>
      <div class="row">
        <div class="col-3">
        </div>
        <div class="col-6">
          Twee factor authenticatie <input type="checkbox" v-model="state.mfa" >
        </div>
      </div>  
      <div class="row">
        <div class="col-3">
        </div>  
        <div class="col-6">
          <button class="btn btn-primary" v-on:click="signup()" :disabled="!state.canRegister" >Registeren</button>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
        </div> 
        <div class="col-6">
          <router-link to="/login">Inloggen</router-link>
        </div>
      </div>
    </div>
    <div v-else class="container">
      <div class="row">
          <div class="col-3">
          </div>  
          <div class="col-6">
            <img :src="this.state.secretImageUri">
          </div>  
          <div class="col-3">
          </div>  
        </div>
        <div class="row" v-show="this.state.recoveryCodes">
          <div class="col-3">
          </div>  
          <div class="col-6">
            <div>
              Herstelcodes:
            </div>
            <div v-for="recoveryCode in this.state.recoveryCodes" :key="recoveryCode">
              {{recoveryCode}}
            </div>
          </div>  
          <div class="col-3">
          </div>
        </div>
        <div class="row">
          <div class="col-3">
          </div> 
          <div class="col-6">
            <router-link to="/login">Inloggen</router-link>
          </div>
      </div>
   </div>
   </div>      
   
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue';
import axios from 'axios';
import type { SignupResponse } from '../api/model/SignupResponse';
import orginService from '../api/OriginService';

interface State {
  email?: string
  password?: string
  password2?: string
  canRegister: boolean
  mfa: boolean
  errorMessage?: string
  secretImageUri?: string
  recoveryCodes?: string[]
  showSignup: boolean
}

export default defineComponent({
    name: 'Signup',
    components: {},
    
    mounted() {
      this.focusInput();
    },
   
    methods: {
        focusInput() {
          //@ts-ignore
          this.$refs.email.focus(); 
        },

        validateInput(evt: any): void {
          this.state.canRegister = 
            (this.state.email?.indexOf('@') ?? -1) > -1
            && (this.state.password?.length ?? 0) > 3 
            && this.state.password == this.state.password2
        },

        signup() {
          const origin = orginService.getOrigin()
          const url = `${origin}/auth/signup`;
          this.state.secretImageUri = '';
          this.state.recoveryCodes = Array<string>();

           axios.post<SignupResponse>(url, 
            {
             email: this.state.email,
             password: this.state.password,
             mfa: this.state.mfa
            }
           ).then(response => {

             if (response.data.secretImageUri) {
               this.state.secretImageUri = response.data.secretImageUri;
               this.state.recoveryCodes = response.data.recoveryCodes;
               this.state.showSignup = false;
             } else {
              this.$router.push('/login');
             }
           }).catch(error => {
              console.log(error);
              this.state.errorMessage = 'Mislukt';
           }); 
        }
  },

  setup() {
    const state: State = reactive({
      canRegister: false,
      mfa: false,
      showSignup: true
    });

    return {
      state
    };

  },  
});
</script>

<style>
  .row {
    margin: 15px;
  }

  
  
@keyframes App-logo-spin {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.06);
  }
}
</style>
