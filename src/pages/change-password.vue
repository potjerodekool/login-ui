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
          <input  class="form-control"
                  type="password"
                  placeholder="Wachtwoord"
                  v-model="state.password" 
                  v-on:focus="validateInput" 
                  v-on:change="validateInput"
                  v-on:keyup="validateInput" ref="password" />      
        </div>                   
        <div class="col-3">
        </div>  
      </div>
      <div class="row">
        <div class="col-3">
        </div>  
        <div class="col-6">
          <input  class="form-control"
                  type="password"
                  placeholder="Herhaal wachtwoord"
                  v-model="state.password2" 
                  v-on:focus="validateInput" 
                  v-on:change="validateInput"
                  v-on:keyup="validateInput" />      
        </div>                   
        <div class="col-3">
        </div>  
      </div>      
      <div class="row button-row">
        <div class="col-3">
        </div>  
        <div class="col-7">
          <button class="btn btn-primary forget-button" v-on:click="updatePassword" :disabled="state.disableButton" >Wachtwoord aanpassen</button>
        </div>                   
      </div>            
      <div class="row button-row">
        <div class="col-3">
        </div>  
        <div class="col-7">
          <button class="btn btn-primary forget-button" v-on:click="$router.push('/login')" >Terug</button>
        </div>                   
      </div>                  
    </div>              
   </div> 
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue';
import axios from 'axios';

interface State {
  email: string,
  validationToken: string,
  password: string,
  password2: string,
  disableButton: boolean,
  message: string,
  errorNessage: string
}

export default defineComponent({
    name: 'ChangePassword',

    components: {},
    mounted() {
       this.focusInput(); 
       this.processQueryParams();
    },
   
    methods: {
        focusInput() {
          //@ts-ignore
           this.$refs.password.focus(); 
        },
        processQueryParams() {
          //@ts-ignore
          this.state.email = this.$route.query['email'];
          //@ts-ignore
          this.state.validationToken = this.$route.query['validationtoken'];
        },

        updatePassword(): void {
          this.state.errorNessage = '';
          this.state.message = '';  

        // @ts-ignore
          const {SNOWPACK_PUBLIC_AUTH_HOST} = import.meta.env;

          axios.post(
            `${SNOWPACK_PUBLIC_AUTH_HOST}/auth/updatepassword`,
            {
              userId: `${this.state.email}`,
              newPassword: `${this.state.password}`,
              resetToken: `${this.state.validationToken}`
            }
          ).then(() => {
            this.state.message = 'Wacthwoord aangepast';  
          }).catch(() => {
            this.state.errorNessage = 'Wachtwoord aanpassen mislukt';
          }
          )
        },

        validateInput(): void {
           this.state.disableButton = 
           this.state.email == '' && this.state.validationToken == '' || !(this.state.password.length > 3 && this.state.password == this.state.password2);
        }
  },

  setup() {
    const state = reactive({
      email: '',
      validationToken: '',
      password: '',
      password2: '',
      disableButton: true,
      message: '',
      errorNessage: ''
    });

    return {
      state
    };
  },  
});
</script>

<style>
.button-row {
  padding-top:30px;
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
