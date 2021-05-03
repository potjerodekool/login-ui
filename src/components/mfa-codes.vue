<template>
    <div class="container">
    <div class="row">
            <div class="col-3">
            </div>  
            <div class="col-6">
                <img :src="secretImageUri">
            </div>  
            <div class="col-3">
            </div>  
        </div>
        <div class="row">
            <div class="col-3">
            </div>  
            <div class="col-6">
            <div>
                Herstelcodes:
            </div>
            <div v-for="recoveryCode in recoveryCodes" :key="recoveryCode">
                {{recoveryCode}}
            </div>
            </div>  
            <div class="col-3">
            </div>
        </div>
        
    </div>    
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue';

export default defineComponent({
    name: 'MfaCodes',
    components: {},
    props: ["secretImageUri", "recoveryCodes"],
    
    mounted() {
    },
   
    methods: {

    },
 
});
</script>

<style>
</style>
