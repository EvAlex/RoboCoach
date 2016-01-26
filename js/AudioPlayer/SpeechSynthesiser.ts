
export class SpeechSynthesiser {
    constructor () {
        window.speechSynthesis.getVoices();
    }

    public say(text: string): void {
        var msg: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(),
            lang: string = "ru-RU",
            voices: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();
        msg.voice = voices.filter(v => v.lang === lang)[0];
        msg.voiceURI = "native";
        msg.volume = 1; // 0 to 1
        msg.rate = 1; // 0.1 to 10
        msg.pitch = 1; // 0 to 2
        msg.text = text;
        msg.lang = lang;

        msg.onend = (e) => {
            console.log(`Finished in ${e.elapsedTime} seconds.`);
        };

        speechSynthesis.speak(msg);
    }
}

window["SpeechSynthesiser"] = new SpeechSynthesiser();

export default new SpeechSynthesiser();
