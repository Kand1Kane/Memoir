from google.cloud.speech_v2 import SpeechClient
from google.cloud.speech_v2.types import cloud_speech

MODEL_ID="chirp_2"
PROJECT_ID="memoir-454600"

class Chirp2:
    def __init__(self, ):
        self.client = SpeechClient()
        self.config = cloud_speech.RecognitionConfig(
            auto_decoding_config=cloud_speech.AutoDetectDecodingConfig(),
            language_codes=["en-US"],
            model="long",
        )
    
    def convert(self, audio_file):
        with open(audio_file, "rb") as f:
            audio_content = f.read()

        request = cloud_speech.RecognizeRequest(
            recognizer=f"projects/{PROJECT_ID}/locations/global/recognizers/_",
            config=self.config,
            content=audio_content,
        )

        response = self.client.recognize(request=request)

        return response

    def process(self, response):
        processed = ""

        for result in response.results:
            processed += result.alternatives[0].transcript

        return processed

Listener = Chirp2()

lis_unprocessed = Listener.convert("/home/prj/Memoir/stt/TEST.m4a")

lis_result = Listener.process(lis_unprocessed)
print(f"Output of STT: {lis_result}")
