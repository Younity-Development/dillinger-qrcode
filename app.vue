<template>
  <div class="container text-center">
        <h1>Younity Youtube Downloader</h1>
        <hr>
        <div v-if="!loading">
          <div v-if="mode == 'pending'">
            <div class="mb-3">
              <label for="urlInput" class="form-label">URL</label>
              <input type="url" class="form-control" id="urlInput" v-model="url" aria-describedby="urlHelp">
              <div id="urlHelp" class="form-text">Vous pouvez mettre l'url de la vidéo Youtube que vous voulez télécharger !</div>
            </div>
            <a class="btn btn-primary" @click="search()">Cherché la vidéo</a>
          </div>
          <div v-else-if="mode == 'downloading'" class="card">
            <img :src="data.thumbnails" class="card-img-top" alt="...">
            <div class="card-body">
              <div class="mb-3">
              <p class="card-text">{{ data.title }}</p>
                <label for="urlInput" class="form-label">Type</label><br>
                <select class="form-select" name="type" v-model="type"  @change="updatItag()">
                  <option value="mp4">Vidéo</option>
                  <option value="mp3">Audio</option>
                </select>
                <div id="urlHelp" class="form-text">Choisir si vous voulez l'audio ou la vidéo</div>
                <br>
                <label for="urlInput" class="form-label">Qualité / Extension</label><br>
                <select v-if="type == 'mp4'" class="form-select" name="itag" v-model="itag">
                  <option v-for="format in data.formatsVideo" :value="format.itag">{{ `${format.qualityLabel} / ${format.container}` }}</option>
                </select>
                <select v-if="type == 'mp3'" class="form-select" name="itag" v-model="itag">
                  <option v-for="format in data.formatsAudio" :value="format.itag">
                    <span v-if="format.audioQuality == 'AUDIO_QUALITY_MEDIUM'">Elevé</span>
                    <span v-else-if="format.audioQuality == 'AUDIO_QUALITY_LOW'">Faible</span>
                    <span v-else>{{ format.audioQuality }}</span>
                  </option>
                </select>
                <div v-if="type == 'mp4'" id="urlHelp" class="form-text">Choisir la qualité de la vidéo</div>
                <div v-if="type == 'mp3'" id="urlHelp" class="form-text">Choisir la qualité de l'audio</div>
              </div>
              <div class="d-grid gap-2">
                <a class="btn btn-primary " @click="download()">Télécharger</a>
                <a class="btn btn-danger " @click="home()">Annuler</a>
              </div>
            </div>
          </div>
          <div v-else-if="mode == 'download'">
            <h1>Le téléchargement à commencer !</h1>
            <div class="d-grid gap-2">
              <a class="btn btn-primary " @click="home()">Retourner a l'acceuil</a>
            </div>
          </div>
          <div v-else-if="mode == 'error'">
          </div>
        </div>
        <div v-else class="loader loader--style8" title="7" style="height: 50px;">
          <h1>Chargement <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
            <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
            </rect>
          </svg>
          </h1>
          <br>
        <a class="btn btn-danger" @click="home()">Annuler</a>
        </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel" style="color: red;">Erreur</h1>
            <button @click="home()" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ errorText }}
          </div>
        </div>
      </div>
    </div>
</template>
<script>
const regexYoutubeURL = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|)([A-Za-z0-9_-]+)/;
import axios from "axios";
import getYoutubeID from "get-youtube-id"
export default {
  data(){
    return {
      url: null,
      type: null,
      baseAPIURL: "https://api.younity-mc.fr/youtube/",
      mode: "pending",
      id: null,
      itag: "",
      loading: false,
      data: null,
      audioBitrate: null,
      errorText: null
    }
  },
  mounted(){

  },
  methods: {
    updatItag(){
      if(this.type == "mp4"){
        this.itag = this.data.defaultITAGVideo
      } else if(this.type == "mp3") {
        this.itag = this.data.defaultITAGAudio
      }
    },
    error(text){
      if(text == "Network Error"){
        this.errorText = "Problème de connection avec le serveur"
      } else {
        this.errorText = text
      }
      $("#exampleModal").modal("show");
    },
    home(){
      this.loading = true
      this.id = null
      this.data = null
      this.url = null
      this.mode = "pending"
      this.loading = false
    },
    async search(){
      try {
        if(this.url == null){
          return
        }
        if(regexYoutubeURL.test(this.url)){
          this.loading = true
          this.id = getYoutubeID(this.url)
          console.log("id: " + this.id)
          const res = (await axios.get(this.baseAPIURL + `search/${this.id}`)).data
          this.data = res.data
          this.itag = this.data.defaultITAGVideo
          this.type = "mp4"
          this.mode = "downloading"
          this.loading = false
        } else {
          this.error("Le lien est invalide !")
        }
      } catch(e){
        this.error(e.message)
      }
    },
    async download(){
      try {
        if(this.itag == null && this.type == null){
          console.error("Manque des paramètres")
          return
        }
        this.loading = true
        if(this.type == "mp3"){
          this.audioBitrate = (this.data.formatsAudio.find(e => e.itag == this.itag)).audioBitrate
        }
        const adder = (this.audioBitrate != null ? `?audioBitrate=${this.audioBitrate}` : "")
        const data = (await axios.get(this.baseAPIURL + `downloading/${this.id}/${this.type}/${this.itag}` + adder)).data
        navigateTo(data.url, {
          "external": true
        })
        this.mode = "download"
        this.loading = false
      } catch(e){
        this.error(e.message)
      }
    }
  }
}
</script>
<style>
body {
    background-color: #000;
    color: #fff;
}
.container {
    padding: 50px;
}
svg path,
svg rect{
  fill: #FF6700;
}
</style>