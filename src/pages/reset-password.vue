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
                  placeholder="e-mail adres"
                  v-model="state.email" 
                  v-on:focus="validateInput" 
                  v-on:change="validateInput"
                  v-on:keyup="validateInput" ref="email" />      
        </div>                   
        <div class="col-3">
        </div>  
      </div>
      <div class="row button-row">
        <div class="col-3">
        </div>  
        <div class="col-7">
          <button class="btn btn-primary forget-button" v-on:click="resetPassword" :disabled="state.disableButton" >Wachtwoord opnieuw instellen</button>
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
  email: string
  disableButton: boolean,
  message: string,
  errorNessage: string
}

export default defineComponent({
    name: 'ResetPassword',

    components: {},
    mounted() {
       this.focusInput(); 
    },
   
    methods: {
        focusInput() {
          //@ts-ignore
           this.$refs.email.focus(); 
        },
        resetPassword(): void {
          this.state.errorNessage = '';
          this.state.message = '';  

        // @ts-ignore
          const {SNOWPACK_PUBLIC_AUTH_HOST} = import.meta.env;

          axios.post(
            `${SNOWPACK_PUBLIC_AUTH_HOST}/auth/requestresetPassword`,
            {
              userid: `${this.state.email}`
            }
          ).then(() => {
            this.state.message = 'Mail verstuurd';  
          }).catch(() => {
            this.state.errorNessage = 'Actie mislukt';
          }
          )
        },

        validateInput(): void {
           const atIndex = this.state.email.lastIndexOf('@')
           const dotIndex = this.state.email.lastIndexOf('.')
           this.state.disableButton = atIndex < 0 && dotIndex < atIndex;
        }
  },

  setup() {
    const state = reactive({
      email: '',
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
