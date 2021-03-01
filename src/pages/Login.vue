<template>
   <div class="App jumbotron d-flex">
    <div class="container">
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
                  v-model="state.username" 
                  v-on:focus="validateLoginInput" 
                  v-on:change="validateLoginInput"
                  v-on:keyup="validateLoginInput"
                  ref="username">
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
            <button class="btn btn-secondary forget-button" v-on:click="$router.push('/login/resetpassword')">Wachtwoord opnieuw instellen</button>
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
  username: string,
  password: string,
  loginEnabled: boolean,
  message: string,
  errorNessage: string
}

export default defineComponent({
    name: 'Login',

    components: {},

    mounted() {
      this.focusInput();
    },
   
    methods: {
        focusInput() {
          // @ts-ignore
           this.$refs.username.focus(); 
        },

        login(): void {
          this.state.message = '';
          this.state.errorNessage = '';

          const origin = orginService.getOrigin()
          const url = `${origin}/auth/authenticate/`;
          console.log(url);
          
          axios.post<AuthenticationReponse>(url, {
              email: this.state.username,
              password: this.state.password
          }).then(response => {
              localStorage.setItem("accessToken", response.data.accessToken);
              localStorage.setItem("refreshToken", response.data.refreshToken);
              window.location.replace('/dashboard');
          }).catch(error => {
              const status = error.response.status

              if (status == 401) {
              this.state.errorNessage = 'Ongeldige gebruikernaam en wachtwoord combinatie.';
              } else {
              this.state.errorNessage = 'Fout bij inloggen. Probeer het later nog eens.';
              }        
          })
        },

        validateLoginInput(evt: any): void {
            this.state.loginEnabled = this.state.username.length > 3 && this.state.password.length > 3;
        }
  },

  setup() {
    const state = reactive({
      username: '',
      password: '',
      errorNessage: '',
      loginEnabled: false,
      message: '',
      messageClasses: ''
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

@keyframes App-logo-spin {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.06);
  }
}
</style>
