const ACCOUNTSID = "#";
const AUTHTOKEN = "#";
const WHATSAPP_SANDBOX_NUMBER = "#"

// Configu twilio
var twilio = require('twilio');
var client = new twilio(ACCOUNTSID, AUTHTOKEN);



// Config firebase
var admin = require("firebase-admin");

var serviceAccount = require("#");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "#"
});


let db = admin.firestore();


// recebe url: https://drive.google.com/open?id=1UqyKfhYn_npN-hkU80eUuTZ80XE4iKqo
function get_drive_url(url){
	var re = new RegExp("\=(.*)$");
	var id = url.match(re)[1];
	console.log(id)
	return "https://drive.google.com/uc?export=view&id=" + id
}



// envia video
function send_video(phone, video_url){

	client.messages
	 .create({
	   from: 'whatsapp:' + WHATSAPP_SANDBOX_NUMBER,
	   to: 'whatsapp:' + phone,
	   mediaUrl: video_url,

	 })
	 .then(message => {
	   console.log(message.sid);
	   console.log("video enviado com sucesso");
	 })
	 .catch(err => {
	   console.error(err);
	 });

}

// envia msg
function send_message(phone, message){

	client.messages
	 .create({
	   from: 'whatsapp:' + WHATSAPP_SANDBOX_NUMBER,
	   to: 'whatsapp:' + phone,
	   body: message

	 })
	 .then(message => {
	   console.log(message.sid);
	   console.log("msg enviada com sucesso");
	 })
	 .catch(err => {
	   console.error(err);
	 });

}


// recebe usuarios que querem ficar atualizados

let userRef = db.collection('Usuario');
let query = userRef.where('send_news', '==', true).get()
.then(snapshot => {
	if (snapshot.empty) {
		console.log('No matching documents.');
		return;
	}


	

	snapshot.forEach(doc => {
		console.log(doc.id, '=>', doc.data());

		data = {
			first_name: doc.data().first_name,
			phone: doc.id,
		};

		video: "https://drive.google.com/open?id=1UqyKfhYn_npN-hkU80eUuTZ80XE4iKqo",
		message: "Hoje, esse o vídeo"

		



		send_message(data.phone, message);
		send_video(data.phone, get_drive_url(video));
		


	});


})
.catch(err => {
	console.log('Error getting documents', err);
});



// proximo passo: implementar cron. envia todos os dias as 09 horas

// cronJob = require('cron').CronJob;

// var textJob = new cronJob( '0 09 * * *', function(){

// 	// recuperar noticias do dia de bd, disparar todos os dias as 09 da manha


// },  null, true);


