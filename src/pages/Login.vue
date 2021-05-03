<template>
   <div class="App jumbotron d-flex">
    <div class="container" v-if="state.showLogin">
      <div class="row">
        <div class="col-3">
        </div>  
        <div class="col-6 alert alert-success" v-if="state.message">
          {{state.message}}
        </div>
        <div class="col-6 alert alert-danger" v-if="state.errorNessage">
          {{state.errorNessage}}
        </div>
        <div class="col-3">
        </div>  
      </div>  
      <div class="row">
        <div class="col-3">
        </div>  
        <div class="col-6">
          <input class="form-control" 
                  placeholder="gebruikersnaam" 
                  v-model="state.email" 
                  v-on:focus="validateLoginInput" 
                  v-on:change="validateLoginInput"
                  v-on:keyup="validateLoginInput"
                  ref="email">
        </div>                   
        <div class="col-3">
        </div>  
      </div>
      <div class="row">
        <div class="col-3">
        </div>  
        <div class="col-6">
            <input class="form-control" 
                    placeholder="wachtwoord" 
                    type="password" 
                    v-model="state.password" 
                    v-on:focus="validateLoginInput" 
                    v-on:change="validateLoginInput"
                    v-on:keyup="validateLoginInput" />
        </div>                   
        <div class="col-3">
        </div>  
      </div>      
      <div class="row login-row">
        <div class="col-3">
        </div>  
        <div class="col-1">
            <button class="btn btn-primary" v-on:click="login()" :disabled="!state.loginEnabled" >Inloggen</button>
        </div>                   
      </div>
      <div class="row button-row">
        <div class="col-3">
        </div>  
        <div class="col-7">
            <router-link to="/login/signup">Registeren</router-link>
        </div>                   
      </div>            
      <div class="row button-row">
        <div class="col-3">
        </div>  
        <div class="col-7">
            <router-link to="/login/resetpassword">Wachtwoord opnieuw instellen</router-link>
        </div>                   
      </div>
    </div>              
   </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue';
import axios from 'axios';
import type { AuthenticationReponse } from '../api/model/AuthenticationReponse'
import orginService from '../api/OriginService';

interface State {
  email: string,
  password: string,
  loginEnabled: boolean,
  message: string,
  errorNessage: string
  showLogin: boolean,
  qrData: string,
  code: string
}

export default defineComponent({
    name: 'Login',
    components: {},
    
    mounted() {
      this.clearLocalStorage();
      this.state.qrData = "";
    },
   
    methods: {
        focusInput() {
          // @ts-ignore
           this.$refs.email.focus(); 
        },

        clearLocalStorage() {
          localStorage.removeItem("email");
          localStorage.removeItem("secretImageUri");
          localStorage.removeItem("gotoUrl");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        },

        login(): void {
          this.state.message = '';
          this.state.errorNessage = '';
          this.clearLocalStorage();

          const origin = orginService.getOrigin()
          const url = `${origin}/auth/authenticate/`;

          axios.post<AuthenticationReponse>(url, {
              email: this.state.email,
              password: this.state.password
          }).then(response => {
              if (response.data.secretImageUri) {
                localStorage.setItem("email", this.state.email);
                localStorage.setItem("secretImageUri", response.data.secretImageUri);
                localStorage.setItem("loginToken", response.data.loginToken);
                this.$router.push('/login/mfa')
              } else if (response.data.mfa) {
                localStorage.setItem("email", this.state.email);
                localStorage.setItem("gotoUrl", '/dashboard/');
                localStorage.setItem("loginToken", response.data.loginToken);
                this.$router.push('/login/mfa')
              } else {
                localStorage.setItem("accessToken", response.data.accessToken);

                const refreshToken = response.data.refreshToken;
                if (refreshToken) {
                  localStorage.setItem("refreshToken", refreshToken);
                }                
                window.location.replace('/dashboard/');
              }
          }).catch(error => {
              const status = error.response.status

              if (status == 401) {
              this.state.errorNessage = 'Ongeldige gebruikernaam en wachtwoord combinatie.';
              } else {
              this.state.errorNessage = 'Fout bij inloggen. Probeer het later nog eens.';
              }        
          })
        },

        canSendCode() {
          return this.state.code.length == 6;
        },

        validateLoginInput(evt: any): void {
            this.state.loginEnabled = this.state.email.length > 3 && this.state.password.length > 3;
        }
  },

  setup() {
    const state = reactive({
      email: '',
      password: '',
      errorNessage: '',
      loginEnabled: false,
      message: '',
      messageClasses: '',
      showLogin: true,
      qrData: '',
      code: ''
    });

    return {
      state
    };

  },  
});
</script>

<style>
.login-row {
  padding-top:30px;
}
.button-row {
  padding-top:10px;
}
</style>
